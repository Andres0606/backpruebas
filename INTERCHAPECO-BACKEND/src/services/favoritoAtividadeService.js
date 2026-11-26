
// SERVICE — Favoritos de atividades

const {
  Atividade,
  FavoritoAtividade,
  CategoriaAtividade,
  Usuario,
} = require('../models');

const {
  formatarAtividade,
} = require('./atividadeService');

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
    throw criarErro(
      'Identificador inválido.'
    );
  }
}

// ============================================================
// VERIFICAR ATIVIDADE
// ============================================================

async function verificarAtividade(
  atividadeId,
  transaction
) {
  validarId(atividadeId);

  const atividade =
    await Atividade.findOne({
      where: {
        id: atividadeId,
        ativo: true,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

  if (!atividade) {
    throw criarErro(
      'Atividade não encontrada.',
      404
    );
  }

  return atividade;
}

// ============================================================
// LISTAR FAVORITOS
// ============================================================

async function listarFavoritos(usuarioId) {
  const favoritos =
    await FavoritoAtividade.findAll({
      where: {
        usuarioId,
      },

      include: [
        {
          model: Atividade,
          as: 'atividade',
          required: true,

          where: {
            ativo: true,
          },

          include: [
            {
              model: CategoriaAtividade,
              as: 'categoria',
              attributes: ['id', 'nome'],
            },
            {
              model: Usuario,
              as: 'criador',
              attributes: [
                'id',
                'nomeCompleto',
                'fotoUrl',
              ],
            },
          ],
        },
      ],

      order: [['criadoEm', 'DESC']],
    });

  return Promise.all(
    favoritos.map(async (favorito) => {
      const atividade =
        await formatarAtividade(
          favorito.atividade,
          usuarioId
        );

      return {
        ...atividade,

        guardado: true,

        guardadoEm: favorito.criadoEm,
      };
    })
  );
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

async function verificarFavorito(
  usuarioId,
  atividadeId
) {
  return Atividade.sequelize.transaction(
    async (transaction) => {

      await verificarAtividade(
        atividadeId,
        transaction
      );

      const favorito =
        await FavoritoAtividade.findOne({
          where: {
            usuarioId,
            atividadeId,
          },
          transaction,
        });

      return {
        atividadeId,
        guardado: !!favorito,
      };
    }
  );
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

async function adicionarFavorito(
  usuarioId,
  atividadeId
) {
  return Atividade.sequelize.transaction(
    async (transaction) => {

      await verificarAtividade(
        atividadeId,
        transaction
      );

      const [, criado] =
        await FavoritoAtividade.findOrCreate({
          where: {
            usuarioId,
            atividadeId,
          },
          transaction,
        });

      return {
        mensagem: criado
          ? 'Atividade adicionada aos favoritos.'
          : 'A atividade já está nos favoritos.',

        atividadeId,

        guardado: true,
      };
    }
  );
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

async function removerFavorito(
  usuarioId,
  atividadeId
) {
  return Atividade.sequelize.transaction(
    async (transaction) => {

      await verificarAtividade(
        atividadeId,
        transaction
      );

      await FavoritoAtividade.destroy({
        where: {
          usuarioId,
          atividadeId,
        },
        transaction,
      });

      return {
        mensagem:
          'Atividade removida dos favoritos.',

        atividadeId,

        guardado: false,
      };
    }
  );
}

module.exports = {
  listarFavoritos,
  verificarFavorito,
  adicionarFavorito,
  removerFavorito,
};
