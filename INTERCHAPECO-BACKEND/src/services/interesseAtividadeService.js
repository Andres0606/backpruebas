
// SERVICE — Interesses em atividades

const {
  Atividade,
  InteresseAtividade,
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
// CONTAR INTERESSADOS
// ============================================================

async function contarInteressados(
  atividadeId,
  transaction
) {
  return InteresseAtividade.count({
    where: {
      atividadeId,
    },
    transaction,
  });
}

// ============================================================
// VERIFICAR INTERESSE
// ============================================================

async function verificarInteresse(
  usuarioId,
  atividadeId
) {
  return Atividade.sequelize.transaction(
    async (transaction) => {

      await verificarAtividade(
        atividadeId,
        transaction
      );

      const interesse =
        await InteresseAtividade.findOne({
          where: {
            usuarioId,
            atividadeId,
          },
          transaction,
        });

      return {
        atividadeId,

        interessado: !!interesse,

        interessados:
          await contarInteressados(
            atividadeId,
            transaction
          ),
      };
    }
  );
}

// ============================================================
// ADICIONAR INTERESSE
// ============================================================

async function adicionarInteresse(
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
        await InteresseAtividade.findOrCreate({
          where: {
            usuarioId,
            atividadeId,
          },
          transaction,
        });

      return {
        mensagem: criado
          ? 'Interesse registrado com sucesso.'
          : 'Você já demonstrou interesse nesta atividade.',

        atividadeId,

        interessado: true,

        interessados:
          await contarInteressados(
            atividadeId,
            transaction
          ),
      };
    }
  );
}

// ============================================================
// REMOVER INTERESSE
// ============================================================

async function removerInteresse(
  usuarioId,
  atividadeId
) {
  return Atividade.sequelize.transaction(
    async (transaction) => {

      await verificarAtividade(
        atividadeId,
        transaction
      );

      await InteresseAtividade.destroy({
        where: {
          usuarioId,
          atividadeId,
        },
        transaction,
      });

      return {
        mensagem:
          'Interesse removido com sucesso.',

        atividadeId,

        interessado: false,

        interessados:
          await contarInteressados(
            atividadeId,
            transaction
          ),
      };
    }
  );
}

module.exports = {
  verificarInteresse,
  adicionarInteresse,
  removerInteresse,
};
