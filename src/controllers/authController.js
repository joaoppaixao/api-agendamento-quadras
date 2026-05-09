const authService = require('../services/authService');

async function autenticar(req, res, next) {
  try {
    const result = authService.autenticar(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { autenticar };
