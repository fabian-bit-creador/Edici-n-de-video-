# Herramientas y conexiones

Referencias consultadas el **9 de noviembre de 2026**. La selección favorece el
flujo que ya existe y herramientas comprobables; no pretende establecer un
ranking universal.

## Núcleo de producción

| Herramienta | Trabajo concreto | Estado en este repositorio |
|---|---|---|
| GPT en ChatGPT/Codex | Investigar las fuentes pertinentes, proponer guiones y adaptar textos | Habilidad propia, prompt y contrato JSON. Flujo manual con validación local |
| Remotion | Montar gráficos y texto con código y reutilizar plantillas | Motor existente y tres composiciones generales nuevas; dependencias fijadas |
| Auto-Editor | Detectar silencios y preparar cortes de grabaciones | Integración de CLI para preview, MP4 y exportación de proyectos |
| FFmpeg/ffprobe | Conversión y comprobación de archivos | Utilizado por el proyecto original y en las verificaciones de video |

Remotion mantiene [habilidades para agentes](https://www.remotion.dev/docs/ai/skills)
y [herramientas de subtítulos](https://www.remotion.dev/docs/captions/). La nueva
plantilla reutiliza su motor; las voces y subtítulos del video original siguen
en su proyecto. Se puede incorporar más automatización de subtítulos después de
definir el tipo de grabaciones que se producirán.

[Auto-Editor](https://auto-editor.com/docs/cookbook) es el complemento propuesto
para ahorrar el primer corte mecánico. No selecciona por sí solo las mejores
ideas de una explicación. Su documentación actual recomienda el binario oficial;
**la CLI ya no se publica mediante pip**. La versión verificada para esta
integración es **31.8.0**.

### Instalar Auto-Editor

1. Descargar el archivo correspondiente al sistema y arquitectura desde sus
   [releases oficiales](https://github.com/WyattBlue/auto-editor/releases/tag/31.8.0).
2. Renombrarlo `auto-editor` (`auto-editor.exe` en Windows). En macOS/Linux,
   darle permiso de ejecución. Revisar los avisos de seguridad del sistema y
   verificar el origen de la descarga.
3. Colocarlo en PATH o definir `AUTO_EDITOR_BIN` con la ruta completa. No se
   instala globalmente desde este repositorio.

Ejemplo de variable para una sesión de terminal:

```bash
# macOS / Linux
export AUTO_EDITOR_BIN=/ruta/auto-editor
```

```powershell
# PowerShell
$env:AUTO_EDITOR_BIN = "C:\ruta\auto-editor.exe"
```

`--umbral 0.04` es el punto de partida; `--margen 0.2` conserva 0,2 segundos
alrededor de la voz. Probar el preview y escuchar el corte: un umbral inadecuado
puede eliminar voz suave. El original debe conservarse.

```bash
npm run estudio -- cortes --input grabaciones/tutorial.mp4 --modo preview --umbral 0.04 --margen 0.2 --ejecutar
npm run estudio -- cortes --input grabaciones/tutorial.mp4 --modo resolve --out trabajo/tutorial.fcpxml --ejecutar
npm run estudio -- cortes --input grabaciones/tutorial.mp4 --modo premiere --out trabajo/tutorial.xml --ejecutar
```

Las exportaciones de editor referencian los medios originales; conservarlos al
mover el proyecto. No publicar el XML si revela rutas privadas.

## Aprovechar las conexiones

| Conexión | Uso recomendado | Alcance confirmado en la revisión |
|---|---|---|
| GitHub | Código, briefs versionados, revisión y mejora continua | Repositorios identificados y lectura del proyecto de video y contexto de las páginas |
| Canva | Marca, portadas y carruseles derivados del mismo guion | Acceso y presencia de un kit de marca confirmados; no se generaron diseños |
| Higgsfield | Recursos generativos y animaciones puntuales cuando aporten a la idea | Espacio y proyecto de medios consultados; no se consumieron generaciones |
| Drive personal | Archivo privado de maestros, materiales y entregables | Consulta disponible; no se identificó una carpeta específica de producción de video |
| Metricool | Programación y lectura de métricas por marca | Descubierto como opción; requiere instalar/conectar y verificar las cuentas |

Las conexiones de ChatGPT no se transfieren al programa local. El generador
funciona con archivos y no contiene credenciales de esas apps. Cada integración
automática futura debe usar autenticación propia y un contrato de datos.

El [plugin de Metricool](https://chatgpt.com/plugins) puede cubrir la siguiente
etapa de distribución y analítica. Mientras tanto, el CSV sirve como plan de
trabajo para publicar y registrar resultados manualmente. No se configuraron
cuentas sociales ni publicaciones.

## Qué conviene posponer

- **API de GPT en lote:** definir volumen y presupuesto primero. El contrato
  JSON de este repositorio es la base para una integración posterior con
  [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
  El flujo actual usa ChatGPT/Codex y no hace llamadas automáticas a esa API.
- **Automatización general con n8n u otro orquestador:** diseñarla después de
  repetir manualmente el proceso y confirmar permisos de cada servicio.
- **CRM, pagos y base de datos:** añadirlos cuando haya un negocio y una oferta
  definidos. Para las piezas informativas, las visitas y consultas pueden ser
  suficientes al comienzo.
- **Render como servicio:** solo si el volumen justifica mantener servidores,
  almacenamiento, colas y control de costos.

Revisar la [licencia de Remotion](https://www.remotion.dev/docs/license/pricing)
al pasar de uso individual o equipo pequeño a una empresa o servicio de
automatización. Los términos del software y los derechos de voz, música y
materiales son independientes.

## Entorno local

`.env.example` documenta variables opcionales. El programa lee las variables
del entorno; no carga `.env` automáticamente. Se puede usar
`node --env-file=.env scripts/estudio.mjs ...` si se prefiere un archivo privado.

`REMOTION_BROWSER_EXECUTABLE` permite reutilizar Chromium instalado. La
concurrencia se ajusta a los núcleos disponibles, con un máximo de cuatro. La
verificación de esta entrega se hizo en Linux; comprobar instalación de
binarios y rutas al usar Windows o macOS.
