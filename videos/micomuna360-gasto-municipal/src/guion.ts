/**
 * Guion del video. Cada escena tiene su locución en dos formas paralelas:
 * - `voz`: lo que lee la voz sintética (números en palabras),
 * - `texto`: lo que muestran los subtítulos (números con cifras).
 *
 * Marcas dentro de las frases:
 * - `|` corta un subtítulo (también separa las dos formas de manera pareja).
 * - `{nombre}` al inicio de un subtítulo marca el momento en que la escena
 *   anima algo («{gap}A junio había…»).
 */
import { comuna, ejecucion2026, estado2025, sinim2025 } from "./datos.ts";
import {
  anioCorte,
  comprometidoSinPagarK,
  inversion2026,
  mesCorte,
  parteFondoComun,
  puenteCalza,
  top5,
  totalPorPersona,
  type PuestoRanking,
} from "./calculos.ts";
import { enPalabras, miles } from "./palabras.ts";

interface Doble {
  voz: string;
  texto: string;
}
type Pieza = string | Doble;

function f(partes: TemplateStringsArray, ...valores: Pieza[]): Doble {
  let voz = "";
  let texto = "";
  partes.forEach((parte, i) => {
    voz += parte;
    texto += parte;
    const v = valores[i];
    if (v === undefined) return;
    voz += typeof v === "string" ? v : v.voz;
    texto += typeof v === "string" ? v : v.texto;
  });
  return { voz, texto };
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mes = MESES[mesCorte - 1];

function mayuscula(d: Doble): Doble {
  const m = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return { voz: m(d.voz), texto: m(d.texto) };
}

/** Pesos aproximados para decir en voz alta: 48.226 → «cuarenta y ocho mil pesos» / «$48 mil». */
function pesos(n: number, conPalabraPesos = true): Doble {
  let redondo: number;
  if (n >= 10_000) redondo = Math.round(n / 1000) * 1000;
  else {
    const aMil = Math.round(n / 1000) * 1000;
    redondo = Math.abs(n - aMil) <= 150 ? aMil : Math.round(n / 100) * 100;
  }
  const texto = redondo % 1000 === 0 ? `$${miles(redondo / 1000)} mil` : `$${miles(redondo)}`;
  return { voz: `${enPalabras(redondo)}${conPalabraPesos ? " pesos" : ""}`, texto };
}

/** Miles de pesos → «más de veinticinco mil millones» / «casi nueve mil millones». */
function milMillones(milesDePesos: number, conPalabraPesos = false): Doble {
  const v = (milesDePesos * 1000) / 1e9;
  const piso = Math.floor(v);
  const [calificador, n] = v - piso >= 0.8 ? ["casi", Math.ceil(v)] : ["más de", piso];
  return {
    voz: `${calificador} ${enPalabras(n)} mil millones${conPalabraPesos ? " de pesos" : ""}`,
    texto: `${calificador} $${n} mil millones`,
  };
}

/** Miles de pesos → «unos dos mil quinientos millones» (redondeo a $100 millones). */
function cientosDeMillones(milesDePesos: number): Doble {
  const n = Math.round(milesDePesos / 1000 / 100) * 100;
  return { voz: `unos ${enPalabras(n)} millones`, texto: `unos $${miles(n)} millones` };
}

function porcentaje(parte: number): Doble {
  const n = Math.round(parte * 100);
  return { voz: `${enPalabras(n)} por ciento`, texto: `${n} %` };
}

/** 0,746 → «casi tres de cada cuatro». */
function fraccion(x: number): Doble {
  const candidatas: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [9, 10]];
  const [a, b] = candidatas.reduce((mejor, c) =>
    Math.abs(x - c[0] / c[1]) < Math.abs(x - mejor[0] / mejor[1]) ? c : mejor
  );
  const valor = a / b;
  const calif = Math.abs(x - valor) < 0.001 ? "" : x < valor ? "casi " : "más de ";
  return { voz: `${calif}${enPalabras(a)} de cada ${enPalabras(b)}`, texto: `${calif}${a} de cada ${b}` };
}

const anio = (n: number): Doble => ({ voz: enPalabras(n), texto: String(n) });
const ORDINAL = ["", "uno", "dos", "tres", "cuatro", "cinco"];

/* ── Textos de cada tipo de gasto ────────────────────────────────────── */

export type IconoGasto = "obras" | "recibo" | "ayudas" | "personas" | "servicios" | "general";

interface TextosGasto {
  icono: IconoGasto;
  titulo: string;
  /** Nombre corto para el tablero del Top 5. */
  corto: string;
  detalle?: string;
  largo: (p: PuestoRanking, prefijo: string) => Doble;
  breve: (p: PuestoRanking, prefijo: string) => Doble;
}

