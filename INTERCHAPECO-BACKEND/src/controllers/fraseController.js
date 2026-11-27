
// CONTROLLER — Frases em português

const fraseService = require('../services/fraseService');

function tratarErro(res, erro) {
  if (Number.isInteger(erro.status) &&
      erro.status >= 400 && erro.status < 500) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }

  if (erro.name === 'SequelizeValidationError') {
    return res.status(400).json({ mensagem: 'Dados inválidos.' });
  }

  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ mensagem: 'Relacionamento inválido.' });
  }

  console.error('Erro no gerenciamento de frases:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function listarCategorias(req, res) {
  try {
    return res.json(await fraseService.listarCategorias());
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    return res.json(await fraseService.listarFrases({
      categoriaId: req.query.categoriaId,
      busca: req.query.busca,
    }));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listarAdmin(req, res) {
  try {
    return res.json(await fraseService.listarFrases({
      categoriaId: req.query.categoriaId,
      busca: req.query.busca,
      incluirInativas: true,
    }));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obter(req, res) {
  try {
    return res.json(await fraseService.obterFrase(req.params.id));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obterAdmin(req, res) {
  try {
    return res.json(await fraseService.obterFrase(req.params.id, true));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const frase = await fraseService.criarFrase(req.body);
    return res.status(201).json(frase);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    return res.json(await fraseService.atualizarFrase(
      req.params.id, req.body
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function desativar(req, res) {
  try {
    return res.json(await fraseService.desativarFrase(req.params.id));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listarCategorias,
  listar,
  listarAdmin,
  obter,
  obterAdmin,
  criar,
  atualizar,
  desativar,
};
