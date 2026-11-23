const express = require('express');

const {
  listarPaises,
} = require('../controllers/paisController');

const router = express.Router();

// ============================================================
// LISTAR PAÍSES
// ============================================================

router.get(
  '/',
  listarPaises
);

module.exports = router;