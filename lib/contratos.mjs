import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

export const raiz = fileURLToPath(new URL('../', import.meta.url));
export const leerJson = (archivo) => JSON.parse(fs.readFileSync(archivo, 'utf8').replace(/^\uFEFF/, ''));
export const esquemaBrief = leerJson(new URL('../esquemas/brief.schema.json', import.meta.url));
export const esquemaContenido = leerJson(new URL('../esquemas/contenido.schema.json', import.meta.url));
export const esquemaVideo = leerJson(new URL('../esquemas/video.schema.json', import.meta.url));
const ajv = new Ajv({ allErrors: true });
const validadores = new Map();

export function validarEsquema(datos, esquema, nombre) {
  if (!validadores.has(esquema)) validadores.set(esquema, ajv.compile(esquema));
  const validar = validadores.get(esquema);
  if (!validar(datos)) {
    throw new Error(`${nombre}: ${ajv.errorsText(validar.errors, { separator: '\n', dataVar: nombre })}`);
  }
  revisarTextos(datos);
  return datos;
}

function revisarTextos(valor, ruta = '') {
  if (typeof valor === 'string' && valor.length > 0 && !valor.trim()) {
    throw new Error(`Texto vacío en ${ruta}.`);
  }
  if (Array.isArray(valor)) valor.forEach((v, i) => revisarTextos(v, `${ruta}/${i}`));
  else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) revisarTextos(v, `${ruta}/${k}`);
  }
}

export function urlPublica(texto) {
  let url;
  try { url = new URL(texto); } catch { throw new Error(`URL inválida: ${texto}`); }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Usa una URL HTTPS sin credenciales.');
  }
  return url;
}

export function marcaPorId(id) {
  const marcas = leerJson(new URL('../config/marcas.json', import.meta.url));
  if (new Set(marcas.map((m) => m.id)).size !== marcas.length) throw new Error('Hay marcas con ID repetido.');
  const marca = marcas.find((m) => m.id === id);
  if (!marca) throw new Error(`Marca desconocida: ${id}. Configúrala en config/marcas.json.`);
  if (!/^#[0-9a-f]{6}$/i.test(marca.color) || !marca.nombre?.trim() || marca.nombre.length > 42) {
    throw new Error('La marca necesita un nombre de hasta 42 caracteres y un color #RRGGBB.');
  }
  return marca;
}

export function validarBrief(brief) {
  validarEsquema(brief, esquemaBrief, 'brief');
  marcaPorId(brief.marca_id);
  const destino = urlPublica(brief.destino);
  if (!brief.es_demo && /(^|\.)(example\.(com|org|net)|localhost)$/.test(destino.hostname)) {
    throw new Error('Sustituye el destino de ejemplo antes de usar es_demo=false.');
  }
  for (const fuente of brief.fuentes) {
    urlPublica(fuente.url);
    const fecha = new Date(`${fuente.verificado_el}T00:00:00Z`);
    if (!Number.isFinite(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== fuente.verificado_el) {
      throw new Error(`Fecha de fuente inválida: ${fuente.verificado_el}`);
    }
    if (fuente.verificado_el > new Date().toISOString().slice(0, 10)) throw new Error('Una fuente no puede estar verificada en el futuro.');
  }
  return brief;
}

export function validarContenido(contenido, brief) {
  validarEsquema(contenido, esquemaContenido, 'contenido');
  const duracion = contenido.escenas.reduce((s, e) => s + e.segundos, 0);
  if (duracion !== brief.duracion_segundos) {
    throw new Error(`Las escenas suman ${duracion}s y el brief pide ${brief.duracion_segundos}s.`);
  }
  return contenido;
}

export function validarVideo(props) {
  validarEsquema(props, esquemaVideo, 'video');
  urlPublica(props.destino);
  const duracion = props.escenas.reduce((s, e) => s + e.segundos, 0);
  if (duracion < 20 || duracion > 60) throw new Error('El video debe durar entre 20 y 60 segundos.');
  if (props.audio && (props.audio.includes('..') || !/^[\w /.-]+\.(mp3|wav|m4a)$/i.test(props.audio) || props.audio.startsWith('/'))) {
    throw new Error('audio debe ser una ruta relativa dentro de public/, sin .., o una cadena vacía.');
  }
  return props;
}
