import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { Antetitulo, Aparecer, Barra, Cabecera, Chip, Contador, FichaIcono, Fondo, Medidor, Tarjeta, useAvance, useEntrada } from "../componentes/base.tsx";
import { inversion2025PartePagada, inversion2026, parteDelAnio, top5, type PuestoRanking } from "../calculos.ts";
import { estado2025 } from "../datos.ts";
import { textosDe } from "../guion.ts";
import { clp, millonesTexto } from "../palabras.ts";
import { alfa, C, FUENTE, MARGEN } from "../tema.ts";
import type { EscenaPlan } from "../tiempos.ts";

const MAXIMO = top5[0].porPersona;
const pct = (x: number) => `${Math.round(x * 100)} %`;

/** Escenas 3 a 7: un puesto del Top 5, del #5 al #1. */
export function Puesto({ plan }: { plan: EscenaPlan }) {
  const frame = useCurrentFrame();
  const puesto = top5.find((p) => p.puesto === plan.escena.puesto)!;
  const t = textosDe(puesto);
  const numero = useEntrada(0, 140);
  const ficha = useEntrada(6, 170);
  const final = plan.marcas.calle;
  /* En el #1, al final, el detalle deja paso al tablero completo. */
  const salida = final === undefined ? 0 : interpolate(frame, [final - 4, final + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Fondo />
      <Cabecera />
      <div style={{ position: "absolute", top: 250, left: MARGEN, right: MARGEN, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Antetitulo>Top 5 · ¿En qué se gastó?</Antetitulo>
        <Progreso actual={puesto.puesto} />
      </div>

      <div style={{ opacity: 1 - salida, transform: `translateY(${-60 * salida}px)` }}>
        <div style={{ position: "absolute", top: 305, left: MARGEN, display: "flex", alignItems: "center", gap: 30 }}>
          <span
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 800,
              fontSize: 196,
              lineHeight: 1,
              letterSpacing: -7,
              color: puesto.puesto === 1 ? C.terracotta : C.teal,
              transform: `translateX(${(1 - numero) * -120}px) scale(${0.8 + 0.2 * numero})`,
              opacity: numero,
              display: "inline-block",
            }}
          >
            #{puesto.puesto}
          </span>
          <div style={{ transform: `scale(${ficha}) rotate(${(1 - ficha) * -12}deg)` }}>
            <FichaIcono tipo={t.icono} size={150} />
          </div>
        </div>
        {/* Título, detalle y monto van en columna: si el título ocupa dos líneas, lo demás baja. */}
        <div style={{ position: "absolute", top: 515, left: MARGEN, right: MARGEN }}>
          <Aparecer desde={8}>
            <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 74, color: C.navy, lineHeight: 1.04, letterSpacing: -1.5 }}>{t.titulo}</div>
            {t.detalle && (
              <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 34, color: C.mutedFg, marginTop: 10 }}>{t.detalle}</div>
            )}
          </Aparecer>
          <Aparecer desde={14} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <span style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 122, color: C.navy, letterSpacing: -4, lineHeight: 1 }}>
                <Contador valor={puesto.porPersona} desde={14} duracion={30} formato={clp} />
              </span>
              <span style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 44, color: C.tealInk }}>por persona</span>
            </div>
          </Aparecer>
        </div>
        <div style={{ position: "absolute", top: 905, left: MARGEN, right: MARGEN }}>
          {puesto.codigo === "215-31" ? <DetalleObras plan={plan} /> : <Tablero hasta={puesto.puesto} compacto />}
        </div>
      </div>

      {final !== undefined && (
        <div style={{ position: "absolute", top: 330, left: MARGEN, right: MARGEN, opacity: salida, transform: `translateY(${60 * (1 - salida)}px)` }}>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 86, color: C.navy, letterSpacing: -1.5, marginBottom: 26 }}>
            El Top 5, por persona
          </div>
          <Tablero hasta={1} desde={final} />
          <div style={{ marginTop: 36 }}>
            <Chip fondo={alfa(C.amber, 0.3)} color={C.amberInk} style={{ fontSize: 46, padding: "16px 34px" }}>
              ¿Lo notas en tu calle?
            </Chip>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

/** Puntos del 5 al 1: dónde va la cuenta regresiva. */
function Progreso({ actual }: { actual: number }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {[5, 4, 3, 2, 1].map((n) => (
        <div
          key={n}
          style={{
            width: n === actual ? 44 : 18,
            height: 18,
            borderRadius: 9,
            background: n >= actual ? C.teal : alfa(C.teal, 0.2),
          }}
        />
      ))}
    </div>
  );
}

