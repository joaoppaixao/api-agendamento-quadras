function horaParaMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  if (
    Number.isNaN(h) ||
    Number.isNaN(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    return null;
  }
  return h * 60 + m;
}

function intervalosSobrepostos(inicioA, fimA, inicioB, fimB) {
  const a0 = horaParaMinutos(inicioA);
  const a1 = horaParaMinutos(fimA);
  const b0 = horaParaMinutos(inicioB);
  const b1 = horaParaMinutos(fimB);
  if (a0 === null || a1 === null || b0 === null || b1 === null) return false;
  return a0 < b1 && b0 < a1;
}

module.exports = { horaParaMinutos, intervalosSobrepostos };
