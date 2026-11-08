# Video «Top 5: ¿en qué se gasta la plata de La Pintana?» — Paso 3: guion

**Formato:** vertical 9:16 (1080 × 1920) para Reels, TikTok y Shorts.
**Duración estimada:** 90 a 100 s. La duración exacta depende de la voz:
cada escena dura lo que dura su locución.
**Voz:** sintética de Gemini, español neutro y tono cercano. Muestras en
`muestras-voz/`.
**Música:** base instrumental suave generada con Lyria (Google), a volumen
bajo bajo la voz.
**Subtítulos:** siempre en pantalla, sincronizados con la voz. La mayoría
ve los videos sin sonido.

## Cómo plantearlo ante la gente

1. **Gancho en los primeros 2 segundos:** una pregunta y una cifra personal
   («$136 mil por persona»), no un número abstracto de miles de millones.
2. **Cuenta regresiva Top 5:** la gente se queda hasta ver el #1. Es un
   ranking entre tipos de gasto de la comuna, no entre comunas, así que
   respeta la regla del sitio de no poner notas a la comuna.
3. **Un «ojo» en cada puesto:** cómo leer el dato, no un juicio. Enseña a
   interpretar.
4. **Una sola lección clave:** pagado no es lo mismo que comprometido.
5. **Cerrar con una pregunta abierta** («¿Lo notas en tu barrio?»). Los
   comentarios le dan alcance en las redes, y es la pregunta que querías
   dejarle a la gente.
6. **Fuente y fecha siempre visibles.** Es lo que distingue a MiComuna360.
7. **Formato de serie:** este es el episodio 1. Los siguientes pueden ser
   Salud, Obras, Ferias…

## Recomendación sobre los compromisos de pago

Usar solo cifras verificadas:

- **Comprometido sin pagar al 30-06-2026: $10.111 millones.** El 87 % está
  en servicios y compras (aseo, luz, mantención).
- **El puente 2025 → 2026.** 2025 cerró con **$2.503.336 mil por pagar**
  (estado financiero 2025). En 2026 el presupuesto para «cuentas de años
  anteriores» (municipal $1.454.375 mil + salud $1.048.962 mil) es
  **$2.503.337 mil**: coinciden, salvo $1 mil de redondeo.

El **informe de pasivos de julio** queda fuera: el propio sitio lo marca
como pendiente de clasificación y advierte que no son pagos ni deuda total.

## Fuente nueva incorporada (no está en el sitio)

**Estado de Situación Presupuestaria Consolidado 2025** (municipio + salud
municipal, 1-ene a 31-dic-2025, miles de pesos, firmado el 16-03-2026).
Descargado el 08-11-2026 del enlace oficial que ya usa MiComuna360
(`cloud.pintana.cl/index.php/s/da2pkfJpK5ZaZBJ`). Copia y huella SHA-256 en
`fuentes/`.

Es un PDF escaneado; lo transcribí y comprobé: las columnas suman los
totales impresos y «por pagar» = devengado − pagado en cada fila.

| Gastos 2025 (miles de $) | Actualizado | Devengado | Pagado | Por pagar |
|---|---|---|---|---|
| 21 Gastos en personal | 53.097.056 | 50.394.873 | 50.005.385 | 389.488 |
| 22 Bienes y servicios de consumo | 27.315.828 | 21.353.992 | 19.885.891 | 1.468.101 |
| 23 Prestaciones de seguridad social | 1.145.157 | 1.099.457 | 1.099.457 | — |
| 24 Transferencias corrientes | 10.172.132 | 9.730.608 | 9.667.113 | 63.495 |
| 25 Íntegros al fisco | 28.716 | 28.715 | 28.715 | — |
| 26 Otros gastos corrientes | 4.098.510 | 1.230.397 | 814.186 | 416.211 |
| 29 Adquisición de activos no financieros | 2.481.282 | 992.763 | 979.050 | 13.713 |
| 31 Iniciativas de inversión | 11.851.076 | 4.970.955 | 4.818.627 | 152.328 |
| 33 Transferencias de capital | 100.000 | 6.336 | 6.336 | — |
| 34 Servicio de la deuda | 4.574.275 | 4.574.275 | 4.574.275 | — |
| **Total** | **114.864.032** | **94.382.371** | **91.879.035** | **2.503.336** |

La nota «o» de las Notas Explicativas confirma qué son: compromisos que
se devengaron en diciembre y no alcanzaron a pagarse antes del cierre.

