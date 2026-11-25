// ROUTES — Lugares

const express = require('express');

const {
  listar,
  obter,
} = require('../controllers/lugarController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================
// PROTEGER ROTAS
// ============================================================

router.use(autenticar);

// ============================================================
// LISTAR LUGARES
// ============================================================

router.get('/', listar);

// ============================================================
// OBTER LUGAR POR ID
// ============================================================

router.get('/:id', obter);

module.exports = router;