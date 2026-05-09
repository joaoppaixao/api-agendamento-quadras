const { AppError } = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : 'erro interno do servidor';
  res.status(status).json({ erro: message });
}

module.exports = { errorHandler };
