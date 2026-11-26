
// ROUTES — Atividades

const express = require('express');

const {
  listar,
  obter,
  criar,
  atualizar,
  excluir,
} = require('../controllers/atividadeController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  autorizar,
} = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

// ============================================================
// PROTEGER ROTAS
// ============================================================

router.use(
  autenticar,
  autorizar('Estudante')
);

// ============================================================
// LISTAR ATIVIDADES
// ============================================================

router.get('/', listar);

// ============================================================
// OBTER ATIVIDADE POR ID
// ============================================================

router.get('/:id', obter);

// ============================================================
// CRIAR ATIVIDADE
// ============================================================

router.post('/', criar);

// ============================================================
// ATUALIZAR ATIVIDADE
// ============================================================

router.put('/:id', atualizar);

// ============================================================
// EXCLUIR ATIVIDADE
// ============================================================

router.delete('/:id', excluir);

module.exports = router;
