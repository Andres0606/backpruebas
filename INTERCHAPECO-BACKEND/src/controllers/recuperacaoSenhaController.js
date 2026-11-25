// CONTROLLER — Recuperação de senha

const {
  solicitarRecuperacao,
  redefinirSenha,
} = require('../services/recuperacaoSenhaService');

// ============================================================
// SOLICITAR RECUPERAÇÃO
// ============================================================

async function solicitar(req, res) {
  try {
    const resultado =
      await solicitarRecuperacao(req.body);

    return res.status(200).json(resultado);

  } catch (erro) {
    console.error(
      'Erro ao solicitar recuperação:',
      erro.status || 500
    );

    return res
      .status(erro.status || 500)
      .json({
        mensagem: erro.status
          ? erro.message
          : 'Não foi possível solicitar a recuperação.',
      });
  }
}

// ============================================================
// REDEFINIR SENHA
// ============================================================

async function redefinir(req, res) {
  try {
    const resultado =
      await redefinirSenha(req.body);

    return res.status(200).json(resultado);

  } catch (erro) {
    console.error(
      'Erro ao redefinir senha:',
      erro.status || 500
    );

    return res
      .status(erro.status || 500)
      .json({
        mensagem: erro.status
          ? erro.message
          : 'Não foi possível redefinir a senha.',
      });
  }
}

module.exports = {
  solicitar,
  redefinir,
};