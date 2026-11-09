import { leerCsv } from './csv.mjs';
import { cabeceraMetricas } from './campana.mjs';

const conteos = ['visualizaciones', 'visitas', 'consultas', 'ventas'];
const cantidades = [...conteos, 'ingresos', 'coste_marketing'];
const dividir = (n, d) => d > 0 ? n / d : null;

export function resumirMetricas(csv) {
  const filas = leerCsv(csv);
  if (!filas.length) throw new Error('No hay observaciones. Completa metricas.csv con datos reales.');
  const ids = new Set(), monedas = new Set(), grupos = new Map();
  for (const [i, fila] of filas.entries()) {
    for (const campo of cabeceraMetricas) {
      if (!(campo in fila)) throw new Error(`Falta la columna ${campo}.`);
    }
    if (!fila.pieza_id.trim()) throw new Error(`Fila ${i + 2}: falta pieza_id.`);
    if (ids.has(fila.pieza_id)) throw new Error(`Pieza repetida: ${fila.pieza_id}. Usa una sola fila acumulada por publicación.`);
    ids.add(fila.pieza_id);
    if (!['instagram', 'tiktok', 'youtube'].includes(fila.red) || !['a', 'b'].includes(fila.variante)) throw new Error(`Fila ${i + 2}: red o variante inválida.`);
    if (!/^[A-Z]{3}$/.test(fila.moneda)) throw new Error(`Fila ${i + 2}: moneda debe ser un código de tres letras, por ejemplo CLP.`);
    monedas.add(fila.moneda);
    const valores = {};
    for (const campo of cantidades) {
      if (!/^\d+(\.\d+)?$/.test(fila[campo])) throw new Error(`Fila ${i + 2}: ${campo} debe ser un número no negativo con punto decimal.`);
      const valor = Number(fila[campo]);
      if (!Number.isFinite(valor) || (conteos.includes(campo) && !Number.isSafeInteger(valor))) throw new Error(`Fila ${i + 2}: ${campo} fuera de rango.`);
      valores[campo] = valor;
    }
    const clave = `${fila.red}/${fila.variante}`;
    if (!grupos.has(clave)) grupos.set(clave, { red: fila.red, variante: fila.variante, piezas: 0, ...Object.fromEntries(cantidades.map((k) => [k, 0])) });
    const grupo = grupos.get(clave);
    grupo.piezas++;
    for (const k of cantidades) grupo[k] += valores[k];
  }
  if (monedas.size !== 1) throw new Error('No se suman monedas diferentes. Separa los archivos o conviértelas antes con una tasa documentada.');
  return { moneda: [...monedas][0], grupos: [...grupos.values()].map((g) => ({
    ...g,
    tasa_visita: dividir(g.visitas, g.visualizaciones),
    tasa_consulta: dividir(g.consultas, g.visitas),
    tasa_venta: dividir(g.ventas, g.consultas),
    coste_consulta: dividir(g.coste_marketing, g.consultas),
    ingresos_por_coste: dividir(g.ingresos, g.coste_marketing),
  })) };
}

export function informeMetricas(resumen) {
  const numero = (n) => n === null ? '—' : new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(n);
  const porcentaje = (n) => n === null ? '—' : `${numero(n * 100)} %`;
  return `# Seguimiento de contenido\n\nMoneda: ${resumen.moneda}. Comparar piezas con el mismo período de observación y condiciones semejantes.\n\n| Red / gancho | Piezas | Vistas | Visitas | Consultas | Ventas | Ingresos | Coste marketing | Visitas/vistas | Consultas/visitas | Ventas/consultas | Coste/consulta | Ingresos/coste |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${resumen.grupos.map((g) => `| ${g.red} / ${g.variante.toUpperCase()} | ${g.piezas} | ${numero(g.visualizaciones)} | ${numero(g.visitas)} | ${numero(g.consultas)} | ${numero(g.ventas)} | ${numero(g.ingresos)} | ${numero(g.coste_marketing)} | ${porcentaje(g.tasa_visita)} | ${porcentaje(g.tasa_consulta)} | ${porcentaje(g.tasa_venta)} | ${numero(g.coste_consulta)} | ${numero(g.ingresos_por_coste)} |`).join('\n')}\n\n«—» indica un denominador cero; no equivale a un resultado de 0. Las visualizaciones no son personas únicas. Ingresos/coste es una razón descriptiva, no utilidad ni rentabilidad: faltan costos del producto y otros gastos. Las diferencias A/B son orientativas; estos datos no demuestran causalidad ni significación estadística.\n`;
}
