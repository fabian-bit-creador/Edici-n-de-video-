import type { Manifiesto } from "./config-voz.ts";
import { claveAudio } from "./config-voz.ts";
import { escenasDe, type Escena, type Version } from "./guion.ts";
import { palabrasNormalizadas } from "./normalizar.ts";

/** Segundos de la escena antes de que empiece la voz (entrada de los elementos). */
const ENTRADA = 0.35;
/** Ritmo de la voz cuando todavía no hay audio (vista previa sin locución). */
const PALABRAS_POR_SEGUNDO = 3.1;

export interface SubtituloPlan { desde: number; hasta: number; texto: string }

export interface EscenaPlan {
  escena: Escena;
  /** Frame de inicio dentro del video. */
  desde: number;
  duracion: number;
  /** Archivo de voz en public/audio (si ya se generó). */
  audio: string | null;
  /** Frame (relativo a la escena) en que empieza la voz. */
  inicioVoz: number;
  subtitulos: SubtituloPlan[];
  /** Momento de cada marca «{nombre}» del guion, en frames relativos a la escena. */
  marcas: Record<string, number>;
}

export function planificar(version: Version, manifiesto: Manifiesto, fps: number) {
  let cursor = 0;
  const escenas: EscenaPlan[] = escenasDe(version).map((escena) => {
    const clip = escena.locucion ? manifiesto[claveAudio(escena.locucion)] : undefined;
    const palabrasPorSub = escena.subtitulos.map((s) => palabrasNormalizadas(s.voz).length);
    const totalPalabras = palabrasPorSub.reduce((a, b) => a + b, 0);
    const voz = clip ? clip.duracion : escena.locucion ? totalPalabras / PALABRAS_POR_SEGUNDO + 0.3 : 0;
    const inicioVoz = escena.locucion ? Math.round(ENTRADA * fps) : 0;

    /* Inicio de cada subtítulo: la primera palabra de ese tramo. */
    let acumuladas = 0;
    const inicios = palabrasPorSub.map((n) => {
      const t = clip?.inicios[acumuladas] ?? (acumuladas / Math.max(totalPalabras, 1)) * voz;
      acumuladas += n;
      return t;
    });
    const subtitulos = escena.subtitulos.map((s, k) => ({
      desde: inicioVoz + Math.round(inicios[k] * fps),
      hasta: inicioVoz + Math.round((k + 1 < inicios.length ? inicios[k + 1] : voz + 0.25) * fps),
      texto: s.texto,
    }));
    const marcas: Record<string, number> = {};
    escena.subtitulos.forEach((s, k) => s.marcas.forEach((m) => (marcas[m] = subtitulos[k].desde)));

    const duracion = Math.round((escena.locucion ? ENTRADA + voz : 0) * fps + escena.cola * fps);
    const plan: EscenaPlan = { escena, desde: cursor, duracion, audio: clip?.archivo ?? null, inicioVoz, subtitulos, marcas };
    cursor += duracion;
    return plan;
  });
  return { escenas, total: cursor };
}
