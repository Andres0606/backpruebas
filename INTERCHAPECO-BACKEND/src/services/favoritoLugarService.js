// SERVICE — Favoritos de lugares

const {
  FavoritoLugar,
  Lugar,
  CategoriaLugar,
} = require('../models');

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

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

// ============================================================
// LISTAR FAVORITOS
// ============================================================

async function listarFavoritos(usuarioId) {
  const favoritos = await FavoritoLugar.findAll({
    where: {
      usuarioId,
    },

    include: [
      {
        model: Lugar,
        as: 'lugar',
        required: true,

        where: {
          ativo: true,
        },

        include: [
          {
            model: CategoriaLugar,
            as: 'categoria',
            attributes: ['id', 'nome'],
          },
        ],
      },
    ],

    order: [['criadoEm', 'DESC']],
  });

  return favoritos.map((favorito) => {
    const lugar = favorito.lugar.toJSON();

    return {
      ...lugar,

      latitude:
        lugar.latitude === null
          ? null
          : Number(lugar.latitude),

      longitude:
        lugar.longitude === null
          ? null
          : Number(lugar.longitude),

      guardado: true,

      guardadoEm: favorito.criadoEm,
    };
  });
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

async function verificarFavorito(
  usuarioId,
  lugarId
) {
  validarId(lugarId);

  const favorito =
    await FavoritoLugar.findOne({
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

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

async function adicionarFavorito(
  usuarioId,
  lugarId
) {
  validarId(lugarId);

  const lugar = await Lugar.findOne({
    where: {
      id: lugarId,
      ativo: true,
    },
  });

  if (!lugar) {
    throw criarErro(
      'Lugar não encontrado.',
      404
    );
  }

  const [, criado] =
    await FavoritoLugar.findOrCreate({
      where: {
        usuarioId,
        lugarId,
      },
    });

  return {
    mensagem: criado
      ? 'Lugar adicionado aos favoritos.'
      : 'O lugar já está nos favoritos.',

    lugarId,

    guardado: true,
  };
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

async function removerFavorito(
  usuarioId,
  lugarId
) {
  validarId(lugarId);

  await FavoritoLugar.destroy({
    where: {
      usuarioId,
      lugarId,
    },
  });

  return {
    mensagem:
      'Lugar removido dos favoritos.',

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