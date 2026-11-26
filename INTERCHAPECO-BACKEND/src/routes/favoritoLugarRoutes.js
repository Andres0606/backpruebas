// ROUTES — Favoritos de lugares

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
} = require('../controllers/favoritoLugarController');

const router = express.Router();

// ============================================================
// PROTEGER ROTAS
// ============================================================

router.use(
  autenticar,
  autorizar('Estudante')
);

// ============================================================
// FAVORITOS DE LUGARES
// ============================================================

router.get('/', listar);

router.get('/:id', verificar);

router.post('/:id', adicionar);

router.delete('/:id', remover);

module.exports = router;