/**
 * Genera la locución de cada escena con la voz sintética de Gemini.
 *
 *   npm run voz
 *
 * Cómo funciona:
 * 1. Solo genera lo que falta: cada clip lleva una huella de su texto, así
 *    que si cambia un dato solo se regeneran las escenas que lo mencionan.
 * 2. Pide varias escenas en una sola solicitud (el plan gratuito de Gemini
 *    permite pocas al día) y después las corta.
 * 3. Whisper (local, scripts/alinear.py) transcribe el audio palabra por
 *    palabra: con eso se comprueba que la voz dijo exactamente el guion, se
 *    corta cada escena en su pausa y se sincronizan los subtítulos.
 *
 * Requisitos: `npm run preparar` (instala Whisper) y, fuera de la nube de
 * Claude, la variable GEMINI_API_KEY.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { claveAudio, VOZ, type Manifiesto } from "../src/config-voz.ts";
import { escenasDe, type Escena } from "../src/guion.ts";
import { palabrasNormalizadas } from "../src/normalizar.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const AUDIO = path.join(RAIZ, "public", "audio");
const CACHE = path.join(RAIZ, ".cache", "voz");
const MANIFIESTO = path.join(AUDIO, "manifiesto.json");
const API = "https://generativelanguage.googleapis.com/v1beta/models";
const CLAVE = process.env.GEMINI_API_KEY ?? "proxy";
/** Plan gratuito: pocas solicitudes por minuto. */
const INTERVALO_TTS_MS = 21_000;
const PALABRAS_POR_LOTE = 110;
const SIMILITUD_MINIMA = 0.86;
const PYTHON = [
  path.join(RAIZ, ".cache", "venv", "bin", "python"),
  path.join(RAIZ, ".cache", "venv", "Scripts", "python.exe"),
].find((p) => fs.existsSync(p));

fs.mkdirSync(AUDIO, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

const manifiesto: Manifiesto = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, "utf8")) : {};
const guardar = () => fs.writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + "\n");
const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
const r3 = (n: number) => Math.round(n * 1000) / 1000;

class CuotaAgotada extends Error {}

/* ── Gemini TTS ──────────────────────────────────────────────────────── */

