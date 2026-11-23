const express = require('express');

const {
  login,
  obterUsuarioAutenticado,
} = require('../controllers/authController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/login',
  login
);

router.get(
  '/me',
  autenticar,
  obterUsuarioAutenticado
);

module.exports = router;