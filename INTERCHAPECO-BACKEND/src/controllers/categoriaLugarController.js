// CONTROLLER — Categorias de lugares

const categoriaService =
  require('../services/categoriaLugarService');

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
    erro.name ===
    'SequelizeUniqueConstraintError'
  ) {
    return res.status(409).json({
      mensagem:
        'Já existe uma categoria com esse nome.',
    });
  }

  if (
    erro.name ===
    'SequelizeValidationError'
  ) {
    return res.status(400).json({
      mensagem:
        'Dados da categoria inválidos.',
    });
  }

  if (
    erro.name ===
    'SequelizeForeignKeyConstraintError'
  ) {
    return res.status(409).json({
      mensagem:
        'A categoria possui relacionamentos associados.',
    });
  }

  console.error(
    'Erro no gerenciamento de categorias:',
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

// ============================================================
// CRIAR CATEGORIA
// ============================================================

async function criar(req, res) {
  try {
    const categoria =
      await categoriaService.criarCategoria(
        req.body
      );

    return res.status(201).json(categoria);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// ATUALIZAR CATEGORIA
// ============================================================

async function atualizar(req, res) {
  try {
    const categoria =
      await categoriaService.atualizarCategoria(
        req.params.id,
        req.body
      );

    return res.status(200).json(categoria);

  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// ============================================================
// EXCLUIR CATEGORIA
// ============================================================

async function excluir(req, res) {
  try {
    const resultado =
      await categoriaService.excluirCategoria(
        req.params.id
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