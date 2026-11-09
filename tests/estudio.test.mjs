import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { raiz, leerJson, validarBrief, validarContenido, validarVideo } from '../lib/contratos.mjs';
import { enlaceUtm, guardarCampana, plantillaContenido, prepararCampana } from '../lib/campana.mjs';
import { escribirCsv, leerCsv } from '../lib/csv.mjs';
import { informeMetricas, resumirMetricas } from '../lib/metricas.mjs';
import { planCortes, planRender } from '../lib/media.mjs';

const ejemplo = () => leerJson(new URL('../ejemplos/brief-micomuna360.json', import.meta.url));
const contenido = () => leerJson(new URL('../ejemplos/contenido-micomuna360.json', import.meta.url));
const csvDemo = () => fs.readFileSync(new URL('../ejemplos/metricas-demo.csv', import.meta.url), 'utf8');
function temporal(t) {
  const directorio = fs.mkdtempSync(path.join(os.tmpdir(), 'estudio-'));
  t.after(() => fs.rmSync(directorio, { recursive: true, force: true }));
  return directorio;
}

test('los cuatro proyectos generan paquetes válidos sin mezclarse', () => {
  for (const nombre of ['micomuna360', 'monitoreo-intensivo', 'sindicato', 'futuro-negocio']) {
    const brief = validarBrief(leerJson(new URL(`../ejemplos/brief-${nombre}.json`, import.meta.url)));
    const archivos = prepararCampana(brief, plantillaContenido(brief));
    const publicaciones = leerCsv(archivos['publicaciones.csv']);
    assert.equal(publicaciones.length, brief.canales.length * 2);
    assert.ok(publicaciones.every((p) => p.marca_id === nombre && p.estado === 'borrador'));
    validarVideo(JSON.parse(archivos['props-a.json']));
    validarVideo(JSON.parse(archivos['props-b.json']));
    assert.ok(archivos['guion.md'].includes('Fuentes de trabajo'));
  }
});

test('las variantes cambian el gancho visual y hablado, y conservan las otras escenas', () => {
  const original = contenido();
  const antes = JSON.stringify(original);
  const archivos = prepararCampana(ejemplo(), original, 'contenido importado');
  const a = JSON.parse(archivos['props-a.json']);
  const b = JSON.parse(archivos['props-b.json']);
  assert.equal(a.escenas[0].titulo, original.ganchos[0]);
  assert.equal(b.escenas[0].locucion, original.ganchos[1]);
  assert.deepEqual(a.escenas.slice(1), b.escenas.slice(1));
  assert.equal(JSON.stringify(original), antes);
  assert.equal(a.audio, '');
});

test('los enlaces conservan parámetros propios y fragmentos y tienen atribución por pieza', () => {
  const url = new URL(enlaceUtm('https://example.com/p?comuna=7&utm_source=anterior#mapa', 'campana', 'instagram', 'pieza-b'));
  assert.equal(url.searchParams.get('comuna'), '7');
  assert.equal(url.hash, '#mapa');
  assert.equal(url.searchParams.get('utm_source'), 'instagram');
  assert.equal(url.searchParams.get('utm_content'), 'pieza-b');
});

test('se rechazan enlaces inseguros, marcas inexistentes y campos inesperados', () => {
  for (const destino of ['javascript:alert(1)', 'http://example.com', 'https://user:password@example.com']) {
    assert.throws(() => validarBrief({ ...ejemplo(), destino }));
  }
  assert.throws(() => validarBrief({ ...ejemplo(), marca_id: 'otra' }), /Marca desconocida/);
  assert.throws(() => validarBrief({ ...ejemplo(), token: 'no-se-debe-aceptar' }), /additional properties/);
  assert.throws(() => validarBrief({ ...ejemplo(), tema: '   ' }), /Texto vacío/);
});

test('un destino de ejemplo y una fecha imposible no pasan por contenido real', () => {
  assert.throws(() => validarBrief({ ...ejemplo(), es_demo: false, destino: 'https://example.com/oferta' }), /destino de ejemplo/);
  const brief = ejemplo();
  brief.fuentes[0].verificado_el = '2026-02-30';
  assert.throws(() => validarBrief(brief), /Fecha de fuente inválida/);
});

test('se detecta un guion con duración incorrecta o texto que excede el contrato', () => {
  const datos = contenido();
  datos.escenas[0].segundos++;
  assert.throws(() => validarContenido(datos, ejemplo()), /suman 25s/);
  datos.escenas[0].segundos--;
  datos.escenas[1].titulo = 'a'.repeat(86);
  assert.throws(() => validarContenido(datos, ejemplo()), /85 characters/);
});

test('guardar una campaña no sobrescribe una carpeta existente', (t) => {
  const salida = path.join(temporal(t), 'campana');
  const archivos = prepararCampana(ejemplo(), contenido());
  guardarCampana(salida, archivos);
  fs.writeFileSync(path.join(salida, 'nota-del-usuario.txt'), 'conservar');
  assert.throws(() => guardarCampana(salida, archivos), /ya existe/);
  assert.equal(fs.readFileSync(path.join(salida, 'nota-del-usuario.txt'), 'utf8'), 'conservar');
});

