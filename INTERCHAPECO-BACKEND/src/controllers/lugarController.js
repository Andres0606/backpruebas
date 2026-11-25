// CONTROLLER — Lugares

const lugarService =
  require('../services/lugarService');

// ============================================================
// TRATAMENTO DE ERROS
// ============================================================

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
      mensagem: 'Dados do lugar inválidos.',
    });
  }

  if (
    erro.name === 'SequelizeForeignKeyConstraintError'
  ) {
    return res.status(409).json({
      mensagem: 'Relacionamento inválido.',
    });
  }

  console.error(
    'Erro no gerenciamento de lugares:',
    erro.name
  );

  return res.status(500).json({
    mensagem:
      'Não foi possível processar a solicitação.',
  });
}

// ============================================================
// LISTAR LUGARES ATIVOS
// ============================================================

async function listar(req, res) {
  try {
    const lugares =
      await lugarService.listarLugares({
        busca: req.query.busca,
        categoriaId: req.query.categoriaId,
      });

    return res.status(200).json(lugares);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// LISTAR LUGARES — ADMINISTRADOR
// ============================================================

async function listarAdmin(req, res) {
  try {
    const lugares =
      await lugarService.listarLugares({
        busca: req.query.busca,
        categoriaId: req.query.categoriaId,
        incluirInativos: true,
      });

    return res.status(200).json(lugares);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// OBTER LUGAR
// ============================================================

async function obter(req, res) {
  try {
    const lugar =
      await lugarService.obterLugar(
        req.params.id
      );

    return res.status(200).json(lugar);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// OBTER LUGAR — ADMINISTRADOR
// ============================================================

async function obterAdmin(req, res) {
  try {
    const lugar =
      await lugarService.obterLugar(
        req.params.id,
        true
      );

    return res.status(200).json(lugar);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// CRIAR LUGAR
// ============================================================

async function criar(req, res) {
  try {
    const lugar =
      await lugarService.criarLugar(
        req.body
      );

    return res.status(201).json(lugar);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// ATUALIZAR LUGAR
// ============================================================

async function atualizar(req, res) {
  try {
    const lugar =
      await lugarService.atualizarLugar(
        req.params.id,
        req.body
      );

    return res.status(200).json(lugar);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// DESATIVAR LUGAR
// ============================================================

async function desativar(req, res) {
  try {
    const resultado =
      await lugarService.desativarLugar(
        req.params.id
      );

    return res.status(200).json(resultado);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listar,
  listarAdmin,
  obter,
  obterAdmin,
  criar,
  atualizar,
  desativar,
};