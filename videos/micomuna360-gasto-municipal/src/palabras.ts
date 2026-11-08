/**
 * Números en palabras (español) y formatos chilenos. La locución escribe
 * las cifras en palabras para que la voz sintética no lea «136.198» como
 * un decimal; la pantalla muestra la cifra exacta.
 */

const BASE = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
  "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés",
  "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

/** «uno» → «un» delante de «mil» y «millones» («veintiún mil», «treinta y un millones»). */
function apocope(texto: string): string {
  return texto.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");
}

function bajoMil(n: number): string {
  if (n < 30) return BASE[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${BASE[u]}`;
  }
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  return resto === 0 ? CENTENAS[c] : `${CENTENAS[c]} ${bajoMil(resto)}`;
}

function bajoMillon(n: number): string {
  if (n < 1000) return bajoMil(n);
  const miles = Math.floor(n / 1000);
  const resto = n % 1000;
  const cabeza = miles === 1 ? "mil" : `${apocope(bajoMil(miles))} mil`;
  return resto === 0 ? cabeza : `${cabeza} ${bajoMil(resto)}`;
}

/** Entero no negativo en palabras: 136198 → «ciento treinta y seis mil ciento noventa y ocho». */
export function enPalabras(n: number): string {
  const entero = Math.round(Math.abs(n));
  if (entero < 1_000_000) return bajoMillon(entero);
  const millones = Math.floor(entero / 1_000_000);
  const resto = entero % 1_000_000;
  const cabeza = millones === 1 ? "un millón" : `${apocope(bajoMillon(millones))} millones`;
  return resto === 0 ? cabeza : `${cabeza} ${bajoMillon(resto)}`;
}

/** Separador de miles chileno: 136198 → «136.198». */
export function miles(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** «$136.198» */
export function clp(n: number): string {
  return `$${miles(n)}`;
}

/** Monto en miles de pesos → «$8.905 millones». */
export function millonesTexto(milesDePesos: number): string {
  return `$${miles(milesDePesos / 1000)} millones`;
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** «2026-06-30» → «30 de junio de 2026». */
export function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** «2026-06-30» → «30-06-2026». */
export function fechaCorta(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}-${m}-${a}`;
}

/** Fecha de hoy en Chile continental, en formato ISO. */
export function hoyEnChile(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
}
