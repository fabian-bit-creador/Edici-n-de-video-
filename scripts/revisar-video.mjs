#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';
import { leerJson, validarVideo } from '../lib/contratos.mjs';
import { formatos, proyectoVideo } from '../lib/media.mjs';

let navegador;
try {
  const { values } = parseArgs({ options: { props: { type: 'string' }, out: { type: 'string' } } });
  if (!values.props || !values.out) throw new Error('Usa --props RUTA --out CARPETA_NUEVA.');
  const props = validarVideo(leerJson(values.props));
  const destino = path.resolve(values.out);
  if (fs.existsSync(destino)) throw new Error('La carpeta de revisión ya existe. Elige otra.');
  const requireVideo = createRequire(path.join(proyectoVideo, 'package.json'));
  const { bundle } = requireVideo('@remotion/bundler');
  const { openBrowser, renderStill, selectComposition } = requireVideo('@remotion/renderer');
  fs.mkdirSync(destino, { recursive: true });
  console.log('Preparando las cuatro escenas en los tres formatos…');
  const serveUrl = await bundle({ entryPoint: path.join(proyectoVideo, 'src', 'index.ts') });
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
  navegador = await openBrowser('chrome', { browserExecutable, logLevel: 'error' });
  for (const [formato, id] of Object.entries(formatos)) {
    const composition = await selectComposition({ serveUrl, id, inputProps: props, puppeteerInstance: navegador, browserExecutable, logLevel: 'error' });
    let inicio = 0;
    for (const [indice, escena] of props.escenas.entries()) {
      const frame = Math.floor((inicio + escena.segundos / 2) * composition.fps);
      const output = path.join(destino, `${formato}-${indice + 1}.png`);
      await renderStill({ composition, serveUrl, inputProps: props, puppeteerInstance: navegador, browserExecutable, frame, output, logLevel: 'error' });
      inicio += escena.segundos;
      console.log(`${formato} · escena ${indice + 1}: ${output}`);
    }
  }
  console.log('12 fotogramas creados. Revisar legibilidad, zonas seguras y coherencia antes de publicar.');
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (navegador) await navegador.close({ silent: true });
}
