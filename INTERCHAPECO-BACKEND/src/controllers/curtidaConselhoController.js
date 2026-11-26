
// CONTROLLER — Curtidas em conselhos

const curtidaService = require('../services/curtidaConselhoService');

function tratarErro(res, erro) {
  if (
    Number.isInteger(erro.status) &&
    erro.status >= 400 &&
    erro.status < 500
  ) {
    return res.status(erro.status).json({
      mensagem: erro.message,
    });
  }

  console.error('Erro no gerenciamento de curtidas:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function verificar(req, res) {
  try {
    const resultado = await curtidaService.verificarCurtida(
      req.usuario.id, req.params.id
    );
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function adicionar(req, res) {
  try {
    const resultado = await curtidaService.adicionarCurtida(
      req.usuario.id, req.params.id
    );
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function remover(req, res) {
  try {
    const resultado = await curtidaService.removerCurtida(
      req.usuario.id, req.params.id
    );
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  verificar,
  adicionar,
  remover,
};
