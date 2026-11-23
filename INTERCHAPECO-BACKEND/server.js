require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();

    console.log('Conectado ao Supabase com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar servidor:');
    console.error(erro);
  }
}

iniciarServidor();