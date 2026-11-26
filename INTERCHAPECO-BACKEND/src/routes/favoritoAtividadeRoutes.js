
// ROUTES — Favoritos de atividades

const express = require('express');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  autorizar,
} = require('../middlewares/autorizacaoMiddleware');

const {
  listar,
  verificar,
  adicionar,
  remover,
} = require('../controllers/favoritoAtividadeController');

const router = express.Router();

// ============================================================
// PROTEGER ROTAS
// ============================================================

router.use(
  autenticar,
  autorizar('Estudante')
);

// ============================================================
// FAVORITOS DE ATIVIDADES
// ============================================================

router.get('/', listar);

router.get('/:id', verificar);

router.post('/:id', adicionar);

router.delete('/:id', remover);

module.exports = router;
