const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:id', usuarioController.buscar);
router.post('/usuarios', auth, usuarioController.criar);
router.put('/usuarios/:id', auth, usuarioController.atualizar);
router.delete('/usuarios/:id', auth, usuarioController.deletar);

module.exports = router;
