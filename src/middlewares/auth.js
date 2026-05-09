const { AppError } = require('../errors/AppError');
const sessaoRepository = require('../repositories/sessaoRepository');

function extrairToken(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) return null;
  return token.trim();
}

function auth(req, res, next) {
  try {
    const token = extrairToken(req);
    if (!token) {
      throw new AppError(401, 'token ausente ou inválido');
    }
    const usuarioId = sessaoRepository.obterUsuarioId(token);
    if (!usuarioId) {
      throw new AppError(401, 'token ausente ou inválido');
    }
    req.usuarioId = usuarioId;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { auth };
