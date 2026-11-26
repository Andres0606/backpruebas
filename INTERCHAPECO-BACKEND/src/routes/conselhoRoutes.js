
// ROUTES — Conselhos

const express = require('express');
const {
  listar,
  obter,
  criar,
  atualizar,
  excluir,
} = require('../controllers/conselhoController');

const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

router.get('/', listar);
router.get('/:id', obter);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

module.exports = router;
