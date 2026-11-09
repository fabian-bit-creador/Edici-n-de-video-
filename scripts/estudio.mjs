#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { leerJson, validarBrief, validarContenido } from '../lib/contratos.mjs';
import { guardarCampana, plantillaContenido, prepararCampana, promptGpt } from '../lib/campana.mjs';
import { informeMetricas, resumirMetricas } from '../lib/metricas.mjs';
import { ejecutarPlan, planCortes, planRender } from '../lib/media.mjs';

const ayuda = `Estudio de contenido · MiComuna360 / Monitoreo Intensivo / Sindicato / nuevos negocios

Desde la raíz del repositorio:
  npm run demo
  npm run estudio -- marcas
  npm run estudio -- prompt --brief ejemplos/brief-micomuna360.json
  npm run estudio -- validar --brief mi-brief.json --contenido contenido-gpt.json
  npm run estudio -- campana --brief mi-brief.json --contenido contenido-gpt.json --out trabajo/campana-01
  npm run estudio -- render --props trabajo/demo/props-a.json --formato vertical --out trabajo/demo/video-a-vertical.mp4 --ejecutar
  npm run estudio -- cortes --input grabaciones/master.mp4 --modo preview --ejecutar
  npm run estudio -- cortes --input grabaciones/master.mp4 --modo video --out trabajo/corte.mp4 --ejecutar
  npm run estudio -- metricas --input ejemplos/metricas-demo.csv

campana sin --contenido crea una plantilla editable, sin llamar a una IA.
prompt prepara el material para ChatGPT/Codex. Guarda su respuesta JSON y valídala.
render y cortes muestran el plan; solo ejecutan al añadir --ejecutar.
Más instrucciones: README.md y docs/flujo-de-trabajo.md.
`;

const opciones = {
  ayuda: {}, marcas: {},
  prompt: { brief: { type: 'string' }, out: { type: 'string' } },
  validar: { brief: { type: 'string' }, contenido: { type: 'string' } },
  campana: { brief: { type: 'string' }, contenido: { type: 'string' }, out: { type: 'string' } },
  render: { props: { type: 'string' }, formato: { type: 'string' }, out: { type: 'string' }, ejecutar: { type: 'boolean' } },
  cortes: { input: { type: 'string' }, out: { type: 'string' }, modo: { type: 'string' }, umbral: { type: 'string' }, margen: { type: 'string' }, ejecutar: { type: 'boolean' } },
  metricas: { input: { type: 'string' }, out: { type: 'string' } },
};

function obligatorio(valor, nombre) {
  if (!valor) throw new Error(`Falta --${nombre}. Consulta npm run estudio -- ayuda.`);
  return valor;
}

function imprimirOguardar(texto, salida) {
  if (!salida) console.log(texto);
  else {
    fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
    fs.writeFileSync(salida, texto, { flag: 'wx' });
    console.log(`Guardado: ${path.resolve(salida)}`);
  }
}

try {
  const comando = process.argv[2] || 'ayuda';
  if (!(comando in opciones) || !Object.hasOwn(opciones, comando)) throw new Error(`Comando desconocido: ${comando}`);
  const { values: args } = parseArgs({ args: process.argv.slice(3), options: opciones[comando], allowPositionals: false });
  if (comando === 'ayuda') console.log(ayuda);
  else if (comando === 'marcas') {
    for (const marca of leerJson(new URL('../config/marcas.json', import.meta.url))) console.log(`${marca.id}: ${marca.nombre}`);
  } else if (['prompt', 'validar', 'campana'].includes(comando)) {
    const brief = validarBrief(leerJson(obligatorio(args.brief, 'brief')));
    if (comando === 'prompt') imprimirOguardar(promptGpt(brief), args.out);
    else {
      const contenido = args.contenido ? validarContenido(leerJson(args.contenido), brief) : plantillaContenido(brief);
      if (comando === 'validar') {
        if (!args.contenido) throw new Error('Indica --contenido para validar la respuesta de GPT.');
        console.log('Brief y contenido válidos. Falta revisión editorial de fuentes y afirmaciones.');
      } else {
        const archivos = prepararCampana(brief, contenido, args.contenido ? 'contenido importado' : 'plantilla sin IA');
        console.log(`Campaña creada: ${guardarCampana(obligatorio(args.out, 'out'), archivos)}\n${Object.keys(archivos).length} archivos; estado borrador.`);
      }
    }
  } else if (comando === 'metricas') {
    const csv = fs.readFileSync(obligatorio(args.input, 'input'), 'utf8');
    imprimirOguardar(informeMetricas(resumirMetricas(csv)), args.out);
  } else {
    const plan = comando === 'cortes' ? planCortes(args) : planRender(args, leerJson(obligatorio(args.props, 'props')));
    console.log(`Plan (programa y argumentos, sin shell):\n${JSON.stringify([plan.comando, ...plan.args], null, 2)}`);
    if (args.ejecutar) ejecutarPlan(plan);
    else console.log('Añade --ejecutar para procesar.');
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
