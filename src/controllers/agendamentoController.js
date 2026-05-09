const agendamentoService = require('../services/agendamentoService');

function serializar(row) {
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    nome_quadra: row.nome_quadra,
    data_agendamento: row.data_agendamento,
    hora_inicio: row.hora_inicio,
    hora_fim: row.hora_fim,
    status: row.status,
    created_at: row.created_at,
  };
}

async function criar(req, res, next) {
  try {
    const row = agendamentoService.criar(req.usuarioId, req.body);
    res.status(201).json(serializar(row));
  } catch (e) {
    next(e);
  }
}

async function listar(req, res, next) {
  try {
    const rows = agendamentoService.listarDoUsuario(req.usuarioId);
    res.status(200).json(rows.map(serializar));
  } catch (e) {
    next(e);
  }
}

async function buscar(req, res, next) {
  try {
    const row = agendamentoService.buscarPorId(req.usuarioId, req.params.id);
    res.status(200).json(serializar(row));
  } catch (e) {
    next(e);
  }
}

async function atualizar(req, res, next) {
  try {
    const row = agendamentoService.atualizar(
      req.usuarioId,
      req.params.id,
      req.body
    );
    res.status(200).json(serializar(row));
  } catch (e) {
    next(e);
  }
}

async function deletar(req, res, next) {
  try {
    agendamentoService.remover(req.usuarioId, req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { criar, listar, buscar, atualizar, deletar };
