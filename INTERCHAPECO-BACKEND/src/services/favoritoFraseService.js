
// SERVICE — Favoritos de frases

const { FavoritoFrase, Frase, CategoriaFrase } = require('../models');

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarId(id) {
  if (typeof id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw criarErro('Identificador inválido.');
  }
}

async function listarFavoritos(usuarioId) {
  const favoritos = await FavoritoFrase.findAll({
    where: { usuarioId },
    include: [{
      model: Frase,
      as: 'frase',
      required: true,
      where: { ativo: true },
      include: [{
        model: CategoriaFrase,
        as: 'categoria',
        attributes: ['id', 'nome'],
      }],
    }],
    order: [['criadoEm', 'DESC'], ['fraseId', 'ASC']],
  });

  return favoritos.map(favorito => ({
    ...favorito.frase.toJSON(),
    guardado: true,
    guardadoEm: favorito.criadoEm,
  }));
}

async function verificarFavorito(usuarioId, fraseId) {
  validarId(fraseId);

  const frase = await Frase.findOne({
    where: { id: fraseId, ativo: true },
  });

  if (!frase) throw criarErro('Frase não encontrada.', 404);

  const favorito = await FavoritoFrase.findOne({
    where: { usuarioId, fraseId },
  });

  return { fraseId, guardado: !!favorito };
}

async function adicionarFavorito(usuarioId, fraseId) {
  validarId(fraseId);

  return Frase.sequelize.transaction(async transaction => {
    const frase = await Frase.findOne({
      where: { id: fraseId, ativo: true },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!frase) throw criarErro('Frase não encontrada.', 404);

    const [, criado] = await FavoritoFrase.findOrCreate({
      where: { usuarioId, fraseId },
      transaction,
    });

    return {
      mensagem: criado
        ? 'Frase adicionada aos favoritos.'
        : 'A frase já está nos favoritos.',
      fraseId,
      guardado: true,
    };
  });
}

async function removerFavorito(usuarioId, fraseId) {
  validarId(fraseId);

  await FavoritoFrase.destroy({
    where: { usuarioId, fraseId },
  });

  return {
    mensagem: 'Frase removida dos favoritos.',
    fraseId,
    guardado: false,
  };
}

module.exports = {
  listarFavoritos,
  verificarFavorito,
  adicionarFavorito,
  removerFavorito,
};
