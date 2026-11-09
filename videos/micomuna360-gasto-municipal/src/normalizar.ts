import { enPalabras } from "./palabras.ts";

/**
 * Lleva un texto a palabras comparables: minúsculas, sin tildes ni signos y
 * con los números escritos en palabras («$136 mil» → «ciento treinta y seis
 * mil»). Lo usan la verificación de la voz y la sincronía de subtítulos.
 */
export function palabrasNormalizadas(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/(\p{L})(\d)/gu, "$1 $2")
    .replace(/(\d)(\p{L})/gu, "$1 $2")
    .replace(/%/g, " por ciento ")
    .replace(/\d{1,3}(?:[.,]\d{3})+|\d+/g, (m) => ` ${enPalabras(Number(m.replace(/[.,]/g, "")))} `)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
