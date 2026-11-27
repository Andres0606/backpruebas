// MIDDLEWARE — Proteção contra tentativas de login

const { rateLimit } = require('express-rate-limit');

const limitarTentativasLogin = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: 'draft-7',

  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    mensagem:
      'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
});

module.exports = {
  limitarTentativasLogin,
};