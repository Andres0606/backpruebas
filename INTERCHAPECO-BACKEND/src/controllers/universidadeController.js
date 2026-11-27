const {
  Universidade,
  Pais,
} = require('../models');

// ============================================================
// LISTAR UNIVERSIDADES
// ============================================================

async function listarUniversidades(
  req,
  res
) {
  try {
    const {
      paisId,
      cidade,
    } = req.query;

    const where = {};

    if (paisId) {
      where.paisId =
        paisId;
    }

    if (cidade) {
      where.cidade =
        cidade;
    }

    const universidades =
      await Universidade.findAll({
        where,

        attributes: [
          'id',
          'nome',
          'cidade',
          'estado',
          'paisId',
        ],

        include: [
          {
            model: Pais,
            as: 'pais',
            attributes: [
              'id',
              'nome',
              'codigoIso',
            ],
          },
        ],

        order: [
          ['nome', 'ASC'],
        ],
      });

    return res.status(200).json(
      universidades
    );
  } catch (erro) {
    console.error(
      'Erro ao listar universidades:',
      erro.name
    );

    return res.status(500).json({
      mensagem:
        'Erro ao listar universidades.',
    });
  }
}

module.exports = {
  listarUniversidades,
};