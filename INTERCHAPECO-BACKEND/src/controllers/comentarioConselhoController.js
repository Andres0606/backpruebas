
// CONTROLLER — Comentários em conselhos

const comentarioService = require('../services/comentarioConselhoService');

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

  console.error('Erro no gerenciamento de comentários:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function listarComentarios(req, res) {
  try {
    const resultado = await comentarioService.listarComentarios(
      req.usuario.id, req.params.id
    );

    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function criarComentario(req, res) {
  try {
    const resultado = await comentarioService.criarComentario(
      req.usuario.id, req.params.id, req.body
    );

    return res.status(201).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizarComentario(req, res) {
  try {
    const resultado = await comentarioService.atualizarComentario(
      req.usuario.id,
      req.params.id,
      req.params.comentarioId,
      req.body
    );

    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function excluirComentario(req, res) {
  try {
    const resultado = await comentarioService.excluirComentario(
      req.usuario.id,
      req.params.id,
      req.params.comentarioId
    );

    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listarComentarios,
  criarComentario,
  atualizarComentario,
  excluirComentario,
};
