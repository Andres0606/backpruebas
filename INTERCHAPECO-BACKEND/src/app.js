const express = require('express');
const cors = require('cors');

const rolRoutes = require('./routes/rolRoutes');

const app = express();

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// ROTA INICIAL
// ============================================================

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API InterChapecó funcionando.',
  });
});

// ============================================================
// ROTAS
// ============================================================

app.use('/roles', rolRoutes);

module.exports = app;