const TEXTOS: Record<string, TextosGasto> = {
  "215-22": {
    icono: "servicios",
    titulo: "Aseo, luz, agua y mantención",
    corto: "Aseo, luz y mantención",
    detalle: "Servicios y compras de la comuna",
    largo: (p, pre) =>
      f`${pre}: servicios y compras. |Aseo, luz, agua y mantención de la comuna. |Unos ${pesos(p.porPersona)} por persona. |{calle}Es lo que ves todos los días en tu calle.`,
    breve: (p, pre) =>
      f`${pre}: aseo, luz, agua y mantención, |unos ${pesos(p.porPersona)}. |{calle}Lo que ves todos los días en tu calle.`,
  },
  "215-21": {
    icono: "personas",
    titulo: "Sueldos del personal municipal",
    corto: "Sueldos del personal",
    detalle: "Quienes atienden, fiscalizan y mantienen la comuna",
    largo: (p, pre) =>
      f`${pre}: los sueldos |de quienes trabajan en el municipio, |atendiendo, fiscalizando y manteniendo la comuna. |Unos ${pesos(p.porPersona)} por persona.`,
    breve: (p, pre) => f`${pre}: sueldos del personal municipal, |unos ${pesos(p.porPersona)}.`,
  },
  "215-24": {
    icono: "ayudas",
    titulo: "Aportes y ayudas sociales",
    corto: "Aportes y ayudas sociales",
    detalle: "Incluye el aporte del municipio a la salud municipal",
    largo: (p, pre) =>
      f`${pre}: aportes a organizaciones, ayudas sociales |y lo que el municipio pone para la salud municipal. |Unos ${pesos(p.porPersona)} por persona.`,
    breve: (p, pre) => f`${pre}: aportes y ayudas sociales, |unos ${pesos(p.porPersona)}.`,
  },
  "215-34": {
    icono: "recibo",
    titulo: "Cuentas de años anteriores",
    corto: "Cuentas de años anteriores",
    detalle: `Compromisos de ${anioCorte - 1} que se pagan en ${anioCorte}`,
    largo: (p, pre) =>
      f`${pre}: cuentas que quedaron |pendientes del año anterior. |Unos ${pesos(p.porPersona)} por persona. |{vuelta}Ya volvemos a esto.`,
    breve: (p, pre) => f`${pre}: cuentas pendientes del año anterior, |unos ${pesos(p.porPersona)}.`,
  },
  "215-31": {
    icono: "obras",
    titulo: "Obras y proyectos",
    corto: "Obras y proyectos",
    largo: (p, pre) =>
      f`${pre}: obras y proyectos, |unos ${pesos(p.porPersona)} por persona. |{ojo}Ojo: hay ${milMillones(inversion2026.vigenteK)} disponibles, |pero a ${mes} se había pagado solo el ${porcentaje(inversion2026.partePagada)}. |{avance}Las obras se pagan a medida que avanzan.`,
    breve: (p, pre) =>
      f`${pre}: obras y proyectos, |unos ${pesos(p.porPersona)}. |{ojo}Ojo: a ${mes} se había pagado solo el ${porcentaje(inversion2026.partePagada)}; |{avance}las obras se pagan según avanzan.`,
  },
};

export function textosDe(p: Subtitulo2): TextosGasto {
  return (
    TEXTOS[p.codigo] ?? {
      icono: "general",
      titulo: p.etiqueta,
      corto: p.etiqueta,
      largo: (x, pre) => f`${pre}: ${p.etiqueta.toLowerCase()}. |Unos ${pesos(x.porPersona)} por persona.`,
      breve: (x, pre) => f`${pre}: ${p.etiqueta.toLowerCase()}, |unos ${pesos(x.porPersona)}.`,
    }
  );
}
type Subtitulo2 = { codigo: string; etiqueta: string };

/* ── Escenas ─────────────────────────────────────────────────────────── */

export type Version = "completo" | "corto";
export type TipoEscena = "gancho" | "ejemplo" | "puesto" | "ojo" | "origen" | "pregunta" | "cierre";

export interface Subtitulo {
  voz: string;
  texto: string;
  marcas: string[];
}

export interface Escena {
  id: string;
  tipo: TipoEscena;
  /** Puesto en el ranking (solo escenas «puesto»). */
  puesto?: number;
  subtitulos: Subtitulo[];
  /** Texto exacto que se manda a la voz sintética (vacío = sin locución). */
  locucion: string;
  /** Segundos extra al final, para que el gráfico respire. */
  cola: number;
}

/** Separa los marcadores «{nombre}» del inicio de un subtítulo. */
function quitarMarcas(s: string): { limpio: string; marcas: string[] } {
  const m = s.trim().match(/^((?:\{\w+\})*)(.*)$/s)!;
  const marcas = [...m[1].matchAll(/\{(\w+)\}/g)].map((x) => x[1]);
  return { limpio: m[2].trim(), marcas };
}

