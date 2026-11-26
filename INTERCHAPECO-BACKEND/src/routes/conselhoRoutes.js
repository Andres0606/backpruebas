
// ROUTES — Conselhos

const express = require('express');

const {
  listar,
  obter,
  criar,
  atualizar,
  excluir,
} = require('../controllers/conselhoController');

const {
  verificar,
  adicionar,
  remover,
} = require('../controllers/curtidaConselhoController');

const {
  listarComentarios,
  criarComentario,
  atualizarComentario,
  excluirComentario,
} = require('../controllers/comentarioConselhoController');

const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('Estudante'));

// Conselhos
router.get('/', listar);
router.get('/:id', obter);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

// Curtidas
router.get('/:id/curtida', verificar);
router.post('/:id/curtida', adicionar);
router.delete('/:id/curtida', remover);

// Comentários
router.get('/:id/comentarios', listarComentarios);
router.post('/:id/comentarios', criarComentario);
router.put('/:id/comentarios/:comentarioId', atualizarComentario);
router.delete('/:id/comentarios/:comentarioId', excluirComentario);

module.exports = router;
