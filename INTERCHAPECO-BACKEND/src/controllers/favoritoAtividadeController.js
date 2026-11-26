
// CONTROLLER — Favoritos de atividades

const favoritoService =
  require('../services/favoritoAtividadeService');

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
    'Erro no gerenciamento de favoritos de atividades:',
    erro.name
  );

  return res.status(500).json({
    mensagem:
      'Não foi possível processar a solicitação.',
  });
}

// ============================================================
// LISTAR FAVORITOS
// ============================================================

async function listar(req, res) {
  try {
    const favoritos =
      await favoritoService.listarFavoritos(
        req.usuario.id
      );

    return res.status(200).json(favoritos);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

async function verificar(req, res) {
  try {
    const resultado =
      await favoritoService.verificarFavorito(
        req.usuario.id,
        req.params.id
      );

    return res.status(200).json(resultado);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

async function adicionar(req, res) {
  try {
    const resultado =
      await favoritoService.adicionarFavorito(
        req.usuario.id,
        req.params.id
      );

    return res.status(200).json(resultado);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

async function remover(req, res) {
  try {
    const resultado =
      await favoritoService.removerFavorito(
        req.usuario.id,
        req.params.id
      );

    return res.status(200).json(resultado);

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
