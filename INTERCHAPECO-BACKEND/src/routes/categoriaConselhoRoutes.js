
// ROUTES — Categorias de conselhos

const express = require('express');
const { listar, obter } = require('../controllers/categoriaConselhoController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/', listar);
router.get('/:id', obter);

module.exports = router;
