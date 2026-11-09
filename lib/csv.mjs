// CSV RFC 4180: comillas dobles, saltos de línea dentro de celdas y BOM de Excel.
export function escribirCsv(filas) {
  return filas.map((fila) => fila.map((valor) => {
    let texto = String(valor ?? '');
    // Estos CSV se abren en planillas; el texto de un brief nunca debe ser una fórmula.
    if (/^[\s]*[=+@-]/.test(texto)) texto = `'${texto}`;
    return /[",\r\n]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
  }).join(',')).join('\r\n') + '\r\n';
}

export function leerCsv(texto) {
  texto = texto.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const filas = [];
  let fila = [], celda = '', estado = 'inicio';
  const cerrarCelda = () => { fila.push(celda); celda = ''; estado = 'inicio'; };
  const cerrarFila = () => { cerrarCelda(); if (fila.some((v) => v !== '')) filas.push(fila); fila = []; };
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (estado === 'comillas') {
      if (c === '"' && texto[i + 1] === '"') { celda += '"'; i++; }
      else if (c === '"') estado = 'cerrado';
      else celda += c;
    } else if (c === ',') cerrarCelda();
    else if (c === '\n') cerrarFila();
    else if (estado === 'cerrado') throw new Error('CSV: hay texto después de una comilla de cierre.');
    else if (c === '"') {
      if (estado !== 'inicio') throw new Error('CSV: comillas dentro de una celda sin escapar.');
      estado = 'comillas';
    } else { celda += c; estado = 'texto'; }
  }
  if (estado === 'comillas') throw new Error('CSV: faltan comillas de cierre.');
  if (celda !== '' || fila.length || estado === 'cerrado') cerrarFila();
  if (!filas.length) throw new Error('El CSV está vacío.');
  const cabecera = filas.shift();
  if (new Set(cabecera).size !== cabecera.length) throw new Error('CSV: encabezados repetidos.');
  return filas.map((celdas, i) => {
    if (celdas.length !== cabecera.length) throw new Error(`CSV: fila ${i + 2} tiene ${celdas.length} celdas; se esperaban ${cabecera.length}.`);
    return Object.fromEntries(cabecera.map((k, j) => [k, celdas[j]]));
  });
}
