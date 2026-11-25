// SERVICE — Categorias de lugares

const {
  CategoriaLugar,
  Lugar,
} = require('../models');

const { Op } = require('sequelize');

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function uuidValido(id) {
  return typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function validarNome(nome) {
  if (
    typeof nome !== 'string' ||
    !nome.trim()
  ) {
    throw criarErro(
      'Informe o nome da categoria.'
    );
  }

  const nomeNormalizado = nome.trim();

  if (nomeNormalizado.length > 60) {
    throw criarErro(
      'O nome deve possuir até 60 caracteres.'
    );
  }

  return nomeNormalizado;
}

// ============================================================
// LISTAR CATEGORIAS
// ============================================================

async function listarCategorias() {
  return CategoriaLugar.findAll({
    attributes: ['id', 'nome'],
    order: [['nome', 'ASC']],
  });
}

// ============================================================
// OBTER CATEGORIA
// ============================================================

async function obterCategoria(id) {
  if (!uuidValido(id)) {
    throw criarErro(
      'Identificador inválido.'
    );
  }

  const categoria =
    await CategoriaLugar.findByPk(id);

  if (!categoria) {
    throw criarErro(
      'Categoria não encontrada.',
      404
    );
  }

  return categoria;
}

// ============================================================
// VERIFICAR NOME DUPLICADO
// ============================================================

async function verificarDuplicidade(
  nome,
  id = null
) {
  const categorias =
    await CategoriaLugar.findAll({
      attributes: ['id', 'nome'],
      where: id
        ? { id: { [Op.ne]: id } }
        : {},
    });

  const existente = categorias.some(
    (categoria) =>
      categoria.nome.toLowerCase() ===
      nome.toLowerCase()
  );

  if (existente) {
    throw criarErro(
      'Já existe uma categoria com esse nome.',
      409
    );
  }
}

// ============================================================
// CRIAR CATEGORIA
// ============================================================

async function criarCategoria(dados) {
  const nome = validarNome(dados?.nome);

  await verificarDuplicidade(nome);

  return CategoriaLugar.create({
    nome,
  });
}

// ============================================================
// ATUALIZAR CATEGORIA
// ============================================================

async function atualizarCategoria(
  id,
  dados
) {
  const categoria =
    await obterCategoria(id);

  const nome =
    validarNome(dados?.nome);

  await verificarDuplicidade(
    nome,
    id
  );

  await categoria.update({
    nome,
  });

  return categoria;
}

// ============================================================
// EXCLUIR CATEGORIA
// ============================================================

async function excluirCategoria(id) {
  const sequelize = CategoriaLugar.sequelize;

  return sequelize.transaction(
    async (transaction) => {

      if (!uuidValido(id)) {
        throw criarErro(
          'Identificador inválido.'
        );
      }

      const categoria =
        await CategoriaLugar.findByPk(id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

      if (!categoria) {
        throw criarErro(
          'Categoria não encontrada.',
          404
        );
      }

      const quantidade =
        await Lugar.count({
          where: {
            categoriaId: id,
          },
          transaction,
        });

      if (quantidade > 0) {
        throw criarErro(
          'Não é possível excluir uma categoria com lugares associados.',
          409
        );
      }

      await categoria.destroy({
        transaction,
      });

      return {
        mensagem:
          'Categoria excluída com sucesso.',
      };
    }
  );
}

module.exports = {
  listarCategorias,
  obterCategoria,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
};