**Aviso:** el estado es «consolidado» y no dice si descuenta el aporte
del municipio a salud. Por eso no lo sumo ni lo comparo con totales 2026;
solo lo uso para obras y para el puente de compromisos.

---

## Escenas

Las cifras de locución van escritas en palabras y redondeadas para que la
voz las lea bien. La pantalla muestra la cifra exacta.

**Base del ranking** (municipal, pagado entre enero y junio de 2026,
dividido por 188.806 habitantes, INE 2025):
servicios $48.226 · sueldos $41.676 · aportes y ayudas $21.738 · cuentas
de años anteriores $7.633 · obras $5.899 · resto $11.026 · **total $136.198**.

### 1 · Gancho (≈ 0:00–0:05)

- **Pantalla:** «¿En qué se gasta la plata de La Pintana?» y un chip «TOP 5 · 2026».
- **Locución:** «¿En qué se gasta la plata de La Pintana? Te lo muestro en
  un top cinco.»
- **Gráfico:** fondo azul profundo. El isotipo 3D entra con su giro de
  14°, el título aparece palabra por palabra y cinco barras turquesa crecen
  de fondo como adelanto.

### 2 · El ejemplo: tu parte (≈ 0:05–0:16)

- **Pantalla:** contador grande **$136.198 por persona**. Debajo: «pagado por
  el municipio entre enero y junio de 2026». Letra chica: «$25.715 millones
  ÷ 188.806 habitantes».
- **Locución:** «Entre enero y junio, el municipio pagó más de veinticinco
  mil millones de pesos. Repartido entre todas las personas que viven en la
  comuna, son unos ciento treinta y seis mil pesos por persona. ¿En qué se fueron?»
- **Gráfico:** tarjeta blanca sobre marfil. El número sube de 0 a 136.198 y
  la división aparece debajo.

### 3 · #5 Obras y proyectos (≈ 0:16–0:28)

- **Pantalla:** «#5 Obras y proyectos» · **$5.899 por persona**. Medidor:
  «$8.905 millones disponibles · 13 % pagado» con la marca «mitad del año».
  Línea chica: «Todo 2025: $11.851 M disponibles → $4.819 M pagados (41 %)».
  Chips: «Recarpeteo de calles · Veredas · Luminarias · Juegos infantiles».
- **Locución:** «Número cinco: obras y proyectos, unos seis mil pesos por
  persona. Ojo: hay casi nueve mil millones disponibles, pero a junio se
  había pagado solo el trece por ciento. Las obras se pagan a medida que
  avanzan.»
- **Gráfico:** el medidor del sitio (riel, comprometido y pagado) con la
  raya de la mitad del año. Los chips son proyectos en ejecución que nombra
  el municipio en sus notas a los estados financieros 2025 (nota «n»).

### 4 · #4 Cuentas de años anteriores (≈ 0:28–0:35)

- **Pantalla:** «#4 Cuentas de años anteriores» · **$7.633 por persona** ·
  «Compromisos de 2025 que se pagan en 2026».
- **Locución:** «Número cuatro: cuentas que quedaron pendientes del año
  anterior. Unos siete mil seiscientos pesos por persona. Ya volvemos a
  esto.»
- **Gráfico:** la barra entra al tablero del ranking, bajo la #5. Ícono de
  recibo.

### 5 · #3 Aportes y ayudas sociales (≈ 0:35–0:43)

- **Pantalla:** «#3 Aportes y ayudas sociales» · **$21.738 por persona** ·
  «Incluye el aporte del municipio a la salud municipal».
- **Locución:** «Número tres: aportes a organizaciones, ayudas sociales y lo
  que el municipio pone para la salud municipal. Unos veintidós mil pesos
  por persona.»
- **Gráfico:** la barra entra al tablero. Ícono de mano con corazón.

### 6 · #2 Sueldos del personal municipal (≈ 0:43–0:51)

- **Pantalla:** «#2 Sueldos del personal municipal» · **$41.676 por persona**.
- **Locución:** «Número dos: los sueldos de quienes trabajan en el
  municipio, atendiendo, fiscalizando y manteniendo la comuna. Unos cuarenta
  y dos mil pesos por persona.»
- **Gráfico:** la barra entra al tablero. Ícono de personas.

### 7 · #1 Aseo, luz, agua y mantención (≈ 0:51–1:03)

- **Pantalla:** «#1 Aseo, luz, agua y mantención» · **$48.226 por persona**.
  Al final, el tablero completo del Top 5 y la pregunta «¿Lo notas en tu
  calle?».
