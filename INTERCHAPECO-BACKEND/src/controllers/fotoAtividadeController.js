
// CONTROLLER — Fotografias de atividades

const {
  enviarFotoAtividade,
  excluirFotoAtividade,
} = require('../services/fotoAtividadeService');

function tratarErro(res, erro) {
  console.error('Erro na fotografia da atividade:', erro.name);

  const status =
    Number.isInteger(erro.status) &&
    erro.status >= 400 &&
    erro.status <= 599
      ? erro.status
      : 500;

  return res.status(status).json({
    mensagem: status < 500
      ? erro.message
      : 'Não foi possível processar a imagem.',
  });
}

// Atualizar fotografia
async function atualizarFotoAtividade(req, res) {
  try {
    const resultado = await enviarFotoAtividade(
      req.params.id,
      req.usuario.id,
      req.file
    );

    return res.status(200).json({
      mensagem: 'Imagem atualizada com sucesso.',
      ...resultado,
    });
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// Remover fotografia
async function removerFotoAtividade(req, res) {
  try {
    const resultado = await excluirFotoAtividade(
      req.params.id,
      req.usuario.id
    );

    return res.status(200).json({
      mensagem: 'Imagem removida com sucesso.',
      ...resultado,
    });
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  atualizarFotoAtividade,
  removerFotoAtividade,
};
