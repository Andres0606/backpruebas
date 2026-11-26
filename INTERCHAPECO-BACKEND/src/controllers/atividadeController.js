
// CONTROLLER — Atividades

const atividadeService =
  require('../services/atividadeService');

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

  if (
    erro.name === 'SequelizeValidationError'
  ) {
    return res.status(400).json({
      mensagem: 'Dados da atividade inválidos.',
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
    'Erro no gerenciamento de atividades:',
    erro.name
  );

  return res.status(500).json({
    mensagem:
      'Não foi possível processar a solicitação.',
  });
}

// ============================================================
// LISTAR ATIVIDADES
// ============================================================

async function listar(req, res) {
  try {
    const atividades =
      await atividadeService.listarAtividades(
        req.usuario.id,
        {
          ordenacao: req.query.ordenacao,
          categoriaId: req.query.categoriaId,
        }
      );

    return res.status(200).json(atividades);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// OBTER ATIVIDADE
// ============================================================

async function obter(req, res) {
  try {
    const atividade =
      await atividadeService.obterAtividade(
        req.params.id,
        req.usuario.id
      );

    return res.status(200).json(atividade);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// CRIAR ATIVIDADE
// ============================================================

async function criar(req, res) {
  try {
    const atividade =
      await atividadeService.criarAtividade(
        req.usuario.id,
        req.body
      );

    return res.status(201).json(atividade);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// ATUALIZAR ATIVIDADE
// ============================================================

async function atualizar(req, res) {
  try {
    const atividade =
      await atividadeService.atualizarAtividade(
        req.params.id,
        req.usuario.id,
        req.body
      );

    return res.status(200).json(atividade);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// EXCLUIR ATIVIDADE
// ============================================================

async function excluir(req, res) {
  try {
    const resultado =
      await atividadeService.excluirAtividade(
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
