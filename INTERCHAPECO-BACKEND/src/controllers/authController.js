const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Usuario, Rol } = require('../models');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'E-mail e senha são obrigatórios.',
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        email: email.toLowerCase(),
      },

      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['id', 'nome'],
        },
      ],
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        mensagem: 'Usuário inativo.',
      });
    }

    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senhaHash
      );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol?.nome,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      token,

      usuario: {
        id: usuario.id,
        nome: usuario.nomeCompleto,
        email: usuario.email,
        fotoUrl: usuario.fotoUrl,
        idioma: usuario.idioma,
        tema: usuario.tema,

        rol: usuario.rol
          ? {
              id: usuario.rol.id,
              nome: usuario.rol.nome,
            }
          : null,
      },
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);

    return res.status(500).json({
      mensagem: 'Erro ao realizar login.',
    });
  }
}
async function obterUsuarioAutenticado(
  req,
  res
) {
  try {
    const usuario =
      await Usuario.findByPk(
        req.usuario.id,
        {
          include: [
            {
              model: Rol,
              as: 'rol',
              attributes: [
                'id',
                'nome',
              ],
            },
          ],
        }
      );

    if (!usuario) {
      return res.status(404).json({
        mensagem:
          'Usuário não encontrado.',
      });
    }

    return res.status(200).json({
      usuario: {
        id: usuario.id,
        nome: usuario.nomeCompleto,
        email: usuario.email,
        fotoUrl: usuario.fotoUrl,
        idioma: usuario.idioma,
        tema: usuario.tema,
        rol: usuario.rol,
      },
    });
  } catch (erro) {
    console.error(
      'Erro ao buscar usuário autenticado:',
      erro
    );

    return res.status(500).json({
      mensagem:
        'Erro ao buscar usuário.',
    });
  }
}
module.exports = {
  login,
  obterUsuarioAutenticado,
};