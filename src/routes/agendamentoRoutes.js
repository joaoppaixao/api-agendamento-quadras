const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const agendamentoController = require('../controllers/agendamentoController');

const router = Router();

router.get('/agendamentos', agendamentoController.listar);
router.get('/agendamentos/:id', agendamentoController.buscar);
router.post('/agendamentos', auth, agendamentoController.criar);
router.delete('/agendamentos/:id', auth, agendamentoController.deletar);

module.exports = router;
