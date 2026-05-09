const usuarioService = require('../services/usuarioService');

async function criar(req, res, next) {
  try {
    const row = usuarioService.cadastrar(req.body);
    res.status(201).json(usuarioService.semSenha(row));
  } catch (e) {
    next(e);
  }
}

async function listar(req, res, next) {
  try {
    res.status(200).json(usuarioService.listar());
  } catch (e) {
    next(e);
  }
}

async function buscar(req, res, next) {
  try {
    res.status(200).json(usuarioService.buscarPorId(req.params.id));
  } catch (e) {
    next(e);
  }
}

async function atualizar(req, res, next) {
  try {
    const row = usuarioService.atualizar(req.params.id, req.body);
    res.status(200).json(row);
  } catch (e) {
    next(e);
  }
}

async function deletar(req, res, next) {
  try {
    usuarioService.remover(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { criar, listar, buscar, atualizar, deletar };
