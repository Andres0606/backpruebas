const { Pais } = require('../models');

// ============================================================
// LISTAR PAÍSES
// ============================================================

async function listarPaises(req, res) {
  try {
    const paises = await Pais.findAll({
      attributes: [
        'id',
        'nome',
        'codigoIso',
      ],

      order: [
        ['nome', 'ASC'],
      ],
    });

    return res.status(200).json(
      paises
    );
  } catch (erro) {
    console.error(
      'Erro ao listar países:',
      erro
    );

    return res.status(500).json({
      mensagem:
        'Erro ao listar países.',
    });
  }
}

module.exports = {
  listarPaises,
};