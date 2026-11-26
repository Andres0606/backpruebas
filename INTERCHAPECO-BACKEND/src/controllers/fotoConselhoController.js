
// CONTROLLER — Fotografias de conselhos

const {
  enviarFotoConselho,
  excluirFotoConselho,
} = require('../services/fotoConselhoService');

function tratarErro(res, erro) {
  console.error('Erro na fotografia do conselho:', erro.name);

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

async function atualizarFotoConselho(req, res) {
  try {
    const resultado = await enviarFotoConselho(
      req.params.id, req.usuario.id, req.file
    );

    return res.status(200).json({
      mensagem: 'Imagem atualizada com sucesso.',
      ...resultado,
    });
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function removerFotoConselho(req, res) {
  try {
    const resultado = await excluirFotoConselho(
      req.params.id, req.usuario.id
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
  atualizarFotoConselho,
  removerFotoConselho,
};
