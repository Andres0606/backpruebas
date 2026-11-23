const { Rol } = require('../models');

async function listarRoles(req, res) {
  try {
    const roles = await Rol.findAll({
      order: [['nome', 'ASC']],
    });

    return res.status(200).json(roles);
  } catch (erro) {
    console.error('Erro ao buscar roles:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao buscar roles.',
    });
  }
}

module.exports = {
  listarRoles,
};