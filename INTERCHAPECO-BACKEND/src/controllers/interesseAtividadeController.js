
// CONTROLLER — Interesses em atividades

const interesseService =
  require('../services/interesseAtividadeService');

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

  console.error(
    'Erro no gerenciamento de interesses:',
    erro.name
  );

  return res.status(500).json({
    mensagem:
      'Não foi possível processar a solicitação.',
  });
}

// ============================================================
// VERIFICAR INTERESSE
// ============================================================

async function verificar(req, res) {
  try {
    const resultado =
      await interesseService.verificarInteresse(
        req.usuario.id,
        req.params.id
      );

    return res.status(200).json(resultado);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// ADICIONAR INTERESSE
// ============================================================

async function adicionar(req, res) {
  try {
    const resultado =
      await interesseService.adicionarInteresse(
        req.usuario.id,
        req.params.id
      );

    return res.status(200).json(resultado);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// REMOVER INTERESSE
// ============================================================

async function remover(req, res) {
  try {
    const resultado =
      await interesseService.removerInteresse(
        req.usuario.id,
        req.params.id
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
