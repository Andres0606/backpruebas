
// ROUTES — Administração

const express = require('express');

const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/autorizacaoMiddleware');
const { uploadFoto } = require('../middlewares/uploadMiddleware');

const usuarioController = require('../controllers/adminUsuarioController');
const resumoController = require('../controllers/adminResumoController');
const categoriaController = require('../controllers/adminCategoriaController');
const moderacaoController = require('../controllers/adminModeracaoController');

const lugarController = require('../controllers/lugarController');
const fraseController = require('../controllers/fraseController');
const categoriaLugarController = require('../controllers/categoriaLugarController');

const {
  atualizarFotoLugar,
  removerFotoLugar,
} = require('../controllers/fotoLugarController');

const router = express.Router();

router.use(autenticar, autorizar('Administrador'));

// Acesso e painel

router.get('/acesso', (req, res) => {
  return res.json({
    mensagem: 'Acesso administrativo autorizado.',
    usuario: {
      id: req.usuario.id,
      rol: req.usuario.rol,
    },
  });
});

router.get('/resumo', resumoController.obter);

// Usuários

router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:id', usuarioController.obter);
router.patch('/usuarios/:id/estado', usuarioController.atualizarEstado);

// Lugares

router.get('/lugares', lugarController.listarAdmin);
router.get('/lugares/:id', lugarController.obterAdmin);
router.post('/lugares', lugarController.criar);
router.put('/lugares/:id', lugarController.atualizar);
router.delete('/lugares/:id', lugarController.desativar);

router.put('/lugares/:id/foto', uploadFoto, atualizarFotoLugar);
router.delete('/lugares/:id/foto', removerFotoLugar);

// Frases

router.get('/frases', fraseController.listarAdmin);
router.get('/frases/:id', fraseController.obterAdmin);
router.post('/frases', fraseController.criar);
router.put('/frases/:id', fraseController.atualizar);
router.delete('/frases/:id', fraseController.desativar);

// Categorias de lugares

router.get('/categorias-lugar', categoriaLugarController.listar);
router.get('/categorias-lugar/:id', categoriaLugarController.obter);
router.post('/categorias-lugar', categoriaLugarController.criar);
router.put('/categorias-lugar/:id', categoriaLugarController.atualizar);
router.delete('/categorias-lugar/:id', categoriaLugarController.excluir);

// Categorias de frases, conselhos e atividades

router.get('/categorias/:tipo', categoriaController.listar);
router.get('/categorias/:tipo/:id', categoriaController.obter);
router.post('/categorias/:tipo', categoriaController.criar);
router.put('/categorias/:tipo/:id', categoriaController.atualizar);
router.delete('/categorias/:tipo/:id', categoriaController.excluir);

// Moderação

router.get('/moderacao/:tipo', moderacaoController.listar);
router.get('/moderacao/:tipo/:id', moderacaoController.obter);
router.patch('/moderacao/:tipo/:id/estado', moderacaoController.atualizarEstado);

// Comentários

router.get('/conselhos/:id/comentarios', moderacaoController.listarComentarios);
router.delete('/conselhos/:id/comentarios/:comentarioId',
  moderacaoController.excluirComentario);

module.exports = router;
