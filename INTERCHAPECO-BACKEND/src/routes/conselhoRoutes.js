
// ROUTES — Conselhos

const express = require('express');

const {
  listar,
  obter,
  criar,
  atualizar,
  excluir,
} = require('../controllers/conselhoController');

const {
  verificar,
  adicionar,
  remover,
} = require('../controllers/curtidaConselhoController');

const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

// Conselhos
router.get('/', listar);
router.get('/:id', obter);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

// Curtidas
router.get('/:id/curtida', verificar);
router.post('/:id/curtida', adicionar);
router.delete('/:id/curtida', remover);

module.exports = router;
