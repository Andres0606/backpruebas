const {
  obterConfiguracoes,
  atualizarConfiguracoes,
} = require('../services/configuracaoService');

// ============================================================
// CONSULTAR CONFIGURAÇÕES
// ============================================================

async function consultarConfiguracoes(req, res) {
  try {
    const configuracoes =
      await obterConfiguracoes(
        req.usuario.id
      );

    return res.status(200).json({
      configuracoes,
    });
  } catch (erro) {
    console.error(
      'Erro ao consultar configurações:',
      erro.name
    );

    return res.status(erro.status || 500).json({
      mensagem: erro.status
        ? erro.message
        : 'Erro ao consultar configurações.',
    });
  }
}

// ============================================================
// EDITAR CONFIGURAÇÕES
// ============================================================

async function editarConfiguracoes(req, res) {
  try {
    const configuracoes =
      await atualizarConfiguracoes(
        req.usuario.id,
        req.body
      );

    return res.status(200).json({
      mensagem:
        'Configurações atualizadas com sucesso.',

      configuracoes,
    });
  } catch (erro) {
    console.error(
      'Erro ao atualizar configurações:',
      erro.name
    );

    return res.status(erro.status || 500).json({
      mensagem: erro.status
        ? erro.message
        : 'Erro ao atualizar configurações.',
    });
  }
}

module.exports = {
  consultarConfiguracoes,
  editarConfiguracoes,
};