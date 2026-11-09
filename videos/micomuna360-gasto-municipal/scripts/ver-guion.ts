/** Muestra el guion generado desde los datos: `node scripts/ver-guion.ts`. */
import { escenasDe } from "../src/guion.ts";
import { top5, totalPorPersona, restoPorPersona } from "../src/calculos.ts";

for (const v of ["completo", "corto"] as const) {
  console.log(`\n=== ${v} ===`);
  for (const e of escenasDe(v)) {
    console.log(`\n[${e.id}] ${e.locucion || "(sin locución)"}`);
    for (const s of e.subtitulos) console.log(`   ${s.marcas.length ? `{${s.marcas.join(",")}} ` : ""}${s.texto}`);
  }
}
console.log(`\nPor persona: total ${totalPorPersona}, resto ${restoPorPersona}`);
console.log(top5.map((p) => `#${p.puesto} ${p.codigo} ${p.porPersona}`).join("\n"));
