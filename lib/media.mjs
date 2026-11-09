import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { raiz, validarVideo } from './contratos.mjs';

export const proyectoVideo = path.join(raiz, 'videos', 'micomuna360-gasto-municipal');
export const formatos = { vertical: 'ContenidoVertical', cuadrado: 'ContenidoCuadrado', horizontal: 'ContenidoHorizontal' };

function entradaLocal(archivo) {
  if (!archivo) throw new Error('Indica --input con un archivo local.');
  const ruta = path.resolve(archivo);
  if (!fs.existsSync(ruta) || !fs.statSync(ruta).isFile()) throw new Error(`No existe el archivo: ${ruta}`);
  return ruta;
}

function salidaNueva(archivo, extension) {
  if (!archivo) throw new Error('Indica --out con un archivo de salida nuevo.');
  const ruta = path.resolve(archivo);
  if (path.extname(ruta).toLowerCase() !== extension) throw new Error(`La salida debe tener extensión ${extension}.`);
  if (fs.existsSync(ruta)) throw new Error(`La salida ya existe: ${ruta}. Elige otro nombre.`);
  return ruta;
}

export function planCortes({ input, out, modo = 'preview', umbral = '0.04', margen = '0.2' }, bin = process.env.AUTO_EDITOR_BIN || 'auto-editor') {
  const entrada = entradaLocal(input);
  if (!['preview', 'video', 'resolve', 'premiere'].includes(modo)) throw new Error('modo debe ser preview, video, resolve o premiere.');
  const nivel = Number(umbral), pausa = Number(margen);
  if (!Number.isFinite(nivel) || nivel <= 0 || nivel > 1) throw new Error('umbral debe estar entre 0 (excluido) y 1.');
  if (!Number.isFinite(pausa) || pausa < 0.1 || pausa > 2) throw new Error('margen debe estar entre 0.1 y 2 segundos.');
  if (modo === 'preview' && out) throw new Error('preview analiza sin crear un archivo: omite --out.');
  const args = [entrada, '--edit', `audio:threshold=${nivel}`, '--margin', `${pausa}sec`];
  let salida;
  if (modo === 'preview') args.push('--preview');
  else {
    salida = salidaNueva(out, { video: '.mp4', resolve: '.fcpxml', premiere: '.xml' }[modo]);
    if (modo !== 'video') args.push('--export', modo);
    args.push('--output', salida);
  }
  return { comando: bin, args, salida };
}

export function planRender({ props, formato = 'vertical', out }, datos) {
  if (!formatos[formato]) throw new Error('formato debe ser vertical, cuadrado u horizontal.');
  validarVideo(datos);
  const archivoProps = entradaLocal(props);
  if (datos.audio) entradaLocal(path.join(proyectoVideo, 'public', datos.audio));
  const salida = salidaNueva(out, '.mp4');
  return {
    comando: process.execPath,
    args: [path.join(proyectoVideo, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), 'render', formatos[formato], salida, '--props', archivoProps],
    cwd: proyectoVideo,
    salida,
    requiere: path.join(proyectoVideo, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'),
  };
}

export function ejecutarPlan(plan) {
  if (plan.requiere && !fs.existsSync(plan.requiere)) throw new Error('Falta Remotion. Ejecuta npm run video:instalar desde la raíz.');
  if (plan.salida) fs.mkdirSync(path.dirname(plan.salida), { recursive: true });
  const resultado = spawnSync(plan.comando, plan.args, { stdio: 'inherit', shell: false, cwd: plan.cwd });
  if (resultado.error?.code === 'ENOENT') throw new Error('No se encontró la herramienta. Revisa docs/herramientas.md y AUTO_EDITOR_BIN.');
  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0) throw new Error(`La herramienta terminó con ${resultado.signal || resultado.status}. Revisa su salida.`);
  if (plan.salida && !fs.existsSync(plan.salida)) throw new Error('La herramienta no creó el archivo esperado.');
}
