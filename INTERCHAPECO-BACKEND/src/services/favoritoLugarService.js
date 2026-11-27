
// SERVICE — Favoritos de lugares

const {
  FavoritoLugar,
  Lugar,
  CategoriaLugar,
} = require('../models');

// Funções auxiliares

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarId(id) {
  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw criarErro('Identificador inválido.');
  }
}

async function verificarLugar(lugarId, transaction) {
  validarId(lugarId);

  const lugar = await Lugar.findOne({
    where: {
      id: lugarId,
      ativo: true,
    },
    ...(transaction ? {
      transaction,
      lock: transaction.LOCK.UPDATE,
    } : {}),
  });

  if (!lugar) {
    throw criarErro('Lugar não encontrado.', 404);
  }

  return lugar;
}

// Listar favoritos

async function listarFavoritos(usuarioId) {
  const favoritos = await FavoritoLugar.findAll({
    where: { usuarioId },

    include: [{
      model: Lugar,
      as: 'lugar',
      required: true,
      where: { ativo: true },

      include: [{
        model: CategoriaLugar,
        as: 'categoria',
        attributes: ['id', 'nome'],
      }],
    }],

    order: [['criadoEm', 'DESC']],
  });

  return favoritos.map(favorito => {
    const lugar = favorito.lugar.toJSON();

    return {
      ...lugar,

      latitude: lugar.latitude === null
        ? null : Number(lugar.latitude),

      longitude: lugar.longitude === null
        ? null : Number(lugar.longitude),

      guardado: true,
      guardadoEm: favorito.criadoEm,
    };
  });
}

// Verificar favorito

async function verificarFavorito(usuarioId, lugarId) {
  await verificarLugar(lugarId);

  const favorito = await FavoritoLugar.findOne({
    where: {
      usuarioId,
      lugarId,
    },
  });

  return {
    lugarId,
    guardado: !!favorito,
  };
}

// Adicionar favorito

async function adicionarFavorito(usuarioId, lugarId) {
  return Lugar.sequelize.transaction(async transaction => {
    await verificarLugar(lugarId, transaction);

    const [, criado] = await FavoritoLugar.findOrCreate({
      where: {
        usuarioId,
        lugarId,
      },
      transaction,
    });

    return {
      mensagem: criado
        ? 'Lugar adicionado aos favoritos.'
        : 'O lugar já está nos favoritos.',

      lugarId,
      guardado: true,
    };
  });
}

// Remover favorito

async function removerFavorito(usuarioId, lugarId) {
  validarId(lugarId);

  await FavoritoLugar.destroy({
    where: {
      usuarioId,
      lugarId,
    },
  });

  return {
    mensagem: 'Lugar removido dos favoritos.',
    lugarId,
    guardado: false,
  };
}

module.exports = {
  listarFavoritos,
  verificarFavorito,
  adicionarFavorito,
  removerFavorito,
};
