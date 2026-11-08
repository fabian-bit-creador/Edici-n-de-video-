/**
 * Cifras derivadas de datos.ts. Nada se escribe a mano: si cambian los
 * datos, cambia el ranking, la locución y los gráficos.
 */
import { ejecucion2026, estado2025, poblacion, sinim2025, type Subtitulo } from "./datos.ts";

/** Miles de pesos → pesos por habitante, redondeado. */
export function porPersona(milesDePesos: number): number {
  return Math.round((milesDePesos * 1000) / poblacion.habitantes);
}

export interface PuestoRanking extends Subtitulo {
  puesto: number;
  porPersona: number;
}

const ordenados = [...ejecucion2026.subtitulos].sort((a, b) => b.pagadoK - a.pagadoK);

/** Los cinco tipos de gasto con más pagado entre enero y la fecha de corte. */
export const top5: PuestoRanking[] = ordenados.slice(0, 5).map((s, i) => ({
  ...s,
  puesto: i + 1,
  porPersona: porPersona(s.pagadoK),
}));

export const totalPorPersona = porPersona(ejecucion2026.total.pagadoK);
export const restoPorPersona = totalPorPersona - top5.reduce((sum, p) => sum + p.porPersona, 0);

/** Comprometido que todavía no se paga (suma por subtítulo; la deuda flotante no cuenta). */
export const comprometidoSinPagarK = ejecucion2026.subtitulos.reduce(
  (sum, s) => sum + Math.max(s.comprometidoK - s.pagadoK, 0),
  0
);
const serviciosSinPagarK = (() => {
  const s = ejecucion2026.subtitulos.find((x) => x.codigo === "215-22");
  return s ? Math.max(s.comprometidoK - s.pagadoK, 0) : 0;
})();
export const parteServiciosSinPagar = serviciosSinPagarK / comprometidoSinPagarK;

/** Lo que 2026 reservó para cuentas de años anteriores (municipal + salud). */
export const deudaReservada2026K =
  (ejecucion2026.subtitulos.find((x) => x.codigo === "215-34")?.vigenteK ?? 0) +
  ejecucion2026.saludDeudaVigenteK;
/** ¿Coinciden lo que quedó por pagar en 2025 y lo reservado en 2026? (±1 %) */
export const puenteCalza =
  Math.abs(deudaReservada2026K - estado2025.porPagarK) / estado2025.porPagarK < 0.01;

export const inversion2026 = (() => {
  const s = ejecucion2026.subtitulos.find((x) => x.codigo === "215-31")!;
  return {
    vigenteK: s.vigenteK,
    parteComprometida: s.comprometidoK / s.vigenteK,
    partePagada: s.pagadoK / s.vigenteK,
  };
})();
export const inversion2025PartePagada = estado2025.inversion.pagadoK / estado2025.inversion.actualizadoK;

export const parteFondoComun =
  ejecucion2026.ingresos.fondoComunMunicipalAprobadoK / ejecucion2026.ingresos.aprobadoK;

export const vecesPromedioRegional =
  sinim2025.promedioRegionMetropolitana / sinim2025.ingresosPropiosPorHabitante;

/** Parte del año transcurrida a la fecha de corte (0–1), igual que el sitio. */
export const parteDelAnio = (() => {
  const [a, m, d] = ejecucion2026.corte.split("-").map(Number);
  const fecha = Date.UTC(a, m - 1, d, 12);
  const inicio = Date.UTC(a, 0, 1);
  const fin = Date.UTC(a + 1, 0, 1);
  return (fecha - inicio + 12 * 3_600_000) / (fin - inicio);
})();

export const anioCorte = Number(ejecucion2026.corte.slice(0, 4));
export const mesCorte = Number(ejecucion2026.corte.slice(5, 7));

/**
 * Para el medidor «pagado vs comprometido»: lo pagado de lo comprometido
 * este año (sin las cuentas de años anteriores, que no figuran como
 * comprometidas). Así la brecha del gráfico es exactamente lo comprometido
 * sin pagar.
 */
export const pagadoDeLoComprometidoK = ejecucion2026.total.comprometidoK - comprometidoSinPagarK;
export const deudaAnteriorPagadaK =
  ejecucion2026.subtitulos.find((x) => x.codigo === "215-34")?.pagadoK ?? 0;
