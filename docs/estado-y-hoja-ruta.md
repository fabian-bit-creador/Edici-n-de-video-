# Estado y hoja de ruta

## Base aprovechada

El repositorio tenía una descripción inicial en `main` y un proyecto de video
completo en una rama de trabajo. Ese proyecto ya incluía Remotion, voces con
Gemini, alineación local con Whisper, datos separados del diseño, fuentes,
música compuesta con código y versiones verticales corta y completa. Es la base
que este sistema reutiliza.

La revisión de contexto identificó MiComuna360 como portal de información
pública y Monitoreo Intensivo como herramienta docente. El proyecto del sindicato
se trató como contexto privado: no se copiaron sus documentos ni sus datos al
estudio público. Las otras páginas de GitHub quedan fuera de este cambio.

## Entregado en esta etapa

- Perfiles de las cuatro líneas de trabajo y briefs de ejemplo.
- Habilidad para GPT, prompt reproducible y contratos JSON.
- Generación local de paquetes con guion, fuentes, dos variantes, copys y UTM.
- Tres composiciones Remotion reutilizables: 9:16, 1:1 y 16:9, de 20 a 60 segundos.
- Integración de Auto-Editor para análisis, corte y exportación a editores.
- CSV para planificación, consultas y resultados; informe descriptivo local.
- Protección de salidas existentes, exclusión de archivos privados y pruebas de código en CI.
- Ajuste del render a los núcleos disponibles y selección configurable de Chromium.

El sistema no publica en redes, no incorpora cobros y no despliega cambios en
las páginas. Las piezas requieren la revisión habitual de sus responsables.

## Próximas etapas, en orden

1. **Piloto de contenido.** Elegir una marca, dos temas y un período de
   observación. Confirmar dominios, redes y responsables. Producir y revisar
   las piezas con este flujo. Entregable: campañas y resultados reales.
2. **Distribución medible.** Conectar Metricool si se desea centralizar redes;
   configurar enlaces y analítica del destino. Definir qué se contará como
   visita o consulta. Entregable: datos atribuibles por pieza, no solo vistas.
3. **Biblioteca creativa.** Añadir portadas de Canva, capturas de funciones,
   recursos propios y presets de montaje. Crear un registro de derechos y
   créditos. Incorporar voz y subtítulos a la plantilla general cuando el
   formato de producción esté decidido.
4. **Automatización.** Con un flujo ya usado, integrar API de generación,
   render en lote y distribución con manejo de errores e idempotencia.
   Definir costos máximos y mantener revisión editorial.
5. **Negocio.** Cuando exista una oferta, sumar página de venta, pago, CRM y
   seguimiento de clientes. Medir consultas calificadas, conversión y margen
   con costos completos. Mantener independientes los canales institucionales
   y comerciales.

## Mantenimiento

Revisar versiones y documentación antes de ampliar el motor; actualizar todos
los paquetes Remotion juntos. Mantener los lockfiles. Verificar cambios de
formato y condiciones de publicación con las propias redes.

Los medios originales ya existentes permanecen en el proyecto de MiComuna360.
Para nuevos videos, mantener maestros y entregables en almacenamiento privado
o compartido apropiado; evitar que el historial Git crezca con cada render.
No migrar ni borrar los archivos anteriores sin una decisión aparte.
