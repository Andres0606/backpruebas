
// ROUTES — Tarefas

const express = require('express');
const tarefaController = require('../controllers/tarefaController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

// Catálogos
router.get('/etapas', tarefaController.listarEtapas);
router.get('/estados', tarefaController.listarEstados);
router.get('/prioridades', tarefaController.listarPrioridades);

// CRUD
router.get('/', tarefaController.listar);
router.get('/:id', tarefaController.obter);
router.post('/', tarefaController.criar);
router.put('/:id', tarefaController.atualizar);
router.delete('/:id', tarefaController.excluir);

// Estado
router.patch('/:id/estado', tarefaController.atualizarEstado);

module.exports = router;
