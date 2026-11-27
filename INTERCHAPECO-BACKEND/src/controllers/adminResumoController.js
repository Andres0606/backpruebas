// CONTROLLER — Resumo administrativo

const { obterResumo } = require('../services/adminResumoService');
const { executar } = require('../utils/respostaAdmin');

module.exports = {
  obter: executar(() => obterResumo()),
};