function partir(d: Doble): Subtitulo[] {
  const voces = d.voz.split("|");
  const textos = d.texto.split("|");
  if (voces.length !== textos.length) throw new Error(`Guion: cortes disparejos en «${d.texto}»`);
  return voces.map((v, i) => {
    const voz = quitarMarcas(v);
    return { voz: voz.limpio, texto: quitarMarcas(textos[i]).limpio, marcas: voz.marcas };
  });
}

function escena(id: string, tipo: TipoEscena, d: Doble | null, cola = 0.5, puesto?: number): Escena {
  const subtitulos = d ? partir(d) : [];
  const locucion = subtitulos.map((s) => s.voz).join(" ").replace(/\s+/g, " ").trim();
  return { id, tipo, puesto, subtitulos, locucion, cola };
}

const gancho = (version: Version) =>
  version === "completo"
    ? escena("gancho", "gancho", f`¿En qué se gasta la plata de ${comuna.nombre}? |{top}Te lo muestro en un top cinco.`, 0.6)
    : escena("gancho", "gancho", f`¿En qué se gasta la plata de ${comuna.nombre}? |{top}Top cinco.`, 0.5);

/* En la versión corta la dirección del sitio queda solo en pantalla. */
const pregunta = (version: Version) =>
  version === "completo"
    ? escena(
        "pregunta",
        "pregunta",
        f`¿Lo notas en tu barrio? |Cuéntanos en los comentarios. |{sitio}Y revisa todos los datos, con su fuente, |en ${{ voz: "Mi Comuna trescientos sesenta", texto: "MiComuna360" }}.`,
        1.0
      )
    : escena("pregunta", "pregunta", f`¿Lo notas en tu barrio? |{sitio}Cuéntanos en los comentarios.`, 1.6);

const cierre = (version: Version) => escena("cierre", "cierre", null, version === "completo" ? 6 : 4.5);

function puestos(version: Version): Escena[] {
  return [...top5].reverse().map((p) => {
    const t = textosDe(p);
    const prefijo =
      p.puesto === 1 ? "Y el número uno" : version === "completo" ? `Número ${ORDINAL[p.puesto]}` : mayuscula({ voz: ORDINAL[p.puesto], texto: "" }).voz;
    const d = version === "completo" ? t.largo(p, prefijo) : t.breve(p, prefijo);
    const cola = p.puesto === 1 ? (version === "completo" ? 3.0 : 2.4) : p.codigo === "215-31" ? 0.9 : 0.6;
    return escena(`puesto-${p.puesto}`, "puesto", d, cola, p.puesto);
  });
}

export function escenasDe(version: Version): Escena[] {
  if (version === "corto") {
    return [
      gancho("corto"),
      escena(
        "ejemplo",
        "ejemplo",
        f`Entre enero y ${mes}, el municipio pagó |{div}unos ${pesos(totalPorPersona)} por cada persona de la comuna. |{pregunta}¿En qué se fueron?`,
        0.6
      ),
      ...puestos("corto"),
      pregunta("corto"),
      cierre("corto"),
    ];
  }

  const puente = puenteCalza
    ? f`{justo}justo lo que este año se reservó para esas cuentas.`
    : f`{justo}y este año se reservaron ${cientosDeMillones(estado2025.porPagarK)} para esas cuentas.`;

  return [
    gancho("completo"),
    escena(
      "ejemplo",
      "ejemplo",
      f`Entre enero y ${mes}, el municipio pagó ${milMillones(ejecucion2026.total.pagadoK, true)}. |{div}Repartido entre todas las personas que viven en la comuna, |son unos ${pesos(totalPorPersona)} por persona. |{pregunta}¿En qué se fueron?`,
      0.6
    ),
    ...puestos("completo"),
    escena(
      "ojo",
      "ojo",
      f`Ahora, ojo: pagado no es lo mismo que comprometido. |{gap}A ${mes} había ${milMillones(comprometidoSinPagarK)} ya comprometidos, |pero todavía sin pagar. |{puente}Y lo que no alcanza a pagarse en el año |pasa al siguiente: |{cierre}${anio(anioCorte - 1)} cerró con ${cientosDeMillones(estado2025.porPagarK)} por pagar, |${puente}`,
      1.2
    ),
    escena(
      "origen",
      "origen",
      f`¿Y de dónde sale la plata? |{fcm}${mayuscula(fraccion(parteFondoComun))} pesos vienen del Fondo Común Municipal, |un fondo solidario entre todas las comunas del país. |{propios}Por su cuenta, ${comuna.nombre} recauda |unos ${pesos(sinim2025.ingresosPropiosPorHabitante)} por habitante; |{promedio}el promedio de la región, unos ${pesos(sinim2025.promedioRegionMetropolitana, false)}.`,
      1.2
    ),
    pregunta("completo"),
    cierre("completo"),
  ];
}
