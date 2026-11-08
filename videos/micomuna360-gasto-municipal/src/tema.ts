/**
 * Tokens de MiComuna360 (src/app/globals.css y DESIGN.md del sitio),
 * escalados para un video vertical de 1080 × 1920.
 */
export const C = {
  navy: "#17375E",
  teal: "#1E8E89",
  sky: "#67B7D1",
  terracotta: "#C95B5B",
  amber: "#E9B949",
  ivory: "#F7F7F2",
  slate: "#4B5563",
  /* Tintas: colores de marca aptos para texto (WCAG AA). */
  tealInk: "#136A66",
  skyInk: "#2A7494",
  terracottaInk: "#A94444",
  amberInk: "#8A5A06",
  foreground: "#374151",
  muted: "#ECEEE7",
  mutedFg: "#5B6270",
  accent: "#E6F2F7",
  border: "#E3E4DC",
  card: "#FFFFFF",
  /* Modo oscuro del sitio. */
  darkBg: "#0F2038",
  darkCard: "#17375E",
  darkFg: "#E5E7EB",
  darkMutedFg: "#B3B9C3",
  darkTeal: "#34B3AD",
  darkTealInk: "#5CCBC4",
  darkSkyInk: "#A3D5E6",
  darkAmberInk: "#F3D68F",
};

export const FUENTE = {
  titulo: '"Bricolage Grotesque", "Nunito", sans-serif',
  texto: '"Nunito", sans-serif',
};

export const ANCHO = 1080;
export const ALTO = 1920;
export const FPS = 30;
/** Márgenes seguros: Reels y TikTok tapan la franja inferior y los botones de la derecha. */
export const MARGEN = 72;
export const ZONA_SUBTITULOS = { arriba: 1300, alto: 200 };

/** Mezcla de un color con transparencia («teal al 40 %»). */
export function alfa(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
