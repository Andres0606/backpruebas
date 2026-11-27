// CONTROLLER — Categorias administrativas

const service = require('../services/adminCategoriaService');
const { executar } = require('../utils/respostaAdmin');

module.exports = {
  listar: executar(req =>
    service.listarCategorias(req.params.tipo)
  ),

  obter: executar(req =>
    service.obterCategoria(req.params.tipo, req.params.id)
  ),

  criar: executar(req =>
    service.criarCategoria(req.params.tipo, req.body), 201
  ),

  atualizar: executar(req =>
    service.atualizarCategoria(
      req.params.tipo, req.params.id, req.body
    )
  ),

  excluir: executar(req =>
    service.excluirCategoria(req.params.tipo, req.params.id)
  ),
};