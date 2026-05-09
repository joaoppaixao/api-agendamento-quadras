const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.post('/autenticacao', authController.autenticar);

module.exports = router;
