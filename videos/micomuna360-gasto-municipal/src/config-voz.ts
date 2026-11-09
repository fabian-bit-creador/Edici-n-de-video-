import { huella } from "./hash.ts";

/** Voz elegida: Gemini TTS, voz «Achird» (masculina, cercana), español neutro. */
export const VOZ = {
  modelo: "gemini-3.8-flash-tts",
  voz: "Achird",
};

/** Nombre del archivo de audio de una locución: cambia si cambia el texto o la voz. */
export function claveAudio(locucion: string): string {
  return huella(`${VOZ.modelo}|${VOZ.voz}|${locucion}`);
}

export interface Clip {
  archivo: string;
  /** Segundos del clip (voz con un margen mínimo al inicio y al final). */
  duracion: number;
  /**
   * Segundo en que empieza cada palabra de la locución, en el orden de
   * `palabrasNormalizadas(locucion)`. Sincroniza subtítulos y animaciones.
   */
  inicios: number[];
  locucion: string;
  similitud: number;
  transcripcion: string;
}

export type Manifiesto = Record<string, Clip>;
