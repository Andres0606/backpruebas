// MIDDLEWARE — Limite de solicitações de recuperação

const { rateLimit } = require('express-rate-limit');

// ============================================================
// LIMITE DE SOLICITAÇÕES
// ============================================================

const limitarSolicitacoes = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: 'draft-7',

  legacyHeaders: false,

  message: {
    mensagem:
      'Muitas solicitações. Tente novamente em 15 minutos.',
  },
});

// ============================================================
// LIMITE DE TENTATIVAS DE REDEFINIÇÃO
// ============================================================

const limitarRedefinicoes = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: 'draft-7',

  legacyHeaders: false,

  message: {
    mensagem:
      'Muitas tentativas. Tente novamente em 15 minutos.',
  },
});

module.exports = {
  limitarSolicitacoes,
  limitarRedefinicoes,
};