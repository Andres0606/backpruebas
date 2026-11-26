
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
  verificar,
  adicionar,
  remover,
} = require('../controllers/interesseAtividadeController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  autorizar,
} = require('../middlewares/autorizacaoMiddleware');

const {
  atualizarFotoAtividade,
  removerFotoAtividade,
} = require('../controllers/fotoAtividadeController');

const {
  uploadFoto,
} = require('../middlewares/uploadMiddleware');

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

// ============================================================
// INTERESSES EM ATIVIDADES
// ============================================================

router.get('/:id/interesse', verificar);

router.post('/:id/interesse', adicionar);

router.delete('/:id/interesse', remover);

// Fotografias de atividades

router.put(
  '/:id/foto',
  uploadFoto,
  atualizarFotoAtividade
);

router.delete(
  '/:id/foto',
  removerFotoAtividade
);

module.exports = router;
