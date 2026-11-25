const express = require('express');

const {
  consultarConfiguracoes,
  editarConfiguracoes,
} = require('../controllers/configuracaoController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================
// CONSULTAR CONFIGURAÇÕES
// ============================================================

router.get(
  '/me',
  autenticar,
  consultarConfiguracoes
);

// ============================================================
// ATUALIZAR CONFIGURAÇÕES
// ============================================================

router.put(
  '/me',
  autenticar,
  editarConfiguracoes
);

module.exports = router;