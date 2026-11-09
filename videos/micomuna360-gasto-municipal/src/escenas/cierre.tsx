import { ArrowRightIcon, CircleCheckIcon, InfoIcon, MessageCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { Anillo, Antetitulo, Aparecer, Barra, Cabecera, Chip, Fondo, Isotipo, Medidor, Tarjeta, useAvance, useEntrada } from "../componentes/base.tsx";
import {
  anioCorte,
  comprometidoSinPagarK,
  deudaAnteriorPagadaK,
  deudaReservada2026K,
  pagadoDeLoComprometidoK,
  parteFondoComun,
  puenteCalza,
} from "../calculos.ts";
import { comuna, ejecucion2026, estado2025, fuentes, sinim2025 } from "../datos.ts";
import { clp, fechaLarga, miles, millonesTexto } from "../palabras.ts";

/** Miles de pesos → «$2.503» (el «millones» va en el texto de abajo). */
const millones = (milesDePesos: number) => `$${miles(milesDePesos / 1000)}`;

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mesCorte = MESES[Number(ejecucion2026.corte.slice(5, 7)) - 1];
import { alfa, C, FUENTE, MARGEN } from "../tema.ts";
import type { EscenaPlan } from "../tiempos.ts";

const { vigenteK, comprometidoK } = ejecucion2026.total;

/** 8 · Ojo: pagado no es lo mismo que comprometido, y el puente 2025 → 2026. */
export function Ojo({ plan }: { plan: EscenaPlan }) {
  const gap = plan.marcas.gap ?? 90;
  const cierre = plan.marcas.cierre ?? plan.marcas.puente ?? 200;
  const justo = plan.marcas.justo ?? cierre + 60;
  const pCom = useAvance(10, 30);
  const pPag = useAvance(24, 30);
  const brecha = useEntrada(gap, 160);
  const puente = useEntrada(cierre - 4);
  const flecha = useAvance(cierre + 10, 18);
  const sello = useEntrada(justo, 200);
  const com = comprometidoK / vigenteK;
  const pag = pagadoDeLoComprometidoK / vigenteK;

  return (
    <AbsoluteFill>
      <Fondo />
      <Cabecera />
      <Aparecer desde={0} style={{ position: "absolute", top: 250, left: MARGEN }}>
        <Antetitulo>Ojo al leer las cifras</Antetitulo>
      </Aparecer>
      <Aparecer desde={3} style={{ position: "absolute", top: 310, left: MARGEN, right: MARGEN }}>
        <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 72, lineHeight: 1.04, letterSpacing: -1.5, color: C.navy }}>
          Pagado no es lo mismo que comprometido
        </div>
      </Aparecer>
      <Aparecer desde={6} style={{ position: "absolute", top: 485, left: MARGEN, right: MARGEN }}>
        <Tarjeta style={{ padding: "28px 36px" }}>
          <div style={{ position: "relative" }}>
            <Medidor comprometido={com} pagado={pag} pComprometido={pCom} pPagado={pPag} alto={58} />
            {/* La brecha: comprometido y todavía sin pagar. */}
            <div
              style={{
                position: "absolute",
                top: -10,
                height: 78,
                left: `${pag * 100}%`,
                width: `${(com - pag) * 100}%`,
                border: `5px solid ${C.amber}`,
                borderRadius: 14,
                background: alfa(C.amber, 0.25),
                opacity: brecha,
                transform: `scaleY(${0.6 + 0.4 * brecha})`,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
            <Leyenda color={alfa(C.teal, 0.14)} texto="Disponible en el año" valor={millonesTexto(vigenteK)} />
            <Leyenda color={alfa(C.teal, 0.42)} texto="Comprometido" valor={millonesTexto(comprometidoK)} />
            <Leyenda color={C.teal} texto="Pagado de lo comprometido" valor={millonesTexto(pagadoDeLoComprometidoK)} />
            <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, color: C.mutedFg, paddingLeft: 46 }}>
              Además se pagaron {millonesTexto(deudaAnteriorPagadaK)} de cuentas de años anteriores.
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderRadius: 18,
              background: alfa(C.amber, 0.16),
              border: `3px solid ${alfa(C.amber, 0.55)}`,
              opacity: brecha,
              fontFamily: FUENTE.texto,
              fontWeight: 800,
              fontSize: 33,
              color: C.foreground,
            }}
          >
            <InfoIcon size={36} color={C.amberInk} />
            <span>
              <b style={{ color: C.amberInk }}>{millonesTexto(comprometidoSinPagarK)}</b> comprometidos, aún sin pagar
            </span>
          </div>
        </Tarjeta>
      </Aparecer>
      <div style={{ position: "absolute", top: 955, left: MARGEN, right: MARGEN, opacity: puente, transform: `translateY(${(1 - puente) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <CajaPuente titulo={`${anioCorte - 1} cerró con`} valor={millones(estado2025.porPagarK)} pie="millones por pagar" />
          <ArrowRightIcon size={58} color={C.tealInk} strokeWidth={2.6} style={{ opacity: flecha, transform: `translateX(${(1 - flecha) * -20}px)` }} />
          <CajaPuente titulo={`${anioCorte} reservó`} valor={millones(deudaReservada2026K)} pie="millones para pagarlas" />
        </div>
        {puenteCalza && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center", opacity: sello, transform: `scale(${0.7 + 0.3 * sello})` }}>
            <Chip style={{ fontSize: 32 }}>
              <CircleCheckIcon size={34} /> Coinciden: lo que quedó pendiente se paga este año
            </Chip>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function Leyenda({ color, texto, valor }: { color: string; texto: string; valor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FUENTE.texto, fontSize: 33 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: color, border: `2px solid ${alfa(C.teal, 0.35)}` }} />
      <span style={{ fontWeight: 700, color: C.foreground, flex: 1 }}>{texto}</span>
      <span style={{ fontWeight: 800, color: C.navy, fontVariantNumeric: "tabular-nums" }}>{valor}</span>
    </div>
  );
}

function CajaPuente({ titulo, valor, pie }: { titulo: string; valor: string; pie: string }) {
  return (
    <Tarjeta style={{ flex: 1, padding: "22px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32, color: C.mutedFg }}>{titulo}</div>
      <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 76, color: C.navy, letterSpacing: -2, lineHeight: 1.1 }}>{valor}</div>
      <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32, color: C.tealInk }}>{pie}</div>
    </Tarjeta>
  );
}

/** 9 · ¿De dónde sale la plata? Fondo Común Municipal e ingresos propios. */
export function Origen({ plan }: { plan: EscenaPlan }) {
  const fcm = plan.marcas.fcm ?? 30;
  const propios = plan.marcas.propios ?? 140;
  const promedio = plan.marcas.promedio ?? propios + 60;
  const anillo = useAvance(fcm, 40);
  const tarjeta = useEntrada(propios - 4);
  const barraLP = useAvance(propios + 6, 26);
  const barraRM = useAvance(promedio, 30);
  const maximo = sinim2025.promedioRegionMetropolitana;
  const partes = Math.round(parteFondoComun * 4);
  return (
    <AbsoluteFill>
      <Fondo />
      <Cabecera />
      <Aparecer desde={0} style={{ position: "absolute", top: 250, left: MARGEN }}>
        <Antetitulo>¿De dónde sale la plata?</Antetitulo>
      </Aparecer>
      <Aparecer desde={fcm - 8} style={{ position: "absolute", top: 330, left: MARGEN, right: MARGEN, display: "flex", alignItems: "center", gap: 40 }}>
        <Anillo parte={parteFondoComun} progreso={anillo} size={330}>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 74, color: C.navy, lineHeight: 1, letterSpacing: -2 }}>
            {partes} de 4
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 36, color: C.mutedFg }}>pesos</div>
        </Anillo>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 36, color: C.foreground, lineHeight: 1.3 }}>
            Del presupuesto municipal aprobado para {anioCorte}, casi {partes} de cada 4 pesos vienen del
          </div>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 58, color: C.tealInk, lineHeight: 1.05, marginTop: 8, letterSpacing: -1 }}>
            Fondo Común Municipal
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 30, color: C.mutedFg, marginTop: 10 }}>
            Un fondo solidario entre todas las comunas del país.
          </div>
        </div>
      </Aparecer>
      <div style={{ position: "absolute", top: 715, left: MARGEN, right: MARGEN, opacity: tarjeta, transform: `translateY(${(1 - tarjeta) * 40}px)` }}>
        <Tarjeta>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 52, color: C.navy, letterSpacing: -1 }}>
            Ingresos propios por habitante
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 29, color: C.mutedFg, marginTop: 4 }}>
            Contribuciones, patentes, permisos y aseo · {sinim2025.anio}
          </div>
          <FilaComparacion titulo={comuna.nombre} valor={sinim2025.ingresosPropiosPorHabitante} parte={sinim2025.ingresosPropiosPorHabitante / maximo} progreso={barraLP} color={C.navy} />
          <FilaComparacion
            titulo={`Promedio Región Metropolitana (${sinim2025.comunasEnPromedio} comunas)`}
            valor={sinim2025.promedioRegionMetropolitana}
            parte={1}
            progreso={barraRM}
            color={C.sky}
          />
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 25, color: C.mutedFg, marginTop: 18 }}>
            Contexto, no nota: depende del comercio y las propiedades de cada comuna. Fuente: SINIM.
          </div>
        </Tarjeta>
      </div>
    </AbsoluteFill>
  );
}

function FilaComparacion({ titulo, valor, parte, progreso, color }: { titulo: string; valor: number; parte: number; progreso: number; color: string }) {
  return (
    <div style={{ marginTop: 24, opacity: Math.min(progreso * 3, 1) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32, color: C.foreground }}>{titulo}</span>
        <span style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 50, color: C.navy, fontVariantNumeric: "tabular-nums" }}>
          {clp(valor * progreso)}
        </span>
      </div>
      <div style={{ marginTop: 10 }}>
        <Barra parte={parte} progreso={progreso} alto={30} color={color} />
      </div>
    </div>
  );
}

/** 10 · La pregunta al vecino y la invitación al sitio. */
export function Pregunta({ plan }: { plan: EscenaPlan }) {
  const sitio = plan.marcas.sitio ?? 80;
  const chip = useEntrada(14, 170);
  return (
    <AbsoluteFill>
      <Fondo oscuro />
      <Cabecera oscuro />
      <Aparecer desde={0} style={{ position: "absolute", top: 360, left: MARGEN, right: MARGEN, textAlign: "center" }}>
        <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 132, lineHeight: 1.0, letterSpacing: -3, color: C.ivory }}>
          ¿Lo notas en <span style={{ color: C.darkTealInk }}>tu barrio?</span>
        </div>
      </Aparecer>
      <div style={{ position: "absolute", top: 690, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: chip, transform: `scale(${0.7 + 0.3 * chip})` }}>
        <Chip fondo={C.amber} color={C.navy} style={{ fontSize: 46, padding: "18px 38px" }}>
          <MessageCircleIcon size={46} strokeWidth={2.4} /> Cuéntanos en los comentarios
        </Chip>
      </div>
      <Aparecer desde={sitio} style={{ position: "absolute", top: 880, left: MARGEN, right: MARGEN }}>
        <div style={{ background: C.darkCard, borderRadius: 36, padding: "38px 40px", border: `3px solid ${alfa(C.ivory, 0.12)}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: C.ivory, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Isotipo size={80} />
            </div>
            <div>
              <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 60, color: C.ivory, letterSpacing: -1 }}>MiComuna360</div>
              <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 34, color: C.darkMutedFg }}>Todos los datos, con su fuente</div>
            </div>
          </div>
          <div style={{ marginTop: 26, fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 38, color: C.darkTealInk }}>
            {comuna.sitio.replace(/\/transparencia$/, "")}
          </div>
        </div>
      </Aparecer>
    </AbsoluteFill>
  );
}

