const express = require('express');

const {
  login,
  cadastro,
  obterUsuarioAutenticado,
} = require('../controllers/authController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================
// LOGIN
// ============================================================

router.post(
  '/login',
  login
);

// ============================================================
// CADASTRO
// ============================================================

router.post(
  '/cadastro',
  cadastro
);

// ============================================================
// USUÁRIO AUTENTICADO
// ============================================================

router.get(
  '/me',
  autenticar,
  obterUsuarioAutenticado
);

module.exports = router;