
// SERVICE — Gerenciamento de categorias

const {
  CategoriaFrase, Frase,
  CategoriaConselho, Conselho,
  CategoriaAtividade, Atividade,
} = require('../models');

const {
  criarErro, validarId, normalizarTexto,
} = require('../utils/admin');

const TIPOS = {
  frases: { model: CategoriaFrase, conteudo: Frase },
  conselhos: { model: CategoriaConselho, conteudo: Conselho },
  atividades: { model: CategoriaAtividade, conteudo: Atividade },
};

function obterTipo(tipo) {
  if (!Object.prototype.hasOwnProperty.call(TIPOS, tipo)) {
    throw criarErro('Tipo de categoria inválido.', 404);
  }

  return TIPOS[tipo];
}

function validarNome(nome) {
  if (typeof nome !== 'string' ||
      !nome.trim() || nome.trim().length > 60) {
    throw criarErro('Informe um nome de até 60 caracteres.');
  }

  return nome.trim();
}

async function verificarDuplicidade(model, nome, id) {
  const categorias = await model.findAll({
    attributes: ['id', 'nome'],
  });

  const existe = categorias.some(item =>
    item.id !== id &&
    normalizarTexto(item.nome) === normalizarTexto(nome)
  );

  if (existe) {
    throw criarErro('Já existe uma categoria com esse nome.', 409);
  }
}

async function listarCategorias(tipo) {
  const { model } = obterTipo(tipo);

  return model.findAll({
    attributes: ['id', 'nome'],
    order: [['nome', 'ASC']],
  });
}

async function obterCategoria(tipo, id) {
  validarId(id);

  const { model } = obterTipo(tipo);
  const categoria = await model.findByPk(id);

  if (!categoria) {
    throw criarErro('Categoria não encontrada.', 404);
  }

  return categoria;
}

async function criarCategoria(tipo, dados) {
  const { model } = obterTipo(tipo);
  const nome = validarNome(dados?.nome);

  await verificarDuplicidade(model, nome);

  return model.create({ nome });
}

async function atualizarCategoria(tipo, id, dados) {
  const { model } = obterTipo(tipo);
  const categoria = await obterCategoria(tipo, id);
  const nome = validarNome(dados?.nome);

  await verificarDuplicidade(model, nome, id);
  await categoria.update({ nome });

  return categoria;
}

async function excluirCategoria(tipo, id) {
  validarId(id);

  const { model, conteudo } = obterTipo(tipo);

  return model.sequelize.transaction(async transaction => {
    const categoria = await model.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!categoria) {
      throw criarErro('Categoria não encontrada.', 404);
    }

    const quantidade = await conteudo.count({
      where: { categoriaId: id },
      transaction,
    });

    if (quantidade > 0) {
      throw criarErro(
        'Não é possível excluir uma categoria com conteúdos associados.',
        409
      );
    }

    await categoria.destroy({ transaction });

    return {
      mensagem: 'Categoria excluída com sucesso.',
    };
  });
}

module.exports = {
  listarCategorias,
  obterCategoria,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
};
