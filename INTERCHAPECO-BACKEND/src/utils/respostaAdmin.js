// UTILS — Respostas administrativas

function executar(acao, status = 200) {
  return async (req, res) => {
    try {
      const resultado = await acao(req);

      return res.status(status).json(resultado);
    } catch (erro) {
      if (Number.isInteger(erro.status) &&
          erro.status >= 400 && erro.status < 500) {
        return res.status(erro.status).json({
          mensagem: erro.message,
        });
      }

      if (erro.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          mensagem: 'Já existe um registro com esses dados.',
        });
      }

      if (erro.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          mensagem: 'Não foi possível concluir devido aos relacionamentos.',
        });
      }

      if (erro.name === 'SequelizeValidationError') {
        return res.status(400).json({
          mensagem: 'Dados inválidos.',
        });
      }

      console.error('Erro administrativo:', erro.name);

      return res.status(500).json({
        mensagem: 'Não foi possível processar a solicitação.',
      });
    }
  };
}

module.exports = { executar };