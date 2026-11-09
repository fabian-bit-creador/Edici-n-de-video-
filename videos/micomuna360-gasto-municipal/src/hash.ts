/** Huella corta y estable de un texto (FNV-1a de 32 bits, dos semillas). */
export function huella(texto: string): string {
  const fnv = (semilla: number) => {
    let h = semilla >>> 0;
    for (let i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  };
  return fnv(0x811c9dc5) + fnv(0x01234567);
}