- **Locución:** «Y el número uno: servicios y compras. Aseo, luz, agua y
  mantención de la comuna. Unos cuarenta y ocho mil pesos por persona. Es lo
  que ves todos los días en tu calle.»
- **Gráfico:** el #1 entra con más énfasis (escala y destello de los arcos
  del logo). Después se ve el tablero completo con las cinco barras.

### 8 · Ojo: pagado no es comprometido (≈ 1:03–1:19)

- **Pantalla:**
  1. Barra de tres capas: disponible $64.288 M · comprometido $34.385 M ·
     pagado $25.715 M.
  2. Se marca el tramo entre comprometido y pagado: «$10.111 millones
     comprometidos, aún sin pagar».
  3. Flecha «2025 cerró con $2.503 M por pagar» → «2026: $2.503 M para
     pagarlas».
- **Locución:** «Ahora, ojo: pagado no es lo mismo que comprometido. A junio
  había diez mil millones ya comprometidos, pero todavía sin pagar. Y lo que
  no alcanza a pagarse en el año pasa al siguiente: 2025 cerró con dos mil
  quinientos millones por pagar, justo lo que este año se reservó para esas
  cuentas.»
- **Gráfico:** el medidor de ejecución del sitio en grande, con caja ámbar
  de «cómo leer» (mismo estilo que el aviso del sitio).

### 9 · ¿De dónde sale la plata? (≈ 1:19–1:31)

- **Pantalla:** anillo 360° al 75 %: «Casi 3 de cada 4 pesos del presupuesto
  municipal aprobado 2026: Fondo Común Municipal». Dos barras: «Ingresos propios por habitante (2025): La
  Pintana $42.000 · Promedio comunas RM $213.942».
- **Locución:** «¿Y de dónde sale la plata? Casi tres de cada cuatro pesos
  vienen del Fondo Común Municipal, un fondo solidario entre todas las
  comunas del país. Por su cuenta, La Pintana recauda unos cuarenta y dos
  mil pesos por habitante; el promedio de la región, unos doscientos catorce
  mil.»
- **Gráfico:** `RingMeter` del sitio (firma 360° de la marca) y dos barras.
  Se muestra como contexto, sin colores de «bien» o «mal».

### 10 · Pregunta y llamado (≈ 1:31–1:38)

- **Pantalla:** «¿Lo notas en tu barrio? Cuéntanos en los comentarios» y
  «Todos los datos, con su fuente: micomuna360.vercel.app/la-pintana/transparencia».
- **Locución:** «¿Lo notas en tu barrio? Cuéntanos en los comentarios. Y
  revisa todos los datos, con su fuente, en Mi Comuna 360.»
- **Gráfico:** logo MiComuna360 (isotipo y nombre) y la dirección del sitio.

### 11 · Fuentes y fecha (≈ 1:38–1:44, solo música)

- **Pantalla:**
  - Municipalidad de La Pintana, Transparencia Activa (MU124): balances de
    ejecución presupuestaria al 30-06-2026 (publicados el 07-07-2026) y
    Estado de Situación Presupuestaria 2025 (16-03-2026).
  - SUBDERE–SINIM 2025 y proyección de población INE 2025.
  - «Datos al 30 de junio de 2026 · verificados por MiComuna360 el
    27-09-2026 · video actualizado el {fecha de generación}».
- **Gráfico:** tarjeta con el `SourceBadge` del sitio (verificado +
  institución + fecha).

---

## Texto sugerido para la publicación

> ¿En qué se gasta la plata de La Pintana? Top 5 con datos oficiales del
> municipio, explicados en simple. ¿Lo notas en tu barrio? Te leemos 👇
> Fuente: Transparencia Activa, Municipalidad de La Pintana (datos al
> 30-06-2026). Más en micomuna360.vercel.app/la-pintana
> #LaPintana #Transparencia #PresupuestoMunicipal #MiComuna360

## Para la construcción (paso 4)

- Remotion en `videos/micomuna360-gasto-municipal/`. Un archivo de datos
  (`datos.ts`) con las cifras y su fuente. Si cambian los datos, se edita
  ese archivo y se corre un solo comando.
- Una llamada de voz por escena. Cada clip se transcribe automáticamente
  para comprobar que diga exactamente el guion, y si no, se regenera.
- Zonas seguras de Reels y TikTok: nada importante en el 20 % inferior ni
  en la franja derecha de los botones.
