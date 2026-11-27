// CONTROLLER — Moderação administrativa

const service = require('../services/adminModeracaoService');
const { executar } = require('../utils/respostaAdmin');

module.exports = {
  listar: executar(req =>
    service.listarConteudos(
      req.params.tipo,
      req.usuario.id,
      req.query
    )
  ),

  obter: executar(req =>
    service.obterConteudo(
      req.params.tipo,
      req.params.id,
      req.usuario.id
    )
  ),

  atualizarEstado: executar(req =>
    service.atualizarEstadoConteudo(
      req.params.tipo,
      req.params.id,
      req.usuario.id,
      req.body?.ativo
    )
  ),

  listarComentarios: executar(req =>
    service.listarComentarios(req.params.id)
  ),

  excluirComentario: executar(req =>
    service.excluirComentario(
      req.params.id,
      req.params.comentarioId
    )
  ),
};