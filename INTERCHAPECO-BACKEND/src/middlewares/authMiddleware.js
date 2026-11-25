// MIDDLEWARE — Autenticação do usuário

const jwt = require('jsonwebtoken');

const {
  Usuario,
  Rol,
} = require('../models');

async function autenticar(req, res, next) {
  try {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
      return res.status(401).json({
        mensagem: 'Token não informado.',
      });
    }

    const partes = cabecalho.split(' ');

    if (
      partes.length !== 2 ||
      partes[0] !== 'Bearer'
    ) {
      return res.status(401).json({
        mensagem: 'Token inválido.',
      });
    }

    const token = partes[1];

    const dados = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ========================================================
    // VERIFICAR USUÁRIO E ROL ATUAL
    // ========================================================

    const usuario = await Usuario.findByPk(
      dados.id,
      {
        attributes: [
          'id',
          'ativo',
          'versaoToken',
        ],

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
      return res.status(401).json({
        mensagem: 'Usuário não encontrado.',
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        mensagem: 'Usuário inativo.',
      });
    }

    // ========================================================
    // VERIFICAR VERSÃO DO TOKEN
    // ========================================================

    if (
      dados.versaoToken !== usuario.versaoToken
    ) {
      return res.status(401).json({
        mensagem:
          'Sessão expirada. Faça login novamente.',
      });
    }

    // ========================================================
    // VERIFICAR ROL DO USUÁRIO
    // ========================================================

    if (
      !usuario.rol ||
      !['Administrador', 'Estudante'].includes(
        usuario.rol.nome
      )
    ) {
      return res.status(403).json({
        mensagem: 'Perfil de acesso inválido.',
      });
    }

    // Utiliza os dados atuais do banco de dados.

    req.usuario = {
      id: usuario.id,
      rol: usuario.rol.nome,
      rolId: usuario.rol.id,
      versaoToken: usuario.versaoToken,
    };

    next();

  } catch (erro) {

    if (
      erro.name === 'JsonWebTokenError' ||
      erro.name === 'TokenExpiredError' ||
      erro.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        mensagem:
          'Token inválido ou expirado.',
      });
    }

    console.error(
      'Erro ao verificar autenticação.'
    );

    return res.status(500).json({
      mensagem:
        'Não foi possível verificar a autenticação.',
    });
  }
}

module.exports = {
  autenticar,
};