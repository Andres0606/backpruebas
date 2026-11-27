// ROUTES — Frases em português

const express = require('express');
const fraseController = require('../controllers/fraseController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/categorias', fraseController.listarCategorias);
router.get('/', fraseController.listar);
router.get('/:id', fraseController.obter);

module.exports = router;