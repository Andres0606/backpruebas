const express = require('express');
const cors = require('cors');

const rolRoutes =
  require('./routes/rolRoutes');

const authRoutes =
  require('./routes/authRoutes');

const paisRoutes =
  require('./routes/paisRoutes');

const universidadeRoutes =
  require(
    './routes/universidadeRoutes'
  );

const configuracaoRoutes =
  require('./routes/configuracaoRoutes');  

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================
// ROTA INICIAL
// ============================================================

app.get('/', (req, res) => {
  res.json({
    mensagem:
      'API InterChapecó funcionando.',
  });
});

// ============================================================
// ROTAS
// ============================================================

app.use(
  '/roles',
  rolRoutes
);

app.use(
  '/auth',
  authRoutes
);

app.use(
  '/paises',
  paisRoutes
);

app.use(
  '/universidades',
  universidadeRoutes
);

app.use(
  '/configuracoes',
  configuracaoRoutes
);

module.exports = app;