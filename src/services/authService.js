const { AppError } = require('../errors/AppError');
const usuarioRepository = require('../repositories/usuarioRepository');
const sessaoRepository = require('../repositories/sessaoRepository');

function autenticar({ email, senha }) {
  if (!email || typeof email !== 'string') {
    throw new AppError(400, 'email é obrigatório');
  }
  if (!senha || typeof senha !== 'string') {
    throw new AppError(400, 'senha é obrigatória');
  }
  const usuario = usuarioRepository.buscarPorEmail(email);
  if (!usuario || usuario.senha !== senha) {
    throw new AppError(401, 'credenciais inválidas');
  }
  const token = sessaoRepository.criarSessao(usuario.id);
  return { token };
}

module.exports = { autenticar };
