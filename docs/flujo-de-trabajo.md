# Del tema a la publicación

## Elegir una marca y una acción

| Marca | Contenido inicial útil | Acción a buscar | Evidencia que revisar |
|---|---|---|---|
| MiComuna360 | Una sección o una consulta ciudadana por video | Visitar la página pertinente | Datos públicos, territorio, fuente y vigencia |
| Monitoreo Intensivo | Una tarea del docente, demostrada con datos ficticios | Conocer o probar la herramienta | Función disponible, créditos y alcance pedagógico |
| Sindicato | Dónde encontrar información y cómo consultar | Usar el canal oficial o participar | Contenido autorizado y condiciones vigentes |
| Futuros negocios | Un problema, una solución y una demostración | Consultar o comprar | Oferta real, condiciones, evidencia y destino |

Para Monitoreo y el sindicato, confirmar el dominio público antes de cambiar el
destino de ejemplo. El brief de Monitoreo apunta al repositorio público como
referencia de desarrollo, no a un sitio de venta. El del sindicato es un esquema
editorial sin datos de documentos internos. Los colores nuevos son puntos de
partida editables, no una auditoría de sus identidades actuales.

## Producción de una pieza

1. **Brief.** Definir marca, objetivo, audiencia, tema, problema, beneficio,
   puntos de contenido, CTA, destino, duración y fuentes. Una pieza tiene una
   idea principal y una acción. Usar `informar` cuando el resultado buscado sea
   comprensión; no obligar a que todo termine en una venta.
2. **Evidencia.** Abrir la fuente y revisar lo que realmente afirma. Para un
   número: guardar unidad, período, territorio y fecha. En demostraciones de
   software, comprobar la función que se muestra. La fecha del brief registra
   la revisión; el programa no la hace por sí solo.
3. **Guion con GPT.** Usar el prompt generado o la habilidad del repositorio.
   Solicitar dos ganchos distintos y cuatro escenas. Mantener el resto de la
   pieza igual para que la comparación A/B tenga una interpretación útil.
4. **Validación.** Corregir el JSON hasta que pase `validar`. Después revisar
   afirmaciones, tiempos de lectura y tono. No interpretar «válido» como «listo
   para publicar».
5. **Materiales.** Grabar una demostración o preparar gráficos. Canva sirve
   para portadas y piezas estáticas. Higgsfield puede aportar recursos
   generativos puntuales; confirmar modelo, costo y derechos del material en
   cada encargo. No generar imágenes que se presenten como documentos o
   registros reales de una institución.
6. **Montaje.** Para texto y gráficos repetibles, usar Remotion. Para una
   grabación, preparar el corte con Auto-Editor y terminar el montaje en el
   editor elegido. Para escenas nuevas que requieran voz, producir o grabar el
   audio y sincronizarlo: la plantilla general no sintetiza voz ni subtítulos
   de karaoke automáticamente.
7. **Revisión.** Ver el MP4 completo y, al menos, un fotograma de cada escena.
   Revisar legibilidad, recortes, espacios ocupados por botones de cada red,
   audio, fuentes, créditos y CTA. Las zonas seguras de la plantilla son una
   base conservadora: comprobar la previsualización real de cada plataforma.
8. **Publicación.** Completar fecha, responsable, estado y archivo en el CSV.
   Publicar manualmente o usar Metricool si se conecta y se autoriza esa
   acción. Comprobar qué enlace puede usar realmente la persona: perfil,
   página de enlaces u otra ubicación permitida por esa red.
9. **Aprendizaje.** Revisar piezas después del mismo número de días. Registrar
   visitas y consultas, además de visualizaciones. Elegir una mejora para el
   siguiente ciclo; no declarar un ganador estadístico con una muestra pequeña.

## Rutina sugerida para empezar

Comenzar con **una marca y dos piezas por semana** durante dos semanas. Es una
propuesta operativa, no una frecuencia óptima demostrada para tus cuentas.

- Un bloque de planificación: elegir temas a partir de preguntas reales y
  comprobar fuentes.
- Un bloque de producción: guiones, grabaciones y montajes en lote.
- Un bloque de revisión y distribución: adaptar portada y texto a cada red.
- Un bloque de seguimiento: revisar resultados y elegir el siguiente tema.

Mantener una carpeta por campaña: `trabajo/marca-aaaa-mm-dd-tema/`. Guardar el
material maestro una sola vez y sacar derivados. Mantener un registro de
aprobaciones cuando se trabaje con contenidos institucionales o de terceros.

## Registro de resultados

`metricas.csv` contiene **una fila acumulada por publicación**. Al actualizar,
reemplazar esa fila; no añadir otra instantánea de la misma pieza. Comparar el
mismo período, por ejemplo sus primeros siete días, y usar IDs diferentes para
publicaciones distintas.

| Campo | Definición |
|---|---|
| `pieza_id` | ID de la fila en publicaciones.csv; único en el archivo de métricas |
| `red`, `variante` | Canal e identificador A o B |
| `visualizaciones` | Vistas reportadas por la red; no personas únicas |
| `visitas` | Sesiones del destino atribuidas a esa pieza, si se pueden medir |
| `consultas` | Consultas atribuidas, contando una persona una sola vez en el período |
| `ventas` | Ventas registradas y atribuidas dentro del período elegido |
| `ingresos` | Ingreso de esas ventas, con un criterio consistente documentado |
| `coste_marketing` | Producción y distribución imputadas a esa pieza |
| `moneda` | Código de tres letras; un archivo usa una sola moneda |

Para campos aún no medidos, no usar cero como sustituto. Dejar la pieza fuera
del informe hasta contar con el registro completo; el analizador rechaza celdas
numéricas vacías. El ejemplo `ejemplos/metricas-demo.csv` es **ficticio**.

```bash
npm run estudio -- metricas --input trabajo/campana-01/metricas.csv --out trabajo/campana-01/informe.md
```

El informe calcula visitas/vistas, consultas/visitas, ventas/consultas,
coste/consulta e ingresos/coste. Si el denominador es cero muestra «—». No
estima beneficio neto, ROAS publicitario ni causalidad. Los enlaces UTM no
registran visitas sin analítica en el destino; no se añadieron rastreadores a
las páginas en este cambio.

`consultas.csv` permite seguir un ID, su origen, estado y próximo paso.
Conservar nombres y datos de contacto en una herramienta privada. No hay envío
de mensajes, cobros ni un CRM conectado en el programa local.
