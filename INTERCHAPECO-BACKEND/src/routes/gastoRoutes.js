// ROUTES — Meus gastos

const express = require('express');
const gastoController = require('../controllers/gastoController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

// Categorias
router.get('/categorias', gastoController.listarCategorias);

// Orçamento
router.get('/orcamento', gastoController.obterOrcamento);
router.put('/orcamento', gastoController.atualizarOrcamento);

// Resumo e estatísticas
router.get('/resumo', gastoController.obterResumo);
router.get('/estatisticas', gastoController.obterEstatisticas);

// CRUD
router.get('/', gastoController.listar);
router.get('/:id', gastoController.obter);
router.post('/', gastoController.criar);
router.put('/:id', gastoController.atualizar);
router.delete('/:id', gastoController.excluir);

module.exports = router;