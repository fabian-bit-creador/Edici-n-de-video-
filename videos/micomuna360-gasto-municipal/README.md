# Video «Top 5: ¿en qué se gasta la plata de La Pintana?»

Video vertical (1080 × 1920) para Reels, TikTok y Shorts, hecho solo con
código ([Remotion](https://www.remotion.dev/)) a partir de los datos
oficiales que usa [MiComuna360](https://micomuna360.vercel.app/la-pintana).
Usa la misma paleta, tipografías, logo y gráficos del sitio.

Dos versiones:

| Archivo | Duración | Escenas |
|---|---|---|
| `salida/gasto-la-pintana-vertical-completo.mp4` | ≈ 2 min | Gancho, ejemplo, Top 5, «pagado vs comprometido», origen de la plata, pregunta y fuentes |
| `salida/gasto-la-pintana-vertical-60s.mp4` | < 60 s | Gancho, ejemplo, Top 5, pregunta y fuentes |

Documentos de trabajo: `01-analisis.md` (paso 1) y `02-guion.md` (guion
aprobado).

## Cómo regenerar el video si cambian los datos

1. Edita **`src/datos.ts`**: es el único archivo con cifras. El ranking, la
   locución, los subtítulos y los gráficos se recalculan desde ahí.
2. Revisa cómo queda el guion: `npm run guion`.
3. Genera todo:

   ```bash
   npm run video
   ```

   Solo se vuelven a grabar las escenas cuyo texto cambió; después se
   renderizan las dos versiones en `salida/`.

### La primera vez en un computador nuevo

Requisitos: Node 22.18 o superior, Python 3.10 o superior, ffmpeg y una
clave gratuita de [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm install
npm run preparar                  # instala Whisper (una sola vez)
export GEMINI_API_KEY=tu-clave    # en Windows: set GEMINI_API_KEY=tu-clave
npm run video
```

Para ver y ajustar el video en el navegador: `npm run studio`.

## Cómo funciona

| Pieza | Archivo | Qué hace |
|---|---|---|
| Datos | `src/datos.ts` | Cifras oficiales en miles de pesos, con su fuente y fecha |
| Cálculos | `src/calculos.ts` | Top 5 por persona, comprometido sin pagar, porcentajes |
| Guion | `src/guion.ts` | Locución (números en palabras) y subtítulos (números en cifras), con marcas de animación |
| Voz | `scripts/voz.ts` | Gemini TTS, voz «Achird». Pide varias escenas por solicitud y las corta con Whisper |
| Verificación | `scripts/alinear.py` | Whisper transcribe palabra por palabra: comprueba que la voz dijo el guion y sincroniza subtítulos |
| Música | `scripts/musica.ts` | Base instrumental compuesta con código (Fa mayor, 100 BPM), sin licencias de terceros |
| Escenas | `src/escenas/` | Gancho, ejemplo, puestos del ranking, «ojo», origen, pregunta y cierre |
| Estilo | `src/tema.ts`, `src/componentes/` | Tokens y componentes del sitio: tarjetas, barras, medidor, anillo 360°, isotipo |

Notas:

- **Cuota gratuita de Gemini:** la voz permite pocas solicitudes al día.
  Si se agota, `npm run voz` guarda lo avanzado y basta volver a correrlo
  más tarde.
- **Otra música:** reemplaza `public/musica.mp3` por una canción con
  licencia libre (o agrega la música dentro de la app al publicar) y vuelve
  a renderizar. Para un video sin música, renderiza con
  `--props='{"musica":false}'`.
- **Ver fotogramas sueltos** sin renderizar todo:
  `node scripts/fotogramas.ts GastoLaPintana 120 600 900` (quedan en
  `out/fotogramas/`).
- **Licencia de Remotion:** gratis para uso individual y equipos de hasta
  3 personas.

## Fuentes

- Municipalidad de La Pintana, Transparencia Activa (MU124): balances de
  ejecución presupuestaria al 30-06-2026 (publicados el 07-07-2026,
  verificados por MiComuna360 el 27-09-2026).
- Municipalidad de La Pintana: Estado de Situación Presupuestaria 2025 y
  notas explicativas (16-03-2026). Copia y huella SHA-256 en `fuentes/`.
- SUBDERE–SINIM: ingresos propios por habitante 2025 y población INE 2025.
