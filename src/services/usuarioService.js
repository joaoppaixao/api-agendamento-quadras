const { AppError } = require('../errors/AppError');
const usuarioRepository = require('../repositories/usuarioRepository');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cadastrar({ nome, email, senha }) {
  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    throw new AppError(400, 'nome é obrigatório');
  }
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new AppError(400, 'email inválido');
  }
  if (!senha || typeof senha !== 'string' || !senha.length) {
    throw new AppError(400, 'senha é obrigatória');
  }
  if (usuarioRepository.buscarPorEmail(email)) {
    throw new AppError(409, 'email já cadastrado');
  }
  return usuarioRepository.criar({
    nome: nome.trim(),
    email: email.trim(),
    senha,
  });
}

function semSenha(row) {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    created_at: row.created_at,
  };
}

function listar() {
  return usuarioRepository.listarTodos().map(semSenha);
}

function buscarPorId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const row = usuarioRepository.buscarPorId(id);
  if (!row) {
    throw new AppError(404, 'usuário não encontrado');
  }
  return semSenha(row);
}

function atualizar(idParam, body) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  const existente = usuarioRepository.buscarPorId(id);
  if (!existente) {
    throw new AppError(404, 'usuário não encontrado');
  }
  const { nome, email, senha } = body ?? {};
  if (nome === undefined && email === undefined && senha === undefined) {
    throw new AppError(400, 'informe ao menos um campo: nome, email ou senha');
  }
  let novoNome = existente.nome;
  let novoEmail = existente.email;
  let novaSenha = existente.senha;
  if (nome !== undefined) {
    if (typeof nome !== 'string' || !nome.trim()) {
      throw new AppError(400, 'nome inválido');
    }
    novoNome = nome.trim();
  }
  if (email !== undefined) {
    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      throw new AppError(400, 'email inválido');
    }
    const emailNorm = email.trim().toLowerCase();
    const outro = usuarioRepository.buscarPorEmail(email);
    if (outro && outro.id !== id) {
      throw new AppError(409, 'email já cadastrado');
    }
    novoEmail = emailNorm;
  }
  if (senha !== undefined) {
    if (typeof senha !== 'string' || !senha.length) {
      throw new AppError(400, 'senha inválida');
    }
    novaSenha = senha;
  }
  const row = usuarioRepository.atualizar(id, {
    nome: novoNome,
    email: novoEmail,
    senha: novaSenha,
  });
  return semSenha(row);
}

function remover(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, 'id inválido');
  }
  if (!usuarioRepository.remover(id)) {
    throw new AppError(404, 'usuário não encontrado');
  }
}

module.exports = { cadastrar, listar, buscarPorId, atualizar, remover, semSenha };
