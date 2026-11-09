/**
 * Renderiza fotogramas sueltos para revisar el diseño sin hacer el video:
 *   node scripts/fotogramas.ts GastoLaPintana 120 600 900
 * Deja los PNG en out/fotogramas/.
 */
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const RAIZ = path.resolve(import.meta.dirname, "..");
const [id = "GastoLaPintana", ...frames] = process.argv.slice(2);
const LOCAL = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable = fs.existsSync(LOCAL) ? LOCAL : null;

const serveUrl = await bundle({ entryPoint: path.join(RAIZ, "src", "index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
fs.mkdirSync(path.join(RAIZ, "out", "fotogramas"), { recursive: true });
for (const f of frames.map(Number)) {
  const output = path.join(RAIZ, "out", "fotogramas", `${id}-${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale: 0.5, browserExecutable });
  console.log(output);
}
