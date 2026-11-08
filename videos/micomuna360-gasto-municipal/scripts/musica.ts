/**
 * Música de fondo compuesta con código (sin muestras ni licencias de
 * terceros): Fa mayor, 100 BPM, progresión I–V–vi–IV con colchón suave,
 * arpegio pulsado, bajo y percusión liviana.
 *
 *   npm run musica            (no hace nada si ya existe public/musica.mp3)
 *   npm run musica -- --forzar
 *
 * Para usar otra canción, reemplaza public/musica.mp3 por un archivo con
 * licencia libre y vuelve a renderizar.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "public", "musica.mp3");
if (fs.existsSync(SALIDA) && !process.argv.includes("--forzar")) {
  console.log("public/musica.mp3 ya existe (usa --forzar para componerla de nuevo).");
  process.exit(0);
}

const SR = 44_100;
const BPM = 100;
const PULSO = 60 / BPM;
const COMPAS = PULSO * 4;
const DURACION = 150;
const N = Math.ceil(DURACION * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

/* Ruido reproducible: la música sale idéntica cada vez. */
let semilla = 360;
const azar = () => {
  semilla = (semilla + 0x6d2b79f5) | 0;
  let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/* Acordes (voces cercanas) y bajo: Fa – Do – Rem – Sib. */
const ACORDES = [
  { pad: [53, 57, 60], bajo: 41 },
  { pad: [52, 55, 60], bajo: 36 },
  { pad: [53, 57, 62], bajo: 38 },
  { pad: [53, 58, 62], bajo: 34 },
];
/* Arpegio por corcheas: índices sobre [fundamental, tercera, quinta, octava]. */
const ARPEGIO = [0, 1, 2, 3, 2, 1, 2, 1];
const COMPASES = Math.ceil(DURACION / COMPAS);

function sumar(t0: number, muestras: Float32Array, panL: number, panR: number) {
  const i0 = Math.floor(t0 * SR);
  for (let i = 0; i < muestras.length && i0 + i < N; i++) {
    L[i0 + i] += muestras[i] * panL;
    R[i0 + i] += muestras[i] * panR;
  }
}

/** Colchón: senos levemente desafinados con ataque y caída lentos. */
function pad(t0: number, dur: number, notas: number[], vol: number) {
  const n = Math.floor((dur + 0.8) * SR);
  for (const [k, nota] of notas.entries()) {
    for (const [d, lado] of [[-0.0018, 0], [0.0018, 1]] as const) {
      const f = hz(nota) * (1 + d);
      const s = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        const env = Math.min(t / 0.6, 1) * (t > dur ? Math.exp(-(t - dur) * 5) : 1);
        s[i] = env * vol * (Math.sin(2 * Math.PI * f * t + k) + 0.18 * Math.sin(4 * Math.PI * f * t));
      }
      sumar(t0, s, lado === 0 ? 0.8 : 0.35, lado === 0 ? 0.35 : 0.8);
    }
  }
}

/** Cuerda pulsada (Karplus–Strong), suave. */
function pulso(t0: number, nota: number, vol: number, pan: number) {
  const f = hz(nota);
  const periodo = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(periodo).map(() => azar() * 2 - 1);
  const n = Math.floor(1.1 * SR);
  const s = new Float32Array(n);
  let previo = 0;
  for (let i = 0; i < n; i++) {
    const j = i % periodo;
    const x = buf[j];
    const nuevo = 0.996 * 0.5 * (x + buf[(j + 1) % periodo]);
    buf[j] = nuevo;
    previo = 0.7 * previo + 0.3 * x; // paso bajo: le quita brillo metálico
    s[i] = previo * vol * Math.min(i / 60, 1);
  }
  sumar(t0, s, 1 - pan * 0.5, 0.5 + pan * 0.5);
}

function bajo(t0: number, dur: number, nota: number, vol: number) {
  const f = hz(nota);
  const n = Math.floor((dur + 0.2) * SR);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(t / 0.02, 1) * Math.exp(-t * 1.6) * (t > dur ? Math.exp(-(t - dur) * 20) : 1);
    s[i] = env * vol * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t));
  }
  sumar(t0, s, 0.7, 0.7);
}

function bombo(t0: number, vol: number) {
  const n = Math.floor(0.4 * SR);
  const s = new Float32Array(n);
  let fase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    fase += (2 * Math.PI * (48 + 75 * Math.exp(-t * 32))) / SR;
    s[i] = Math.sin(fase) * Math.exp(-t * 9) * vol;
  }
  sumar(t0, s, 0.7, 0.7);
}

function ruido(t0: number, caida: number, vol: number, brillo: number, pan: number) {
  const n = Math.floor((5 / caida) * SR);
  const s = new Float32Array(n);
  let prev = 0;
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const x = azar() * 2 - 1;
    const hp = x - prev; // paso alto simple
    prev = x;
    lp = lp + brillo * (hp - lp);
    s[i] = lp * Math.exp((-i / SR) * caida) * vol;
  }
  sumar(t0, s, 1 - pan * 0.4, 0.6 + pan * 0.4);
}

for (let c = 0; c < COMPASES; c++) {
  const t = c * COMPAS;
  const acorde = ACORDES[c % 4];
  const seccion = c < 4 ? "intro" : c >= 28 && c < 32 ? "pausa" : "plena";
  pad(t, COMPAS, acorde.pad, 0.035);
  const tonos = [acorde.pad[0], acorde.pad[1], acorde.pad[2], acorde.pad[0] + 12];
  ARPEGIO.forEach((idx, k) => {
    pulso(t + k * (PULSO / 2), tonos[idx] + 12, k % 2 === 0 ? 0.16 : 0.11, k % 2 === 0 ? 0.35 : 0.65);
  });
  if (seccion === "intro") continue;
  bajo(t, PULSO * 1.8, acorde.bajo, 0.2);
  bajo(t + PULSO * 2, PULSO * 1.8, acorde.bajo, 0.17);
  if (seccion === "pausa") continue;
  bombo(t, 0.42);
  bombo(t + PULSO * 2, 0.36);
  for (let k = 0; k < 4; k++) ruido(t + k * PULSO + PULSO / 2, 70, 0.05, 0.9, 0.7);
  if (c >= 8) {
    ruido(t + PULSO, 20, 0.07, 0.35, 0.4);
    ruido(t + PULSO * 3, 20, 0.07, 0.35, 0.4);
  }
}

/* Eco estéreo (3/4 de pulso) para dar aire, y mezcla final. */
const eco = Math.floor(PULSO * 0.75 * SR);
for (let i = eco; i < N; i++) {
  L[i] += 0.22 * R[i - eco];
  R[i] += 0.22 * L[i - eco];
}
let pico = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(L[i] * 1.1);
  R[i] = Math.tanh(R[i] * 1.1);
  pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
}
const ganancia = 0.89 / pico;
const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(t / 1.5, 1, (DURACION - t) / 3);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * ganancia * fade)) * 32767), i * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * ganancia * fade)) * 32767), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
h.write("data", 36); h.writeUInt32LE(pcm.length, 40);

const tmp = path.join(RAIZ, ".cache", "musica.wav");
fs.mkdirSync(path.dirname(tmp), { recursive: true });
fs.writeFileSync(tmp, Buffer.concat([h, pcm]));
const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", tmp, "-b:a", "192k", SALIDA]);
if (r.status !== 0) throw new Error(String(r.stderr));
console.log(`Música lista: public/musica.mp3 (${DURACION} s).`);
