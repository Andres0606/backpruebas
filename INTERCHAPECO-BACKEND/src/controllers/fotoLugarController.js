// CONTROLLER — Fotografias de lugares

const {
  enviarFotoLugar,
  excluirFotoLugar,
} = require('../services/fotoLugarService');

// ============================================================
// ATUALIZAR FOTO DO LUGAR
// ============================================================

async function atualizarFotoLugar(req, res) {
  try {
    const resultado = await enviarFotoLugar(
      req.params.id,
      req.file
    );

    return res.status(200).json({
      mensagem:
        'Imagem atualizada com sucesso.',

      ...resultado,
    });

  } catch (erro) {
    console.error(
      'Erro ao atualizar imagem do lugar:',
      erro.name
    );

    return res.status(
      erro.status || 500
    ).json({
      mensagem: erro.status
        ? erro.message
        : 'Não foi possível atualizar a imagem.',
    });
  }
}

// ============================================================
// REMOVER FOTO DO LUGAR
// ============================================================

async function removerFotoLugar(req, res) {
  try {
    const resultado = await excluirFotoLugar(
      req.params.id
    );

    return res.status(200).json({
      mensagem:
        'Imagem removida com sucesso.',

      ...resultado,
    });

  } catch (erro) {
    console.error(
      'Erro ao remover imagem do lugar:',
      erro.name
    );

    return res.status(
      erro.status || 500
    ).json({
      mensagem: erro.status
        ? erro.message
        : 'Não foi possível remover a imagem.',
    });
  }
}

module.exports = {
  atualizarFotoLugar,
  removerFotoLugar,
};