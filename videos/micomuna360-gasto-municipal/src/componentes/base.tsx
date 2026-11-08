import type { CSSProperties, ReactNode } from "react";
import {
  ConstructionIcon,
  DropletsIcon,
  HandHeartIcon,
  LightbulbIcon,
  ReceiptTextIcon,
  Trash2Icon,
  UsersRoundIcon,
  WalletIcon,
} from "lucide-react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import type { IconoGasto } from "../guion.ts";
import { alfa, C, FUENTE, MARGEN } from "../tema.ts";

/* ── Movimiento ──────────────────────────────────────────────────────── */

/** 0 → 1 con un resorte suave a partir del frame `desde`. */
export function useEntrada(desde = 0, rigidez = 120): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - desde, fps, config: { damping: 18, stiffness: rigidez, mass: 0.9 } });
}

/** 0 → 1 lineal con suavizado entre dos frames. */
export function useAvance(desde: number, duracion: number): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [desde, desde + duracion], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
}

/** Entra subiendo y apareciendo. */
export function Aparecer({
  desde = 0,
  distancia = 40,
  children,
  style,
}: {
  desde?: number;
  distancia?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const p = useEntrada(desde);
  return (
    <div style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * distancia}px)`, ...style }}>
      {children}
    </div>
  );
}

/* ── Marca ───────────────────────────────────────────────────────────── */

/** Isotipo plano (public/isotipo.svg del sitio). */
export function Isotipo({ size = 64, centro = C.ivory }: { size?: number; centro?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <path d="M6.4 27.5 A26 26 0 0 1 29.7 6.1" fill="none" stroke={C.teal} strokeWidth="5" strokeLinecap="round" />
      <path d="M34.3 6.1 A26 26 0 0 1 57.6 27.5" fill="none" stroke={C.sky} strokeWidth="5" strokeLinecap="round" />
      <path d="M56.4 40.9 A26 26 0 0 1 7.6 40.9" fill="none" stroke={C.terracotta} strokeWidth="5" strokeLinecap="round" />
      <circle cx="6" cy="32" r="4.5" fill={C.teal} />
      <circle cx="58" cy="32" r="4.5" fill={C.sky} />
      <circle cx="32" cy="58" r="4.5" fill={C.terracotta} />
      <path d="M32 14c-7.7 0-14 6-14 13.4 0 9.8 14 21.6 14 21.6s14-11.8 14-21.6C46 20 39.7 14 32 14z" fill={C.navy} />
      <circle cx="32" cy="27.5" r="5" fill={centro} />
    </svg>
  );
}

/** Arco 360° en miniatura: el antetítulo de las secciones del sitio. */
export function ArcoMarca({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M3.5 14.5 A9 9 0 0 1 10 3.7" fill="none" stroke={C.teal} strokeWidth="3" strokeLinecap="round" />
      <path d="M14 3.7 A9 9 0 0 1 20.5 14.5" fill="none" stroke={C.sky} strokeWidth="3" strokeLinecap="round" />
      <path d="M18.5 18.5 A9 9 0 0 1 5.5 18.5" fill="none" stroke={C.terracotta} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Fondo marfil (o azul del modo oscuro) con los arcos del logo, grandes y tenues. */
export function Fondo({ oscuro = false }: { oscuro?: boolean }) {
  const frame = useCurrentFrame();
  const giro = frame * 0.04;
  const a = oscuro ? 0.16 : 0.1;
  return (
    <AbsoluteFill style={{ background: oscuro ? C.darkBg : C.ivory }}>
      <svg
        viewBox="0 0 64 64"
        width={1500}
        height={1500}
        style={{ position: "absolute", right: -760, top: -520, transform: `rotate(${giro}deg)`, opacity: a * 6 }}
      >
        <path d="M6.4 27.5 A26 26 0 0 1 29.7 6.1" fill="none" stroke={alfa(C.teal, a)} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M34.3 6.1 A26 26 0 0 1 57.6 27.5" fill="none" stroke={alfa(C.sky, a)} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M56.4 40.9 A26 26 0 0 1 7.6 40.9" fill="none" stroke={alfa(C.terracotta, a)} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
}

/** Logo y comuna, arriba a la izquierda (como la cabecera del sitio). */
export function Cabecera({ oscuro = false }: { oscuro?: boolean }) {
  return (
    <div style={{ position: "absolute", top: 104, left: MARGEN, display: "flex", alignItems: "center", gap: 20 }}>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: oscuro ? C.ivory : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Isotipo size={oscuro ? 62 : 72} />
      </div>
      <div style={{ fontFamily: FUENTE.titulo, fontWeight: 700, fontSize: 44, color: oscuro ? C.ivory : C.navy, letterSpacing: -0.5 }}>
        MiComuna360
      </div>
      <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 36, color: oscuro ? C.darkMutedFg : C.mutedFg }}>
        · La Pintana
      </div>
    </div>
  );
}

export function Antetitulo({ children, oscuro = false, style }: { children: ReactNode; oscuro?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: FUENTE.texto,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: oscuro ? C.darkTealInk : C.tealInk,
        ...style,
      }}
    >
      <ArcoMarca />
      {children}
    </div>
  );
}

export function Tarjeta({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: C.card,
        border: `3px solid ${C.border}`,
        borderRadius: 36,
        padding: "40px 44px",
        boxShadow: "0 2px 6px rgba(23,55,94,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Chip({ children, fondo = alfa(C.teal, 0.15), color = C.tealInk, style }: { children: ReactNode; fondo?: string; color?: string; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 26px",
        borderRadius: 999,
        background: fondo,
        color,
        fontFamily: FUENTE.texto,
        fontWeight: 800,
        fontSize: 32,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── Datos ───────────────────────────────────────────────────────────── */

/** Número que sube hasta su valor; `formato` decide cómo se escribe. */
export function Contador({
  valor,
  desde = 0,
  duracion = 30,
  formato,
  style,
}: {
  valor: number;
  desde?: number;
  duracion?: number;
  formato: (n: number) => string;
  style?: CSSProperties;
}) {
  const p = useAvance(desde, duracion);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{formato(valor * p)}</span>;
}

/** Barra horizontal del sitio (BarRanking): riel claro y relleno de un solo tono. */
export function Barra({
  parte,
  progreso,
  color = C.teal,
  alto = 26,
  riel = C.muted,
}: {
  parte: number;
  progreso: number;
  color?: string;
  alto?: number;
  riel?: string;
}) {
  const ancho = Math.max(parte * progreso * 100, progreso > 0 ? 1.5 : 0);
  return (
    <div style={{ height: alto, width: "100%", background: riel, borderRadius: `0 ${alto / 2}px ${alto / 2}px 0` }}>
      <div style={{ height: alto, width: `${ancho}%`, background: color, borderRadius: `0 ${alto / 2}px ${alto / 2}px 0` }} />
    </div>
  );
}

/**
 * Medidor de ejecución del sitio (ExecutionMeter): riel = presupuesto
 * vigente, relleno medio = comprometido, relleno fuerte = pagado, y una
 * raya con la parte del año transcurrida.
 */
export function Medidor({
  comprometido,
  pagado,
  parteAnio,
  pComprometido,
  pPagado,
  pMarca = 1,
  alto = 44,
}: {
  comprometido: number;
  pagado: number;
  parteAnio?: number;
  pComprometido: number;
  pPagado: number;
  pMarca?: number;
  alto?: number;
}) {
  const r = `0 ${alto / 2}px ${alto / 2}px 0`;
  return (
    <div style={{ position: "relative", height: alto, background: alfa(C.teal, 0.14), borderRadius: r }}>
      <div style={{ position: "absolute", inset: 0, width: `${comprometido * pComprometido * 100}%`, background: alfa(C.teal, 0.42), borderRadius: r }} />
      <div style={{ position: "absolute", inset: 0, width: `${Math.max(pagado * pPagado * 100, pPagado > 0 ? 1 : 0)}%`, background: C.teal, borderRadius: r }} />
      {parteAnio !== undefined && (
        <div
          style={{
            position: "absolute",
            top: -14,
            bottom: -14,
            left: `calc(${parteAnio * 100}% - 3px)`,
            width: 6,
            borderRadius: 3,
            background: alfa(C.foreground, 0.75),
            opacity: pMarca,
          }}
        />
      )}
    </div>
  );
}

/** Anillo 360° (RingMeter del sitio, la firma circular de la marca). */
export function Anillo({ parte, progreso, size = 360, color = C.teal, children }: { parte: number; progreso: number; size?: number; color?: string; children?: ReactNode }) {
  const radio = 42;
  const circ = 2 * Math.PI * radio;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={radio} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={11} />
        <circle
          cx="50"
          cy="50"
          r={radio}
          fill="none"
          stroke={color}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={`${parte * progreso * circ} ${circ}`}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

/** Ficha blanca redondeada con el ícono del tipo de gasto (como SectionIcon). */
export function FichaIcono({ tipo, size = 150 }: { tipo: IconoGasto; size?: number }) {
  const icono = size * 0.5;
  const props = { size: icono, color: C.tealInk, strokeWidth: 1.9 };
  const contenido =
    tipo === "servicios" ? (
      <div style={{ display: "flex", gap: 6 }}>
        <Trash2Icon size={icono * 0.62} color={C.tealInk} strokeWidth={2} />
        <LightbulbIcon size={icono * 0.62} color={C.amberInk} strokeWidth={2} />
        <DropletsIcon size={icono * 0.62} color={C.skyInk} strokeWidth={2} />
      </div>
    ) : tipo === "obras" ? (
      <ConstructionIcon {...props} />
    ) : tipo === "recibo" ? (
      <ReceiptTextIcon {...props} />
    ) : tipo === "ayudas" ? (
      <HandHeartIcon {...props} />
    ) : tipo === "personas" ? (
      <UsersRoundIcon {...props} />
    ) : (
      <WalletIcon {...props} />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: C.card,
        border: `3px solid ${C.border}`,
        boxShadow: "0 6px 18px rgba(23,55,94,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {contenido}
    </div>
  );
}
