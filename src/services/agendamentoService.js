const { AppError } = require('../errors/AppError');
const { horaParaMinutos, intervalosSobrepostos } = require('../utils/tempo');
const agendamentoRepository = require('../repositories/agendamentoRepository');

const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
const horaRegex = /^\d{2}:\d{2}$/;

function validarAgendamentoInput(body) {
  const { nome_quadra, data_agendamento, hora_inicio, hora_fim } = body ?? {};
  if (!nome_quadra || typeof nome_quadra !== 'string' || !nome_quadra.trim()) {
    throw new AppError(400, 'nome_quadra é obrigatório');
  }
  if (!data_agendamento || typeof data_agendamento !== 'string') {
    throw new AppError(400, 'data_agendamento é obrigatória');
  }
  if (!dataRegex.test(data_agendamento)) {
    throw new AppError(400, 'data_agendamento deve ser YYYY-MM-DD');
  }
  if (!hora_inicio || typeof hora_inicio !== 'string' || !horaRegex.test(hora_inicio)) {
    throw new AppError(400, 'hora_inicio deve ser HH:mm');
  }
  if (!hora_fim || typeof hora_fim !== 'string' || !horaRegex.test(hora_fim)) {
    throw new AppError(400, 'hora_fim deve ser HH:mm');
  }
  const mi = horaParaMinutos(hora_inicio);
  const mf = horaParaMinutos(hora_fim);
  if (mi === null || mf === null) {
    throw new AppError(400, 'horário inválido');
  }
  if (mf <= mi) {
    throw new AppError(400, 'hora_fim deve ser maior que hora_inicio');
  }
  return {
    nome_quadra: nome_quadra.trim(),
    data_agendamento,
    hora_inicio,
    hora_fim,
  };
}

function temConflito(nomeQuadra, dataAgendamento, horaInicio, horaFim, excetoId) {
  const existentes = agendamentoRepository.listarAtivosPorQuadraEData(
    nomeQuadra,
    dataAgendamento
  );
  return existentes.some(
    (a) =>
      a.id !== excetoId &&
      intervalosSobrepostos(horaInicio, horaFim, a.hora_inicio, a.hora_fim)
  );
}

function criar(usuarioId, body) {
  const dados = validarAgendamentoInput(body);
  if (
    temConflito(
      dados.nome_quadra,
      dados.data_agendamento,
      dados.hora_inicio,
      dados.hora_fim,
      null
    )
  ) {
    throw new AppError(409, 'conflito de horário para esta quadra na data informada');
  }
  return agendamentoRepository.criar({
    usuario_id: usuarioId,
    ...dados,
  });
}

function listarDoUsuario(usuarioId) {
  return agendamentoRepository.listarPorUsuario(usuarioId);
}

function buscarPorId(usuarioId, agendamentoId) {
  const id = Number(agendamentoId);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const row = agendamentoRepository.buscarPorId(id);
  if (!row) {
    throw new AppError(404, 'agendamento não encontrado');
  }
  if (row.usuario_id !== usuarioId) {
    throw new AppError(403, 'não autorizado a ver este agendamento');
  }
  return row;
}

function cancelar(usuarioId, agendamentoId) {
  const id = Number(agendamentoId);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const row = agendamentoRepository.buscarPorId(id);
  if (!row) {
    throw new AppError(404, 'agendamento não encontrado');
  }
  if (row.usuario_id !== usuarioId) {
    throw new AppError(403, 'não autorizado a alterar este agendamento');
  }
  if (row.status === 'CANCELED') {
    throw new AppError(409, 'agendamento já cancelado');
  }
  row.status = 'CANCELED';
  return agendamentoRepository.atualizar(row);
}

function atualizar(usuarioId, agendamentoId, body) {
  const id = Number(agendamentoId);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const row = agendamentoRepository.buscarPorId(id);
  if (!row) {
    throw new AppError(404, 'agendamento não encontrado');
  }
  if (row.usuario_id !== usuarioId) {
    throw new AppError(403, 'não autorizado a alterar este agendamento');
  }
  if (row.status === 'CANCELED') {
    throw new AppError(409, 'não é possível alterar agendamento cancelado');
  }
  const dados = validarAgendamentoInput(body);
  if (
    temConflito(
      dados.nome_quadra,
      dados.data_agendamento,
      dados.hora_inicio,
      dados.hora_fim,
      id
    )
  ) {
    throw new AppError(409, 'conflito de horário para esta quadra na data informada');
  }
  row.nome_quadra = dados.nome_quadra;
  row.data_agendamento = dados.data_agendamento;
  row.hora_inicio = dados.hora_inicio;
  row.hora_fim = dados.hora_fim;
  return agendamentoRepository.atualizar(row);
}

function deletar(usuarioId, agendamentoId) {
  const id = Number(agendamentoId);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const row = agendamentoRepository.buscarPorId(id);
  if (!row) {
    throw new AppError(404, 'agendamento não encontrado');
  }
  if (row.usuario_id !== usuarioId) {
    throw new AppError(403, 'não autorizado a excluir este agendamento');
  }
  agendamentoRepository.remover(id);
}

module.exports = {
  criar,
  listarDoUsuario,
  buscarPorId,
  cancelar,
  atualizar,
  deletar,
};
