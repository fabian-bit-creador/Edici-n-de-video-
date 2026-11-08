/**
 * Preparación única: instala Whisper (faster-whisper) en .cache/venv.
 *   npm run preparar
 * Lo usa scripts/voz.ts para comprobar la voz y sincronizar subtítulos.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const VENV = path.join(RAIZ, ".cache", "venv");
const windows = process.platform === "win32";
const python = windows ? "python" : "python3";
const pip = path.join(VENV, windows ? "Scripts" : "bin", windows ? "pip.exe" : "pip");

function correr(cmd: string, args: string[]) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!fs.existsSync(pip)) correr(python, ["-m", "venv", VENV]);
correr(pip, ["install", "--quiet", "faster-whisper==1.2.1", "numpy"]);
for (const herramienta of ["ffmpeg", "ffprobe"]) {
  if (spawnSync(herramienta, ["-version"]).status !== 0) {
    console.error(`Falta ${herramienta}: instálalo (https://ffmpeg.org/download.html) y vuelve a correr.`);
    process.exit(1);
  }
}
console.log("Listo. Whisper descargará su modelo (≈ 460 MB) la primera vez que corra «npm run voz».");
