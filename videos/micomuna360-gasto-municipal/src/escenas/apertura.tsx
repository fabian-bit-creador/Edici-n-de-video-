import { UserRoundIcon } from "lucide-react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

import { Antetitulo, Aparecer, Cabecera, Chip, Contador, Fondo, Tarjeta, useAvance, useEntrada } from "../componentes/base.tsx";
import { totalPorPersona } from "../calculos.ts";
import { comuna, ejecucion2026, poblacion } from "../datos.ts";
import { clp, miles } from "../palabras.ts";
import { alfa, C, FUENTE, MARGEN } from "../tema.ts";
import type { EscenaPlan } from "../tiempos.ts";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const anio = ejecucion2026.corte.slice(0, 4);
const mes = MESES[Number(ejecucion2026.corte.slice(5, 7)) - 1];

/** 1 · Gancho: la pregunta, sobre el azul del modo oscuro del sitio. */
export function Gancho({ plan }: { plan: EscenaPlan }) {
  const frame = useCurrentFrame();
  const logo = useAvance(0, 52);
  const chip = useEntrada(plan.marcas.top ?? 40, 180);
  const palabras = `¿En qué se gasta la plata de ${comuna.nombre}?`.split(" ");
  const resaltadas = new Set(comuna.nombre.split(" ").map((p, i, arr) => (i === arr.length - 1 ? `${p}?` : p)));
  return (
    <AbsoluteFill>
      <Fondo oscuro />
      <Cabecera oscuro />
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: 150, background: C.ivory, opacity: logo, transform: `translateY(${(1 - logo) * -60}px)` }}>
          <Img
            src={staticFile("marca/isotipo-3d-960.webp")}
            style={{ width: 300, height: 300, transform: `rotate(${14 * (1 - logo)}deg) scale(${0.86 + 0.14 * logo})` }}
          />
        </div>
      </div>
      <div style={{ position: "absolute", top: 650, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip fondo={C.amber} color={C.navy} style={{ fontSize: 40, padding: "14px 34px", opacity: chip, transform: `scale(${0.6 + 0.4 * chip})` }}>
          TOP 5 · {anio}
        </Chip>
      </div>
      <div
        style={{
          position: "absolute",
          top: 760,
          left: MARGEN,
          right: MARGEN,
          textAlign: "center",
          fontFamily: FUENTE.titulo,
          fontWeight: 800,
          fontSize: 118,
          lineHeight: 1.02,
          letterSpacing: -2.5,
          color: C.ivory,
        }}
      >
        {palabras.map((p, i) => {
          const t = interpolate(frame, [8 + i * 3, 20 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 26,
                opacity: t,
                transform: `translateY(${(1 - t) * 40}px)`,
                color: resaltadas.has(p) ? C.darkTealInk : C.ivory,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** 2 · El ejemplo: lo pagado, dividido por cada persona de la comuna. */
export function Ejemplo({ plan }: { plan: EscenaPlan }) {
  const div = plan.marcas.div ?? 60;
  const pregunta = useEntrada(plan.marcas.pregunta ?? 120, 200);
  const personas = 7;
  return (
    <AbsoluteFill>
      <Fondo />
      <Cabecera />
      <Aparecer desde={0} style={{ position: "absolute", top: 250, left: MARGEN }}>
        <Antetitulo>
          Enero a {mes} de {anio}
        </Antetitulo>
      </Aparecer>
      <Aparecer desde={4} style={{ position: "absolute", top: 330, left: MARGEN, right: MARGEN }}>
        <Tarjeta>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 42, color: C.mutedFg }}>El municipio pagó</div>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 104, color: C.navy, letterSpacing: -2, lineHeight: 1.05 }}>
            <Contador valor={ejecucion2026.total.pagadoK / 1000} desde={6} duracion={36} formato={(n) => `$${miles(n)}`} />
            <span style={{ fontSize: 60, fontWeight: 700 }}> millones</span>
          </div>
        </Tarjeta>
      </Aparecer>
      <Aparecer desde={div} style={{ position: "absolute", top: 620, left: MARGEN, right: MARGEN }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <span style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 96, color: C.tealInk, lineHeight: 1 }}>÷</span>
          <div>
            <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 64, color: C.navy, lineHeight: 1.05 }}>
              {miles(poblacion.habitantes)} personas
            </div>
            <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 36, color: C.mutedFg }}>que viven en la comuna</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          {Array.from({ length: personas }, (_, i) => (
            <Persona key={i} desde={div + 6 + i * 3} />
          ))}
        </div>
      </Aparecer>
      <Aparecer desde={div + 18} style={{ position: "absolute", top: 870, left: MARGEN, right: MARGEN }}>
        <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 176, color: C.navy, letterSpacing: -6, lineHeight: 1 }}>
          <Contador valor={totalPorPersona} desde={div + 18} duracion={34} formato={clp} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4 }}>
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 52, color: C.tealInk }}>por persona</span>
          <span style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 27, color: C.mutedFg }}>
            Población: proyección INE {poblacion.anio} (SINIM)
          </span>
        </div>
      </Aparecer>
      <div style={{ position: "absolute", top: 1170, left: MARGEN, opacity: pregunta, transform: `scale(${0.7 + 0.3 * pregunta})`, transformOrigin: "left center" }}>
        <Chip fondo={alfa(C.amber, 0.28)} color={C.amberInk} style={{ fontSize: 44 }}>
          ¿En qué se fueron?
        </Chip>
      </div>
    </AbsoluteFill>
  );
}

function Persona({ desde }: { desde: number }) {
  const p = useEntrada(desde, 220);
  return (
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        background: alfa(C.teal, 0.15),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${p})`,
      }}
    >
      <UserRoundIcon size={48} color={C.tealInk} strokeWidth={2.2} />
    </div>
  );
}
