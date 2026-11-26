
// CONTROLLER — Categorias de atividades

const categoriaService =
  require('../services/categoriaAtividadeService');

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
    'Erro no gerenciamento de categorias de atividades:',
    erro.name
  );

  return res.status(500).json({
    mensagem:
      'Não foi possível processar a solicitação.',
  });
}

// ============================================================
// LISTAR CATEGORIAS
// ============================================================

async function listar(req, res) {
  try {
    const categorias =
      await categoriaService.listarCategorias();

    return res.status(200).json(categorias);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// OBTER CATEGORIA
// ============================================================

async function obter(req, res) {
  try {
    const categoria =
      await categoriaService.obterCategoria(
        req.params.id
      );

    return res.status(200).json(categoria);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listar,
  obter,
};
