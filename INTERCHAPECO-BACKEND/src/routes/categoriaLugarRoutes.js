// ROUTES — Categorias de lugares

const express = require('express');

const {
  listar,
  obter,
} = require('../controllers/categoriaLugarController');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================
// PROTEGER ROTAS
// ============================================================

router.use(autenticar);

// ============================================================
// CONSULTAR CATEGORIAS
// ============================================================

router.get('/', listar);

router.get('/:id', obter);

module.exports = router;