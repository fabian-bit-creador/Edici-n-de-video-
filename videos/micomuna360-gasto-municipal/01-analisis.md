# Video «¿En qué se gasta la plata de La Pintana?» — Paso 1: análisis

Fuente de todo lo que sigue: repositorio `fabian-bit-creador/Micomuna360`
(commit `8f0a7f8`, 25-10-2026). Ninguna cifra se escribió a mano: salen de
`src/data/communes/la-pintana/` y se recalcularon con el mismo método del
sitio («de cada $100.000», redondeo a $100, mayor resto).

## 1. Qué hay realmente en las tres fuentes

| Lo que pediste | Qué es en el proyecto | ¿Trae cifras? | Estado |
|---|---|---|---|
| Informes financieros | `financial-reports.ts`: 6 estados financieros del ejercicio 2025 (informe del 16-03-2026) | **No**: son enlaces a los PDF oficiales | verificado 04-09-2026 |
| | `transparency/budget-execution.ts`: balances presupuestarios al **30-06-2026**, áreas municipal y salud | Sí: aprobado, vigente, comprometido y pagado por subtítulo | verificado 27-09-2026, conciliado en el build |
| Ranking de gastos | Los gráficos de Transparencia que ordenan los subtítulos de mayor a menor («¿En qué se fue cada $100.000 pagados?», «¿En qué se está usando?») | Sí, derivados de la ejecución a junio | — |
| Compromisos de pago | (a) Columna «comprometido» de la ejecución a junio | Sí | verificado |
| | (b) `transparency/liabilities.ts`: informe de pasivos de julio 2026 (67 cuentas) | Sí | **pendiente de clasificación** |

## 2. La foto general (área municipal, al 30-06-2026)

Al 30 de junio había pasado el 49,6 % del año.

| | Monto | De cada $100.000 vigentes |
|---|---|---|
| Presupuesto aprobado al inicio | $47.865 millones | — |
| Presupuesto vigente (disponible) | $64.288 millones | $100.000 |
| Comprometido | $34.385 millones | $53.500 |
| Pagado | $25.715 millones | $40.000 |
| Saldo sin comprometer | $29.902 millones | $46.500 |

El presupuesto creció $16.422 millones durante el año; $15.536 millones de
ese aumento es plata que quedó en caja al terminar 2025.

**De dónde viene** (presupuesto aprobado): Fondo Común Municipal $74.600 de
cada $100.000 · impuestos y derechos locales $15.600 · transferencias del
Estado $2.700 · todo lo demás $7.100.

## 3. Temas de gasto más importantes para un vecino

Peso dentro de lo pagado entre enero y junio («de cada $100.000 pagados»),
igual que en el sitio:

| # | Tema (nombre del sitio) | De cada $100.000 pagados | Pagado ene–jun | Vigente | Pagado / vigente | Comprometido / vigente | Pagado por habitante* |
|---|---|---|---|---|---|---|---|
| 1 | Servicios y compras: aseo, luz, agua, mantención | $35.400 | $9.105 M | $23.240 M | 39 % | **77 %** | $48.226 |
| 2 | Sueldos del personal municipal | $30.600 | $7.869 M | $17.935 M | 44 % | 44 % | $41.676 |
| 3 | Aportes a instituciones, organizaciones y ayudas sociales (incluye $1.236 M a salud) | $16.000 | $4.104 M | $6.908 M | 59 % | 68 % | $21.738 |
| 4 | Pago de cuentas de años anteriores (deuda flotante) | $5.600 | $1.441 M | $1.454 M | 99 % | — | $7.633 |
| 5 | Obras y proyectos de inversión | $4.300 | $1.114 M | $8.905 M | **13 %** | 19 % | $5.899 |
| — | Otros (devoluciones $2.800; reintegros $2.500; resto $2.800) | $8.100 | | | | | |
| | **Total** | $100.000 | $25.715 M | $64.288 M | 40 % | 53 % | $136.198 |

\* Población: proyección INE 2025 (188.806 personas, vía SINIM). El sitio no
publica gasto por habitante; es un cálculo nuevo y lo marcaría como tal.

**Salud municipal (cuenta aparte):** $49.881 M vigentes; al 30-06 se había
pagado $44.900 y comprometido $45.800 de cada $100.000. De lo pagado, el 73 %
son sueldos de los equipos de salud. De cada $100.000 del presupuesto
aprobado de salud, $82.100 vienen del Servicio de Salud (Estado) y $4.100 los
pone el municipio. No se suman municipal + salud sin descontar ese aporte
($1.236 M), que si no se contaría dos veces.

### Cómo explicar cada tema

1. **Servicios y compras (aseo, luz, agua, mantención).** Es lo que el
   vecino ve en la calle: retiro de basura, luz de las calles, áreas verdes.
   Cómo leerlo: el comprometido va muy alto (77 %) porque los contratos del
   año se firman al inicio y se pagan mes a mes, no es un sobregasto.
   Comparación útil: el peso ($35.400 de cada $100.000) y la brecha entre
   comprometido y pagado. **Límite:** la ejecución verificada no separa
   cuánto es aseo, cuánto luz y cuánto jardines.
