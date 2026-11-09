# Verificación de la entrega

Verificación local del **9 de noviembre de 2026**, en Linux con Node 24.22.1 y
Chromium. Las comprobaciones de CI se ejecutan por separado en GitHub.

| Comprobación | Resultado |
|---|---|
| `npm run check` | 13 pruebas del flujo y TypeScript correctos |
| Paquetes de las cuatro marcas | Contratos válidos, publicaciones separadas y variantes A/B |
| Protección de archivos | Rechazo de salidas existentes y rutas de audio fuera del contrato |
| CSV y seguimiento | Comillas y saltos de línea; rechazo de duplicados y monedas mezcladas; denominadores cero explícitos |
| Revisión de la plantilla | Cuatro escenas en cada uno de los tres formatos, 12 fotogramas |
| Textos de longitud máxima | Otros 12 fotogramas; inspección de título de 85 y detalle de 160 caracteres en los tres formatos |
| Video original de MiComuna360 | Fotograma de `GastoLaPintana60` renderizado correctamente |
| Demostración general | MP4 H.264, 1080 × 1920, 30 fps, 24 segundos, sin audio |
| Auto-Editor 31.8.0 | Binario oficial con SHA-256 verificado; preview y corte real |
| Prueba de silencios | Clip sintético de 8 segundos → salida de 4,8 segundos, conservando márgenes |
| Exportación de proyectos | Archivos FCPXML para Resolve y XML para Premiere generados y parseados |
| Conservación del original | SHA-256 idéntico antes y después de una exportación |

La [vista previa](vista-previa.webp) muestra las cuatro escenas de la
demostración en sus tres formatos. Los materiales de prueba y los MP4 nuevos
quedan en `trabajo/`, excluido de Git; se regeneran con los comandos del README.

No se comprobó la importación en las aplicaciones de escritorio Resolve y
Premiere ni la instalación en Windows o macOS. La publicación y el acceso a
métricas de cuentas sociales requieren configurar sus conexiones. Los ejemplos
de métricas son ficticios; estos ensayos no miden el rendimiento real de las
cuentas ni validan automáticamente sus fuentes editoriales.