/**
 * Tablero del ranking: los puestos ya revelados (del #5 hasta `hasta`).
 * Las barras usan la misma escala en todas las escenas para poder compararse.
 */
function Tablero({ hasta, compacto = false, desde = 0 }: { hasta: number; compacto?: boolean; desde?: number }) {
  const filas = top5.filter((p) => p.puesto >= hasta);
  const frame = useCurrentFrame();
  return (
    <Tarjeta style={{ padding: compacto ? "22px 32px" : "36px 40px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: compacto ? 12 : 30 }}>
        {filas.map((p, i) => {
          const nueva = p.puesto === hasta;
          const inicio = compacto ? (nueva ? 22 : 0) : desde + 6 + i * 5;
          const avance = interpolate(frame, [inicio, inicio + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <FilaTablero key={p.codigo} p={p} compacto={compacto} avance={compacto && !nueva ? 1 : avance} resaltada={nueva && compacto} />;
        })}
      </div>
    </Tarjeta>
  );
}

function FilaTablero({ p, compacto, avance, resaltada }: { p: PuestoRanking; compacto: boolean; avance: number; resaltada: boolean }) {
  const t = textosDe(p);
  const tam = compacto ? 30 : 44;
  return (
    <div style={{ opacity: Math.min(avance * 2, 1) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: tam, color: resaltada ? C.navy : C.foreground }}>
          <span style={{ color: p.puesto === 1 ? C.terracottaInk : C.tealInk, marginRight: 14 }}>#{p.puesto}</span>
          {t.corto}
        </span>
        <span style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: tam + 4, color: C.navy, fontVariantNumeric: "tabular-nums" }}>
          {clp(p.porPersona)}
        </span>
      </div>
      <div style={{ marginTop: compacto ? 5 : 12 }}>
        <Barra parte={p.porPersona / MAXIMO} progreso={avance} alto={compacto ? 14 : 28} color={p.puesto === 1 ? C.terracotta : C.teal} />
      </div>
    </div>
  );
}

/** #5 Obras: medidor de lo pagado y, después, ejemplos de obras y la comparación con 2025. */
function DetalleObras({ plan }: { plan: EscenaPlan }) {
  const frame = useCurrentFrame();
  const ojo = plan.marcas.ojo ?? 30;
  const avance = plan.marcas.avance ?? 90;
  const entrada = useEntrada(ojo - 6);
  const pCom = useAvance(ojo, 28);
  const pPag = useAvance(ojo + 10, 28);
  const cambio = interpolate(frame, [avance - 3, avance + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", opacity: entrada, transform: `translateY(${(1 - entrada) * 40}px)` }}>
      <Tarjeta style={{ padding: "30px 38px", height: 300, position: "relative" }}>
        <div style={{ position: "absolute", left: 38, right: 38, top: 30, opacity: 1 - cambio }}>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 34, color: C.mutedFg }}>
            Disponible para obras: <b style={{ color: C.navy }}>{millonesTexto(inversion2026.vigenteK)}</b>
          </div>
          <div style={{ marginTop: 34 }}>
            <Medidor
              comprometido={inversion2026.parteComprometida}
              pagado={inversion2026.partePagada}
              parteAnio={parteDelAnio}
              pComprometido={pCom}
              pPagado={pPag}
              pMarca={pCom}
            />
          </div>
          <div style={{ display: "flex", gap: 26, marginTop: 30, fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32 }}>
            <span style={{ color: C.navy }}>{pct(inversion2026.partePagada)} pagado</span>
            <span style={{ color: C.mutedFg }}>{pct(inversion2026.parteComprometida)} comprometido</span>
            <span style={{ color: C.mutedFg }}>│ mitad del año</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 38, right: 38, top: 30, opacity: cambio }}>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32, color: C.mutedFg }}>Algunas obras en ejecución:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            {estado2025.proyectosEjemplo.map((p) => (
              <Chip key={p} style={{ fontSize: 30, padding: "10px 22px" }}>
                {p}
              </Chip>
            ))}
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 31, color: C.foreground, marginTop: 22 }}>
            Todo {Number(estado2025.fecha.slice(0, 4)) - 1}: {millonesTexto(estado2025.inversion.actualizadoK)} disponibles,{" "}
            <b style={{ color: C.navy }}>{pct(inversion2025PartePagada)} pagado</b>.
          </div>
        </div>
      </Tarjeta>
    </div>
  );
}
