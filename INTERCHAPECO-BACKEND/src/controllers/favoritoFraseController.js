
// CONTROLLER — Favoritos de frases

const favoritoService = require('../services/favoritoFraseService');

function tratarErro(res, erro) {
  if (Number.isInteger(erro.status) &&
      erro.status >= 400 && erro.status < 500) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }

  console.error('Erro no gerenciamento de favoritos:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function listar(req, res) {
  try {
    return res.json(await favoritoService.listarFavoritos(
      req.usuario.id
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function verificar(req, res) {
  try {
    return res.json(await favoritoService.verificarFavorito(
      req.usuario.id, req.params.id
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function adicionar(req, res) {
  try {
    return res.json(await favoritoService.adicionarFavorito(
      req.usuario.id, req.params.id
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function remover(req, res) {
  try {
    return res.json(await favoritoService.removerFavorito(
      req.usuario.id, req.params.id
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listar,
  verificar,
  adicionar,
  remover,
};
