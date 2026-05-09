const agendamentos = [];
let nextId = 1;

function criar(dados) {
  const agora = new Date().toISOString();
  const row = {
    id: nextId++,
    usuario_id: dados.usuario_id,
    nome_quadra: dados.nome_quadra,
    data_agendamento: dados.data_agendamento,
    hora_inicio: dados.hora_inicio,
    hora_fim: dados.hora_fim,
    status: 'ACTIVE',
    created_at: agora,
  };
  agendamentos.push(row);
  return row;
}

function buscarPorId(id) {
  return agendamentos.find((a) => a.id === id) ?? null;
}

function listarPorUsuario(usuarioId) {
  return agendamentos.filter((a) => a.usuario_id === usuarioId);
}

function listarAtivosPorQuadraEData(nomeQuadra, dataAgendamento) {
  return agendamentos.filter(
    (a) =>
      a.status === 'ACTIVE' &&
      a.nome_quadra === nomeQuadra &&
      a.data_agendamento === dataAgendamento
  );
}

function atualizar(row) {
  const idx = agendamentos.findIndex((a) => a.id === row.id);
  if (idx === -1) return null;
  agendamentos[idx] = row;
  return row;
}

function deletar(id) {
  const idx = agendamentos.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  agendamentos.splice(idx, 1);
  return true;
}

module.exports = {
  criar,
  buscarPorId,
  listarPorUsuario,
  listarAtivosPorQuadraEData,
  atualizar,
  deletar,
};
