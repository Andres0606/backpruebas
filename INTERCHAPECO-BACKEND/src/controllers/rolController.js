const { Rol } = require('../models');

// LISTAR TODOS
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

// BUSCAR POR ID
async function obterRol(req, res) {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        mensagem: 'Rol não encontrado.',
      });
    }

    return res.status(200).json(rol);
  } catch (erro) {
    console.error('Erro ao buscar rol:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao buscar rol.',
    });
  }
}

// CRIAR
async function criarRol(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        mensagem: 'O nome do rol é obrigatório.',
      });
    }

    const novoRol = await Rol.create({
      nome: nome.trim(),
    });

    return res.status(201).json(novoRol);
  } catch (erro) {
    console.error('Erro ao criar rol:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao criar rol.',
    });
  }
}

// ATUALIZAR
async function atualizarRol(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        mensagem: 'Rol não encontrado.',
      });
    }

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        mensagem: 'O nome do rol é obrigatório.',
      });
    }

    await rol.update({
      nome: nome.trim(),
    });

    return res.status(200).json(rol);
  } catch (erro) {
    console.error('Erro ao atualizar rol:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao atualizar rol.',
    });
  }
}

// EXCLUIR
async function excluirRol(req, res) {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        mensagem: 'Rol não encontrado.',
      });
    }

    await rol.destroy();

    return res.status(200).json({
      mensagem: 'Rol excluído com sucesso.',
    });
  } catch (erro) {
    console.error('Erro ao excluir rol:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao excluir rol.',
    });
  }
}

module.exports = {
  listarRoles,
  obterRol,
  criarRol,
  atualizarRol,
  excluirRol,
};