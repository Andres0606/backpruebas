const express = require('express');
const cors = require('cors');
const tarefaRoutes = require('./routes/tarefaRoutes');

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

const favoritoLugarRoutes =
  require('./routes/favoritoLugarRoutes');

const categoriaAtividadeRoutes =
  require('./routes/categoriaAtividadeRoutes');

const atividadeRoutes =
  require('./routes/atividadeRoutes');

const favoritoAtividadeRoutes =
  require('./routes/favoritoAtividadeRoutes');

const categoriaConselhoRoutes =
  require('./routes/categoriaConselhoRoutes');

const conselhoRoutes =
  require('./routes/conselhoRoutes');

const gastoRoutes = require('./routes/gastoRoutes');

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

app.use(
  '/favoritos/lugares',
  favoritoLugarRoutes
);

app.use(
  '/categorias-atividade',
  categoriaAtividadeRoutes
);

app.use(
  '/atividades',
  atividadeRoutes
);

app.use(
  '/favoritos/atividades',
  favoritoAtividadeRoutes
);

app.use(
  '/categorias-conselho',
  categoriaConselhoRoutes
);

app.use('/conselhos', conselhoRoutes);

app.use('/conselhos', conselhoRoutes);
app.use('/tarefas', tarefaRoutes);
app.use('/gastos', gastoRoutes);

module.exports = app;

module.exports = app;

app.use('/tarefas', tarefaRoutes);