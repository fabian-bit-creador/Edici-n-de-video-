/**
 * DATOS DEL VIDEO. Es el único archivo que hay que editar si cambian las
 * cifras: la locución, los subtítulos, los gráficos y el ranking se
 * recalculan desde aquí (ver README.md, «Cómo regenerar el video»).
 *
 * Montos en MILES de pesos, tal como los imprimen los informes oficiales.
 * Ninguna cifra se estima: cada bloque dice de dónde sale.
 */

/** Código del subtítulo presupuestario (215-XX) y cómo se le explica al vecino. */
export interface Subtitulo {
  codigo: string;
  nombreOficial: string;
  /** Nombre en lenguaje simple (el mismo del sitio MiComuna360). */
  etiqueta: string;
  vigenteK: number;
  comprometidoK: number;
  pagadoK: number;
}

export interface Fuente {
  id: string;
  institucion: string;
  documento: string;
  detalle: string;
  url: string;
}

export const comuna = {
  nombre: "La Pintana",
  sitio: "micomuna360.vercel.app/la-pintana/transparencia",
};

/** Proyección de población INE 2025, publicada por SINIM (variable ITPC). */
export const poblacion = {
  habitantes: 188_806,
  anio: 2025,
  fuenteId: "sinim",
};

/**
 * Balance presupuestario de GASTOS, área municipal, al 30 de junio de 2026.
 * Fuente: Transparencia Activa de la Municipalidad de La Pintana. Cifras
 * transcritas y conciliadas por MiComuna360
 * (src/data/communes/la-pintana/transparency/budget-execution.ts).
 */
export const ejecucion2026 = {
  corte: "2026-06-30",
  publicado: "2026-07-07",
  verificado: "2026-09-27",
  fuenteId: "ejecucion-2026",
  total: { aprobadoK: 47_865_315, vigenteK: 64_287_585, comprometidoK: 34_385_340, pagadoK: 25_715_041 },
  subtitulos: [
    { codigo: "215-21", nombreOficial: "Gastos en personal", etiqueta: "Sueldos del personal municipal", vigenteK: 17_934_875, comprometidoK: 7_868_703, pagadoK: 7_868_703 },
    { codigo: "215-22", nombreOficial: "Bienes y servicios de consumo", etiqueta: "Servicios y compras: aseo, luz, agua, mantención", vigenteK: 23_239_817, comprometidoK: 17_919_034, pagadoK: 9_105_324 },
    { codigo: "215-23", nombreOficial: "Prestaciones de seguridad social", etiqueta: "Indemnizaciones y desahucios", vigenteK: 920_000, comprometidoK: 390_878, pagadoK: 390_878 },
    { codigo: "215-24", nombreOficial: "Transferencias corrientes", etiqueta: "Aportes a instituciones, organizaciones y ayudas sociales", vigenteK: 6_907_657, comprometidoK: 4_674_637, pagadoK: 4_104_339 },
    { codigo: "215-25", nombreOficial: "Íntegros al fisco", etiqueta: "Reintegro de fondos no utilizados", vigenteK: 2_982_340, comprometidoK: 656_411, pagadoK: 656_411 },
    { codigo: "215-26", nombreOficial: "Otros gastos corrientes", etiqueta: "Devoluciones, sentencias y fondos de terceros", vigenteK: 1_068_783, comprometidoK: 713_714, pagadoK: 713_714 },
    { codigo: "215-29", nombreOficial: "Adquisición de activos no financieros", etiqueta: "Compra de vehículos, equipos y computadores", vigenteK: 794_406, comprometidoK: 382_418, pagadoK: 270_977 },
    { codigo: "215-31", nombreOficial: "Iniciativas de inversión", etiqueta: "Obras y proyectos de inversión", vigenteK: 8_905_332, comprometidoK: 1_729_643, pagadoK: 1_113_707 },
    { codigo: "215-33", nombreOficial: "Transferencias de capital", etiqueta: "Aportes a programas de vivienda (SERVIU)", vigenteK: 80_000, comprometidoK: 49_902, pagadoK: 49_902 },
    /* Deuda flotante: compromisos de años anteriores; este año solo se pagan. */
    { codigo: "215-34", nombreOficial: "Servicio de la deuda", etiqueta: "Pago de cuentas de años anteriores", vigenteK: 1_454_375, comprometidoK: 0, pagadoK: 1_441_087 },
  ] satisfies Subtitulo[],
  /** Ingresos municipales: presupuesto aprobado total y Fondo Común Municipal. */
  ingresos: { aprobadoK: 47_865_315, fondoComunMunicipalAprobadoK: 35_707_015 },
  /** Área salud: presupuesto vigente para pagar cuentas de años anteriores (215-34). */
  saludDeudaVigenteK: 1_048_962,
};

/**
 * Estado de Situación Presupuestaria CONSOLIDADO 2025 (municipio + salud
 * municipal, 1-ene a 31-dic-2025), firmado el 16-03-2026. Transcrito del PDF
 * escaneado y conciliado (ver 02-guion.md y fuentes/SHA256SUMS.txt).
 */
export const estado2025 = {
  fecha: "2026-03-16",
  fuenteId: "estado-2025",
  inversion: { actualizadoK: 11_851_076, pagadoK: 4_818_627 },
  /** Devengado y no pagado al 31-12-2025 (nota «o» de las notas explicativas). */
  porPagarK: 2_503_336,
  /** Proyectos en ejecución que nombra la nota «n» de las notas explicativas. */
  proyectosEjemplo: ["Recarpeteo de calles", "Veredas", "Luminarias", "Juegos infantiles"],
};

/** SINIM 2025: ingresos propios permanentes por habitante (IADM74), pesos de dic-2025. */
export const sinim2025 = {
  anio: 2025,
  fuenteId: "sinim",
  ingresosPropiosPorHabitante: 42_000,
  promedioRegionMetropolitana: 213_942,
  comunasEnPromedio: 52,
};

export const fuentes: Fuente[] = [
  {
    id: "ejecucion-2026",
    institucion: "Municipalidad de La Pintana",
    documento: "Balances de ejecución presupuestaria al 30-06-2026",
    detalle: "Transparencia Activa (MU124) · publicados el 07-07-2026",
    url: "https://www.portaltransparencia.cl/PortalPdT/pdtta?codOrganismo=MU124",
  },
  {
    id: "estado-2025",
    institucion: "Municipalidad de La Pintana",
    documento: "Estado de Situación Presupuestaria 2025 y notas",
    detalle: "Estados financieros 2025 · informe del 16-03-2026",
    url: "https://cloud.pintana.cl/index.php/s/da2pkfJpK5ZaZBJ",
  },
  {
    id: "sinim",
    institucion: "SUBDERE — SINIM",
    documento: "Ingresos propios por habitante 2025 y población INE 2025",
    detalle: "Datos municipales · descarga del 27-09-2026",
    url: "https://datos.sinim.gov.cl/datos_municipales.php",
  },
];