let ultimoTts = 0;
async function sintetizar(texto: string): Promise<Buffer> {
  for (let intento = 1; intento <= 5; intento++) {
    const falta = ultimoTts + INTERVALO_TTS_MS - Date.now();
    if (falta > 0) await esperar(falta);
    ultimoTts = Date.now();
    const res = await fetch(`${API}/${VOZ.modelo}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": CLAVE },
      body: JSON.stringify({
        contents: [{ parts: [{ text: texto }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOZ.voz } } },
        },
      }),
    });
    const cuerpo = await res.text();
    if (res.ok) {
      const parte = JSON.parse(cuerpo).candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (!parte) throw new Error("La voz no devolvió audio.");
      const datos = Buffer.from(parte.inlineData.data, "base64");
      return datos.subarray(0, 4).toString() === "RIFF" ? datos : wav(datos, 24_000);
    }
    if (res.status === 400 && cuerpo.includes("API_KEY_INVALID")) {
      throw new Error("Gemini rechazó la clave. Define GEMINI_API_KEY con una clave de Google AI Studio.");
    }
    if (res.status === 429 || res.status >= 500) {
      const pausa = Number(cuerpo.match(/"retryDelay":\s*"(\d+)s"/)?.[1] ?? 0);
      if (res.status === 429 && pausa > 120) {
        throw new CuotaAgotada(`La cuota diaria de ${VOZ.modelo} se agotó; se libera en ${Math.ceil(pausa / 60)} min.`);
      }
      const ms = Math.max(pausa * 1000, 10_000 * intento);
      console.log(`   voz: ${res.status}, reintento en ${Math.round(ms / 1000)} s`);
      await esperar(ms);
      continue;
    }
    throw new Error(`${VOZ.modelo}: ${res.status} ${cuerpo.slice(0, 300)}`);
  }
  throw new Error("La voz no respondió después de 5 intentos.");
}

function wav(pcm: Buffer, hz: number): Buffer {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(hz, 24); h.writeUInt32LE(hz * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

/* ── Audio ───────────────────────────────────────────────────────────── */

function ffmpeg(args: string[]): string {
  const r = spawnSync("ffmpeg", ["-hide_banner", ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr.slice(-800));
  return r.stderr;
}

function duracion(archivo: string): number {
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo], { encoding: "utf8" }).trim());
}

function pausas(archivo: string): [number, number][] {
  const log = ffmpeg(["-i", archivo, "-af", "silencedetect=noise=-38dB:d=0.08", "-f", "null", "-"]);
  const inicios = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const fines = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  return inicios.map((s, i) => [s, fines[i] ?? s] as [number, number]);
}

/* ── Whisper y alineación ───────────────────────────────────────────── */

interface Reconocida { w: string; i: number; f: number; original: string }

function whisper(audio: string): Reconocida[] {
  if (!PYTHON) throw new Error("Falta Whisper: corre «npm run preparar» una vez.");
  const r = spawnSync(PYTHON, [path.join(RAIZ, "scripts", "alinear.py"), audio], {
    encoding: "utf8",
    env: { ...process.env, HF_HOME: path.join(RAIZ, ".cache", "hf") },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(`Whisper falló: ${r.stderr.slice(-500)}`);
  const crudas: { p: string; i: number; f: number }[] = JSON.parse(r.stdout);
  /* «136» se vuelve «ciento treinta y seis»: el tiempo se reparte entre esas palabras. */
  return crudas.flatMap((x) => {
    const ws = palabrasNormalizadas(x.p);
    const paso = (x.f - x.i) / Math.max(ws.length, 1);
    return ws.map((w, k) => ({ w, i: x.i + k * paso, f: x.i + (k + 1) * paso, original: k === 0 ? x.p : "" }));
  });
}

/** Alinea las palabras esperadas con las reconocidas (Levenshtein con rastreo). */
function alinear(esperadas: string[], reconocidas: string[]): (number | null)[] {
  const n = esperadas.length;
  const m = reconocidas.length;
  const d = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (esperadas[i - 1] === reconocidas[j - 1] ? 0 : 1));
  const pareja: (number | null)[] = Array(n).fill(null);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const costo = esperadas[i - 1] === reconocidas[j - 1] ? 0 : 1;
    if (d[i][j] === d[i - 1][j - 1] + costo) { pareja[i - 1] = j - 1; i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) i--;
    else j--;
  }
  return pareja;
}

function levenshtein(a: string[], b: string[]): number {
  const fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = fila[j];
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return fila[b.length];
}

/* ── Lotes ───────────────────────────────────────────────────────────── */

function agrupar(escenas: Escena[]): Escena[][] {
  const lotes: Escena[][] = [];
  let actual: Escena[] = [];
  let cuenta = 0;
  for (const e of escenas) {
    const n = palabrasNormalizadas(e.locucion).length;
    if (actual.length && cuenta + n > PALABRAS_POR_LOTE) {
      lotes.push(actual);
      actual = [];
      cuenta = 0;
    }
    actual.push(e);
    cuenta += n;
  }
  if (actual.length) lotes.push(actual);
  return lotes;
}

/** Genera un lote y guarda cada escena que pase la verificación. Devuelve las que fallaron. */
export async function procesarLote(lote: Escena[], numero: string): Promise<Escena[]> {
  console.log(`\n▶ Lote ${numero}: ${lote.map((e) => e.id).join(", ")}`);
  const base = path.join(CACHE, `lote-${claveAudio(lote.map((e) => e.locucion).join("\n\n"))}`);
  if (!fs.existsSync(`${base}.wav`)) {
    fs.writeFileSync(`${base}.raw.wav`, await sintetizar(lote.map((e) => e.locucion).join("\n\n")));
    const recorte = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03";
    ffmpeg(["-y", "-i", `${base}.raw.wav`, "-af",
      `${recorte},areverse,${recorte},areverse,loudnorm=I=-16:TP=-1.5:LRA=11`,
      "-ar", "48000", "-ac", "1", `${base}.wav`]);
  }
  const total = duracion(`${base}.wav`);
  const reconocidas = whisper(`${base}.wav`);
  const silencios = pausas(`${base}.wav`);

  const esperadas = lote.flatMap((e, k) => palabrasNormalizadas(e.locucion).map((w) => ({ w, k })));
  const pareja = alinear(esperadas.map((x) => x.w), reconocidas.map((x) => x.w));

  /* Tiempo de inicio y fin de cada palabra esperada (interpolando las que Whisper no oyó). */
  const ini: (number | null)[] = pareja.map((j) => (j === null ? null : reconocidas[j].i));
  const fin: (number | null)[] = pareja.map((j) => (j === null ? null : reconocidas[j].f));
  const rellenar = (arr: (number | null)[]) =>
    arr.map((v, i) => {
      if (v !== null) return v;
      let a = i - 1; while (a >= 0 && arr[a] === null) a--;
      let b = i + 1; while (b < arr.length && arr[b] === null) b++;
      const ta = a >= 0 ? (arr[a] as number) : 0;
      const tb = b < arr.length ? (arr[b] as number) : total;
      return ta + ((tb - ta) * (i - a)) / (b - a);
    });
  const tIni = rellenar(ini);
  const tFin = rellenar(fin);

  /* Cortes: en la pausa que separa cada escena de la siguiente. */
  const rangos = lote.map((_, k) => {
    const idx = esperadas.flatMap((x, i) => (x.k === k ? [i] : []));
    return { a: tIni[idx[0]], b: tFin[idx[idx.length - 1]], idx };
  });
  const cortes = [0];
  for (let k = 0; k < lote.length - 1; k++) {
    const finK = rangos[k].b;
    const iniSig = rangos[k + 1].a;
    const pausa = silencios.find(([s, e]) => s <= iniSig + 0.15 && e >= finK - 0.15);
    cortes.push(pausa ? (pausa[0] + pausa[1]) / 2 : (finK + iniSig) / 2);
  }
  cortes.push(total);

  const fallidas: Escena[] = [];
  lote.forEach((escena, k) => {
    const { idx } = rangos[k];
    const js = idx.map((i) => pareja[i]).filter((j): j is number => j !== null);
    const oidas = js.length ? reconocidas.slice(Math.min(...js), Math.max(...js) + 1) : [];
    const sim = 1 - levenshtein(idx.map((i) => esperadas[i].w), oidas.map((x) => x.w)) / Math.max(idx.length, oidas.length, 1);
    const transcripcion = oidas.map((x) => x.original).filter(Boolean).join(" ");
    console.log(`   ${escena.id}: similitud ${sim.toFixed(3)} · «${transcripcion.slice(0, 80)}»`);
    if (sim < SIMILITUD_MINIMA) {
      fallidas.push(escena);
      return;
    }
    const desde = Math.max(cortes[k], rangos[k].a - 0.06);
    const hasta = Math.min(cortes[k + 1], rangos[k].b + 0.3);
    const clave = claveAudio(escena.locucion);
    const archivo = `${clave}.wav`;
    ffmpeg(["-y", "-i", `${base}.wav`, "-af",
      `atrim=start=${desde.toFixed(3)}:end=${hasta.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st=${Math.max(hasta - desde - 0.06, 0).toFixed(3)}:d=0.06`,
      "-ar", "48000", "-ac", "1", path.join(AUDIO, archivo)]);
    manifiesto[clave] = {
      archivo,
      duracion: r3(duracion(path.join(AUDIO, archivo))),
      inicios: idx.map((i) => r3(Math.max(tIni[i] - desde, 0))),
      locucion: escena.locucion,
      similitud: r3(sim),
      transcripcion,
    };
    guardar();
  });
  return fallidas;
}

async function main() {
  const escenas = [...escenasDe("completo"), ...escenasDe("corto")].filter((e) => e.locucion);
  const unicas = new Map(escenas.map((e) => [claveAudio(e.locucion), e]));
  const pendientes = [...unicas]
    .filter(([clave]) => !manifiesto[clave] || !fs.existsSync(path.join(AUDIO, manifiesto[clave].archivo)))
    .map(([, e]) => e);
  console.log(`Locuciones: ${unicas.size} distintas, ${pendientes.length} por generar (voz ${VOZ.voz}, ${VOZ.modelo}).`);

  const lotes = agrupar(pendientes);
  let fallidas: Escena[] = [];
  for (const [n, lote] of lotes.entries()) fallidas.push(...(await procesarLote(lote, `${n + 1}/${lotes.length}`)));
  /* Las que no calzaron se piden de nuevo, una por una (hasta dos veces). */
  for (let ronda = 1; ronda <= 2 && fallidas.length; ronda++) {
    const siguientes: Escena[] = [];
    for (const e of fallidas) {
      fs.rmSync(path.join(CACHE, `lote-${claveAudio(e.locucion)}.wav`), { force: true });
      siguientes.push(...(await procesarLote([e], `reintento ${ronda}`)));
    }
    fallidas = siguientes;
  }

  /* Limpieza: audios que ya no usa ninguna escena. */
  for (const clave of Object.keys(manifiesto)) {
    if (unicas.has(clave)) continue;
    fs.rmSync(path.join(AUDIO, manifiesto[clave].archivo), { force: true });
    delete manifiesto[clave];
  }
  guardar();
  const total = [...unicas.keys()].reduce((s, c) => s + (manifiesto[c]?.duracion ?? 0), 0);
  console.log(`\nListo: ${Object.keys(manifiesto).length}/${unicas.size} clips, ${total.toFixed(1)} s de voz.`);
  if (fallidas.length) {
    console.error(`⚠ No calzaron: ${fallidas.map((e) => e.id).join(", ")}. Vuelve a correr «npm run voz».`);
    process.exit(2);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => {
  guardar();
  console.error(`\n✗ ${e instanceof Error ? e.message : e}`);
  if (e instanceof CuotaAgotada) console.error("Lo ya generado quedó guardado: vuelve a correr «npm run voz» más tarde.");
  process.exit(1);
});