/** 11 · Fuentes de los datos y fechas de actualización. */
export function Cierre({ fechaGeneracion }: { fechaGeneracion: string }) {
  return (
    <AbsoluteFill>
      <Fondo />
      <Cabecera />
      <Aparecer desde={0} style={{ position: "absolute", top: 250, left: MARGEN }}>
        <Antetitulo>Fuentes de este video</Antetitulo>
      </Aparecer>
      <div style={{ position: "absolute", top: 330, left: MARGEN, right: MARGEN, display: "flex", flexDirection: "column", gap: 22 }}>
        {fuentes.map((f, i) => (
          <Aparecer key={f.id} desde={4 + i * 5}>
            <Fila>
              <CircleCheckIcon size={40} color={C.tealInk} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 4 }} />
              <div>
                <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 34, color: C.navy }}>{f.institucion}</div>
                <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 31, color: C.foreground }}>{f.documento}</div>
                <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 27, color: C.mutedFg }}>{f.detalle}</div>
              </div>
            </Fila>
          </Aparecer>
        ))}
      </div>
      <Aparecer desde={20} style={{ position: "absolute", top: 880, left: MARGEN, right: MARGEN }}>
        <div style={{ background: C.accent, borderRadius: 30, padding: "30px 36px" }}>
          <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: 50, color: C.navy, letterSpacing: -1 }}>
            Datos al {fechaLarga(ejecucion2026.corte)}
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 30, color: C.foreground, marginTop: 8 }}>
            Verificados por MiComuna360 el {fechaLarga(ejecucion2026.verificado)}
          </div>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 700, fontSize: 30, color: C.foreground }}>
            Video actualizado el {fechaLarga(fechaGeneracion)}
          </div>
        </div>
      </Aparecer>
      <Aparecer desde={26} style={{ position: "absolute", top: 1150, left: MARGEN, right: MARGEN }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 600, fontSize: 26, color: C.mutedFg, lineHeight: 1.35 }}>
          Por persona: pagado entre enero y {mesCorte} dividido por la población proyectada por el INE. MiComuna360 es independiente
          del municipio y no evalúa su gestión.
        </div>
      </Aparecer>
    </AbsoluteFill>
  );
}

function Fila({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>{children}</div>;
}

