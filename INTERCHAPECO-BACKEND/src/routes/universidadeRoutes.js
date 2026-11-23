const express = require('express');

const {
  listarUniversidades,
} = require(
  '../controllers/universidadeController'
);

const router = express.Router();

// ============================================================
// LISTAR UNIVERSIDADES
// ============================================================

router.get(
  '/',
  listarUniversidades
);

module.exports = router;