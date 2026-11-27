// CONTROLLER — Usuários administrativos

const service = require('../services/adminUsuarioService');
const { executar } = require('../utils/respostaAdmin');

module.exports = {
  listar: executar(req =>
    service.listarUsuarios(req.query)
  ),

  obter: executar(req =>
    service.obterUsuario(req.params.id)
  ),

  atualizarEstado: executar(req =>
    service.atualizarEstadoUsuario(
      req.params.id,
      req.usuario.id,
      req.body?.ativo
    )
  ),
};