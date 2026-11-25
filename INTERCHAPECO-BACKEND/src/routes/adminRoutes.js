// ROUTES — Administração

const express = require('express');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  autorizar,
} = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

// ============================================================
// PROTEGER TODAS AS ROTAS ADMINISTRATIVAS
// ============================================================

router.use(
  autenticar,
  autorizar('Administrador')
);

// ============================================================
// VERIFICAR ACESSO ADMINISTRATIVO
// ============================================================

router.get('/acesso', (req, res) => {
  return res.status(200).json({
    mensagem:
      'Acesso administrativo autorizado.',

    usuario: {
      id: req.usuario.id,
      rol: req.usuario.rol,
    },
  });
});

module.exports = router;