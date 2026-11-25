const express = require('express');

const {
  login,
  cadastro,
  obterUsuarioAutenticado,
  editarPerfil,
} = require('../controllers/authController');

const {
  atualizarFotoPerfil,
  removerFotoPerfil,
} = require('../controllers/fotoController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  uploadFoto,
} = require('../middlewares/uploadMiddleware');

const router = express.Router();

// ============================================================
// LOGIN
// ============================================================

router.post('/login', login);

// ============================================================
// CADASTRO
// ============================================================

router.post('/cadastro', cadastro);

// ============================================================
// USUÁRIO AUTENTICADO
// ============================================================

router.get(
  '/me',
  autenticar,
  obterUsuarioAutenticado
);

// ============================================================
// ATUALIZAR PERFIL
// ============================================================

router.put(
  '/me',
  autenticar,
  editarPerfil
);

// ============================================================
// ATUALIZAR FOTO
// ============================================================

router.put(
  '/me/foto',
  autenticar,
  uploadFoto,
  atualizarFotoPerfil
);

// ============================================================
// REMOVER FOTO
// ============================================================

router.delete(
  '/me/foto',
  autenticar,
  removerFotoPerfil
);

module.exports = router;