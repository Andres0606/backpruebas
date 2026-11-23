require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./src/config/database');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API InterChapecó funcionando.',
  });
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();

    console.log('Conectado ao Supabase com sucesso.');

    app.listen(PORT, () => {
      console.log(
        `Servidor rodando em http://localhost:${PORT}`
      );
    });
  } catch (erro) {
    console.error('Erro ao conectar ao Supabase:');
    console.error(erro);
  }
}

iniciarServidor();