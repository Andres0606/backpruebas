
// SERVICE — Categorias de conselhos

const { CategoriaConselho } = require('../models');

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function uuidValido(id) {
  return typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

async function listarCategorias() {
  return CategoriaConselho.findAll({
    attributes: ['id', 'nome'],
    order: [['nome', 'ASC']],
  });
}

async function obterCategoria(id) {
  if (!uuidValido(id)) {
    throw criarErro('Identificador inválido.');
  }

  const categoria = await CategoriaConselho.findByPk(id);

  if (!categoria) {
    throw criarErro('Categoria não encontrada.', 404);
  }

  return categoria;
}

module.exports = {
  listarCategorias,
  obterCategoria,
};
