// ROUTES — Favoritos de frases

const express = require('express');
const favoritoController = require('../controllers/favoritoFraseController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

router.get('/', favoritoController.listar);
router.get('/:id', favoritoController.verificar);
router.post('/:id', favoritoController.adicionar);
router.delete('/:id', favoritoController.remover);

module.exports = router;