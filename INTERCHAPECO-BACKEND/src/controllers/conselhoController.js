
// CONTROLLER — Conselhos

const conselhoService = require('../services/conselhoService');

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

  if (erro.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensagem: 'Dados do conselho inválidos.',
    });
  }

  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      mensagem: 'Relacionamento inválido.',
    });
  }

  console.error('Erro no gerenciamento de conselhos:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function listar(req, res) {
  try {
    const conselhos = await conselhoService.listarConselhos(
      req.usuario.id,
      {
        ordenacao: req.query.ordenacao,
        categoriaId: req.query.categoriaId,
      }
    );
    return res.status(200).json(conselhos);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obter(req, res) {
  try {
    const conselho = await conselhoService.obterConselho(
      req.params.id,
      req.usuario.id
    );
    return res.status(200).json(conselho);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const conselho = await conselhoService.criarConselho(
      req.usuario.id,
      req.body
    );
    return res.status(201).json(conselho);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const conselho = await conselhoService.atualizarConselho(
      req.params.id,
      req.usuario.id,
      req.body
    );
    return res.status(200).json(conselho);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    const resultado = await conselhoService.excluirConselho(
      req.params.id,
      req.usuario.id
    );
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listar,
  obter,
  criar,
  atualizar,
  excluir,
};
