
// SERVICE — Curtidas em conselhos

const { Conselho, CurtidaConselho } = require('../models');
const { buscarConselho } = require('./conselhoService');

async function contarCurtidas(conselhoId, transaction) {
  return CurtidaConselho.count({
    where: { conselhoId },
    transaction,
  });
}

// Verificar curtida
async function verificarCurtida(usuarioId, conselhoId) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const curtida = await CurtidaConselho.findOne({
      where: { usuarioId, conselhoId },
      transaction,
    });

    return {
      conselhoId,
      curtido: !!curtida,
      curtidas: await contarCurtidas(conselhoId, transaction),
    };
  });
}

// Adicionar curtida
async function adicionarCurtida(usuarioId, conselhoId) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const [, criado] = await CurtidaConselho.findOrCreate({
      where: { usuarioId, conselhoId },
      transaction,
    });

    return {
      mensagem: criado
        ? 'Curtida registrada com sucesso.'
        : 'Você já curtiu este conselho.',
      conselhoId,
      curtido: true,
      curtidas: await contarCurtidas(conselhoId, transaction),
    };
  });
}

// Remover curtida
async function removerCurtida(usuarioId, conselhoId) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    await CurtidaConselho.destroy({
      where: { usuarioId, conselhoId },
      transaction,
    });

    return {
      mensagem: 'Curtida removida com sucesso.',
      conselhoId,
      curtido: false,
      curtidas: await contarCurtidas(conselhoId, transaction),
    };
  });
}

module.exports = {
  verificarCurtida,
  adicionarCurtida,
  removerCurtida,
};
