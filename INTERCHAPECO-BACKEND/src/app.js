const express = require('express');
const cors = require('cors');

const rolRoutes =
  require('./routes/rolRoutes');

const authRoutes =
  require('./routes/authRoutes');

const adminRoutes =
  require('./routes/adminRoutes');

const paisRoutes =
  require('./routes/paisRoutes');

const universidadeRoutes =
  require(
    './routes/universidadeRoutes'
  );

const configuracaoRoutes =
  require('./routes/configuracaoRoutes');  

const lugarRoutes =
  require('./routes/lugarRoutes');

const categoriaLugarRoutes =
  require('./routes/categoriaLugarRoutes');

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

app.use(
  '/admin',
  adminRoutes
);

app.use(
  '/lugares',
  lugarRoutes
);

app.use(
  '/categorias-lugar',
  categoriaLugarRoutes
);

module.exports = app;