test('CSV conserva comas, comillas, saltos de línea y BOM; neutraliza fórmulas', () => {
  const csv = escribirCsv([['texto', 'descripcion'], ['Hola, "mundo"', 'Dos\nlíneas'], ['=IMPORTXML("url")', '@acción']]);
  const filas = leerCsv(`\uFEFF${csv}`);
  assert.equal(filas[0].texto, 'Hola, "mundo"');
  assert.equal(filas[0].descripcion, 'Dos\nlíneas');
  assert.ok(filas[1].texto.startsWith("'="));
  assert.ok(filas[1].descripcion.startsWith("'@"));
  assert.throws(() => leerCsv('a,b\n"sin cierre,b'), /comillas/);
  assert.throws(() => leerCsv('a,a\n1,2'), /repetidos/);
  assert.throws(() => leerCsv('a,b\n1,2,3'), /celdas/);
});

test('las tasas usan sus denominadores y un cero produce ausencia de tasa', () => {
  const resumen = resumirMetricas(csvDemo());
  assert.equal(resumen.grupos[0].tasa_visita, 0.04);
  assert.equal(resumen.grupos[0].tasa_consulta, 0.2);
  assert.equal(resumen.grupos[0].tasa_venta, 0.25);
  assert.equal(resumen.grupos[0].coste_consulta, 1250);
  assert.equal(resumen.grupos[2].tasa_visita, null);
  assert.equal(resumen.grupos[2].ingresos_por_coste, null);
  assert.ok(informeMetricas(resumen).includes('no utilidad'));
});

test('no se suman duplicados, monedas diferentes, números vacíos o negativos', () => {
  const csv = csvDemo();
  assert.throws(() => resumirMetricas(csv + csv.split('\n')[1]), /Pieza repetida/);
  assert.throws(() => resumirMetricas(csv.replace('10000,CLP', '10000,USD')), /monedas diferentes/);
  assert.throws(() => resumirMetricas(csv.replace(',1000,40', ',,40')), /número no negativo/);
  assert.throws(() => resumirMetricas(csv.replace(',1000,40', ',-1,40')), /número no negativo/);
});

test('el plan de cortes pasa rutas como argumentos y protege los originales', (t) => {
  const dir = temporal(t);
  const input = path.join(dir, 'mi video; $(no-ejecutar).mp4');
  fs.writeFileSync(input, 'archivo sintético para construir el plan');
  const preview = planCortes({ input });
  assert.equal(preview.args[0], input);
  assert.ok(preview.args.includes('--preview'));
  assert.throws(() => planCortes({ input, out: input, modo: 'video' }), /ya existe/);
  assert.throws(() => planCortes({ input, umbral: 'NaN' }), /umbral/);
  const resolve = planCortes({ input, out: path.join(dir, 'cortes.fcpxml'), modo: 'resolve' });
  assert.ok(resolve.args.includes('resolve'));
});

test('el plan de render valida el contrato, las rutas de audio y el formato', (t) => {
  const dir = temporal(t);
  const props = path.join(dir, 'props.json');
  const datos = JSON.parse(prepararCampana(ejemplo(), contenido())['props-a.json']);
  fs.writeFileSync(props, JSON.stringify(datos));
  const plan = planRender({ props, out: path.join(dir, 'video.mp4') }, datos);
  assert.ok(plan.args.includes('ContenidoVertical'));
  assert.throws(() => planRender({ props, formato: '../otra', out: path.join(dir, 'v.mp4') }, datos), /formato/);
  for (const audio of ['../../privado/voz.mp3', 'https://example.com/audio.mp3', '/audio.mp3']) {
    assert.throws(() => validarVideo({ ...datos, audio }), /audio debe/);
  }
});

test('la CLI genera un paquete y falla claramente ante argumentos inválidos', (t) => {
  const salida = path.join(temporal(t), 'salida');
  const cli = path.join(raiz, 'scripts', 'estudio.mjs');
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd: raiz, encoding: 'utf8' });
  const resultado = run('campana', '--brief', 'ejemplos/brief-micomuna360.json', '--contenido', 'ejemplos/contenido-micomuna360.json', '--out', salida);
  assert.equal(resultado.status, 0, resultado.stderr);
  assert.equal(leerCsv(fs.readFileSync(path.join(salida, 'publicaciones.csv'), 'utf8')).length, 6);
  const invalido = run('campana', '--brief', 'ejemplos/brief-micomuna360.json', '--borrar-todo');
  assert.equal(invalido.status, 1);
  assert.ok(invalido.stderr.includes('Error:'), JSON.stringify({ stdout: invalido.stdout, stderr: invalido.stderr }));
});