2. **Sueldos del personal municipal.** Quienes atienden, fiscalizan y
   mantienen la comuna. Cómo leerlo: comprometido = pagado porque el sueldo
   se registra al pagarse; 44 % a mitad de año es un ritmo parejo.
3. **Aportes y ayudas sociales.** Transferencias a organizaciones,
   instituciones y ayudas a personas; incluye el aporte del municipio a la
   salud municipal. Lectura: van más rápido que el año (59 %) porque muchos
   aportes se entregan temprano.
4. **Obras e inversión.** Es la partida que más creció: de $2.035 M
   aprobados a $8.905 M vigentes (más de 4 veces). Lectura: solo 13 % pagado
   a mitad de año no es por sí solo un problema; las obras se pagan por
   avance y se concentran en el segundo semestre (así lo explica el sitio).
5. **Cuentas de años anteriores.** Lo que quedó comprometido en 2025 y se
   paga en 2026. Es el puente perfecto para explicar los compromisos.
6. **Salud municipal.** Presupuesto propio, financiado sobre todo por el
   Estado. Lectura: casi tres cuartos son sueldos de los equipos de salud.

### Comparaciones que ayudan, y cuáles se pueden hacer

| Comparación | ¿Se puede con las tres fuentes? |
|---|---|
| Peso dentro del total («de cada $100.000») | Sí |
| Ritmo contra el calendario (pagado vs 49,6 % del año) | Sí |
| Aprobado vs vigente (cuánto cambió en el año) | Sí |
| Gasto por habitante | Solo con la población de otra fuente del proyecto (SINIM 2025) |
| Variación anual (2026 vs 2025) | **No**: no hay ejecución de 2025 cargada. Los estados financieros 2025 son solo enlaces |
| Contra el promedio de la Región Metropolitana | Solo con SINIM (otra fuente): ingresos propios por habitante, dependencia del Fondo Común Municipal, gasto en salud por inscrito, series 2017–2025 |

## 4. Gasto ya realizado vs compromisos pendientes

- **Presupuesto vigente:** lo que se puede gastar en el año.
- **Comprometido:** lo que el municipio ya se obligó a pagar (contrato
  firmado, compra aceptada).
- **Pagado:** lo que ya salió de la caja.
- **Comprometido y todavía no pagado** (suma por subtítulo, sin la deuda
  flotante): **$10.111 millones** al 30-06-2026. El 87 % ($8.814 M) está en
  servicios y compras.

Por qué importa:

1. Esa plata ya tiene destino aunque no se haya pagado: lo realmente libre
   es el saldo sin comprometer ($29.902 M, y $7.176 M de él es inversión).
2. Lo que queda comprometido y sin pagar al cierre del año pasa al año
   siguiente como deuda flotante: en 2026 el municipio pagó $1.441 M de
   cuentas de años anteriores y salud $1.048 M.
3. Mirar solo lo pagado subestima el uso real del presupuesto; mirar solo
   lo comprometido sobreestima lo que salió de la caja.

**Informe de pasivos (julio 2026):** la familia 215 suma $1.499 millones en
58 cuentas (servicios de aseo $310,7 M, mantención de jardines $201,7 M,
otras personas jurídicas privadas $183,3 M, obras civiles $100,3 M,
electricidad $75,0 M…). El propio sitio advierte que **no son pagos ya
realizados, no son la deuda total y no equivalen al gasto del mes**, y su
clasificación contable está pendiente. Recomendación: no presentarlo como
«compromisos de pago pendientes»; usar el comprometido − pagado verificado.

## 5. Datos que faltan

1. Cifras de los estados financieros 2025: el proyecto solo tiene los enlaces.
2. Ejecución de 2025 (o de junio de 2025) para comparar año contra año.
3. Ejecución después de junio de 2026: julio viene en un formato nuevo que
   solo trae los movimientos del mes; agosto a octubre no están cargados.
   Hoy el dato tiene más de cuatro meses.
4. Desglose dentro de «servicios y compras» (aseo vs luz vs jardines) en
   cifras verificadas.
5. Gasto por sector, por programa o por dirección municipal.
6. Población 2026 (solo hay proyección 2025).
7. Clasificación oficial del informe de pasivos.
8. Educación: no aparece en el presupuesto municipal porque los colegios
   pasaron al Servicio Local de Educación Pública.

## 6. Fechas para el cierre del video

| Fuente | Corte del dato | Publicado por el municipio | Verificado por MiComuna360 |
|---|---|---|---|
| Balances presupuestarios (municipal y salud) | 30-06-2026 | 07-07-2026 | 27-09-2026 |
| Informe de pasivos, área municipal | julio 2026 | — | 04-09-2026 |
| Estados financieros (solo enlaces) | ejercicio 2025 | 16-03-2026 | 04-09-2026 |
| SINIM (si se usa) | 2025 | — | descarga 27-09-2026 |

Fuente: Municipalidad de La Pintana, Transparencia Activa (código MU124),
https://www.portaltransparencia.cl/PortalPdT/pdtta?codOrganismo=MU124
