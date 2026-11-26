// ROUTES — Administração

const express = require('express');

const {
  autenticar,
} = require('../middlewares/authMiddleware');

const {
  autorizar,
} = require('../middlewares/autorizacaoMiddleware');

const lugarController =
  require('../controllers/lugarController');

const categoriaLugarController =
  require('../controllers/categoriaLugarController');

const {
  atualizarFotoLugar,
  removerFotoLugar,
} = require('../controllers/fotoLugarController');

const {
  uploadFoto,
} = require('../middlewares/uploadMiddleware');

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

// ============================================================
// GERENCIAMENTO DE LUGARES
// ============================================================

router.get(
  '/lugares',
  lugarController.listarAdmin
);

router.get(
  '/lugares/:id',
  lugarController.obterAdmin
);

router.post(
  '/lugares',
  lugarController.criar
);

router.put(
  '/lugares/:id',
  lugarController.atualizar
);

router.delete(
  '/lugares/:id',
  lugarController.desativar
);

// ============================================================
// GERENCIAMENTO DE CATEGORIAS DE LUGARES
// ============================================================

router.get(
  '/categorias-lugar',
  categoriaLugarController.listar
);

router.get(
  '/categorias-lugar/:id',
  categoriaLugarController.obter
);

router.post(
  '/categorias-lugar',
  categoriaLugarController.criar
);

router.put(
  '/categorias-lugar/:id',
  categoriaLugarController.atualizar
);

router.delete(
  '/categorias-lugar/:id',
  categoriaLugarController.excluir
);

// ============================================================
// FOTOGRAFIAS DE LUGARES
// ============================================================

router.put(
  '/lugares/:id/foto',
  uploadFoto,
  atualizarFotoLugar
);

router.delete(
  '/lugares/:id/foto',
  removerFotoLugar
);

module.exports = router;