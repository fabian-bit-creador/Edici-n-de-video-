import brief from '../../../../ejemplos/brief-micomuna360.json';
import contenido from '../../../../ejemplos/contenido-micomuna360.json';
import marcas from '../../../../config/marcas.json';

export type EscenaSocial = {
  etiqueta: string;
  titulo: string;
  detalle: string;
  locucion: string;
  segundos: number;
};

export type PropsContenido = {
  marca: string;
  color: string;
  es_demo: boolean;
  destino: string;
  cta: string;
  fuente: string;
  audio: string;
  escenas: EscenaSocial[];
};

const marca = marcas.find((m) => m.id === brief.marca_id)!;
export const ejemploContenido: PropsContenido = {
  marca: marca.nombre,
  color: marca.color,
  es_demo: true,
  destino: brief.destino,
  cta: brief.cta,
  fuente: 'Fuentes y vigencia en la descripción.',
  audio: '',
  escenas: contenido.escenas,
};

export function duracionContenido(escenas: EscenaSocial[], fps = 30): number {
  if (!Array.isArray(escenas) || escenas.length !== 4) throw new Error('Se necesitan cuatro escenas.');
  const segundos = escenas.reduce((s, e) => {
    if (!Number.isInteger(e.segundos) || e.segundos < 2 || e.segundos > 20) throw new Error('Duración de escena inválida.');
    return s + e.segundos;
  }, 0);
  if (segundos < 20 || segundos > 60) throw new Error('La pieza debe durar entre 20 y 60 segundos.');
  return segundos * fps;
}
