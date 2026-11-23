const express = require('express');

const {
  listarRoles,
  obterRol,
  criarRol,
  atualizarRol,
  excluirRol,
} = require('../controllers/rolController');

const router = express.Router();

router.get('/', listarRoles);
router.get('/:id', obterRol);
router.post('/', criarRol);
router.put('/:id', atualizarRol);
router.delete('/:id', excluirRol);

module.exports = router;