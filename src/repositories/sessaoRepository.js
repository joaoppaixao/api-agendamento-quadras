const { randomBytes } = require('crypto');

/** @type {Map<string, number>} */
const tokenParaUsuarioId = new Map();

function criarSessao(usuarioId) {
  const token = randomBytes(24).toString('hex');
  tokenParaUsuarioId.set(token, usuarioId);
  return token;
}

function obterUsuarioId(token) {
  return tokenParaUsuarioId.get(token) ?? null;
}

module.exports = { criarSessao, obterUsuarioId };
