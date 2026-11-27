const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const {
  Usuario,
  Rol,
  Pais,
  Universidade,
} = require('../models');

// ============================================================
// INCLUDE PADRÃO
// ============================================================

const incluirDadosUsuario = [
  {
    model: Rol,
    as: 'rol',
    attributes: ['id', 'nome'],
  },
  {
    model: Pais,
    as: 'paisOrigem',
    attributes: ['id', 'nome'],
  },
  {
    model: Universidade,
    as: 'universidadeOrigem',
    attributes: ['id', 'nome'],
  },
  {
    model: Universidade,
    as: 'universidadeDestino',
    attributes: ['id', 'nome'],
  },
];

// ============================================================
// GERAR TOKEN
// ============================================================

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol?.nome || 'Estudante',
      versaoToken: usuario.versaoToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
}

// ============================================================
// FORMATAR USUÁRIO
// ============================================================

function formatarUsuario(usuario) {
  return {
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

    paisOrigem: usuario.paisOrigem
      ? {
        id: usuario.paisOrigem.id,
        nome: usuario.paisOrigem.nome,
      }
      : null,

    universidadeOrigem:
      usuario.universidadeOrigem
        ? {
          id: usuario.universidadeOrigem.id,
          nome: usuario.universidadeOrigem.nome,
        }
        : null,

    universidadeDestino:
      usuario.universidadeDestino
        ? {
          id: usuario.universidadeDestino.id,
          nome: usuario.universidadeDestino.nome,
        }
        : null,
  };
}

// ============================================================
// LOGIN
// ============================================================

async function fazerLogin({
  email,
  senha,
}) {
  if (!email || !senha) {
    const erro = new Error(
      'E-mail e senha são obrigatórios.'
    );

    erro.status = 400;
    throw erro;
  }

  const usuario =
    await Usuario.findOne({
      where: {
        email:
          email.trim().toLowerCase(),
      },

      include:
        incluirDadosUsuario,
    });

  if (!usuario) {
    const erro = new Error(
      'E-mail ou senha inválidos.'
    );

    erro.status = 401;
    throw erro;
  }

  if (!usuario.ativo) {
    const erro = new Error(
      'Usuário inativo.'
    );

    erro.status = 403;
    throw erro;
  }

  const senhaCorreta =
    await bcrypt.compare(
      senha,
      usuario.senhaHash
    );

  if (!senhaCorreta) {
    const erro = new Error(
      'E-mail ou senha inválidos.'
    );

    erro.status = 401;
    throw erro;
  }

  const token =
    gerarToken(usuario);

  return {
    token,
    usuario:
      formatarUsuario(usuario),
  };
}

// ============================================================
// CADASTRO
// ============================================================

async function cadastrarUsuario({
  nome,
  paisOrigemId,
  universidadeOrigemId,
  universidadeDestinoId,
  email,
  senha,
  idioma = 'pt-BR',
}) {
  const idiomasPermitidos = [
    'pt-BR',
    'es',
    'en',
  ];

  if (!idiomasPermitidos.includes(idioma)) {
    const erro = new Error('Idioma inválido.');

    erro.status = 400;
    throw erro;
  }
  if (
    !nome ||
    !paisOrigemId ||
    !universidadeOrigemId ||
    !universidadeDestinoId ||
    !email ||
    !senha
  ) {
    const erro = new Error(
      'Todos os campos são obrigatórios.'
    );

    erro.status = 400;
    throw erro;
  }

  if (senha.length < 6) {
    const erro = new Error(
      'A senha deve ter pelo menos 6 caracteres.'
    );

    erro.status = 400;
    throw erro;
  }

  const emailNormalizado =
    email.trim().toLowerCase();

  const usuarioExistente =
    await Usuario.findOne({
      where: {
        email: emailNormalizado,
      },
    });

  if (usuarioExistente) {
    const erro = new Error(
      'Já existe uma conta com este e-mail.'
    );

    erro.status = 409;
    throw erro;
  }

  const rolEstudante =
    await Rol.findOne({
      where: {
        nome: 'Estudante',
      },
    });

  if (!rolEstudante) {
    const erro = new Error(
      'Rol Estudante não encontrado.'
    );

    erro.status = 500;
    throw erro;
  }

  const paisOrigem =
    await Pais.findByPk(
      paisOrigemId
    );

  if (!paisOrigem) {
    const erro = new Error(
      'País de origem inválido.'
    );

    erro.status = 400;
    throw erro;
  }

  const universidadeOrigem =
    await Universidade.findByPk(
      universidadeOrigemId
    );

  if (!universidadeOrigem) {
    const erro = new Error(
      'Universidade de origem inválida.'
    );

    erro.status = 400;
    throw erro;
  }

  if (
    universidadeOrigem.paisId !==
    paisOrigem.id
  ) {
    const erro = new Error(
      'A universidade de origem não pertence ao país selecionado.'
    );

    erro.status = 400;
    throw erro;
  }

  const universidadeDestino =
    await Universidade.findByPk(
      universidadeDestinoId
    );

  if (!universidadeDestino) {
    const erro = new Error(
      'Universidade de destino inválida.'
    );

    erro.status = 400;
    throw erro;
  }

  if (
    universidadeDestino.cidade
      ?.trim()
      .toLowerCase() !==
    'chapecó'
  ) {
    const erro = new Error(
      'A universidade de destino deve estar localizada em Chapecó.'
    );

    erro.status = 400;
    throw erro;
  }

  const senhaHash =
    await bcrypt.hash(
      senha,
      10
    );

  const novoUsuario =
    await Usuario.create({
      rolId:
        rolEstudante.id,

      nomeCompleto:
        nome.trim(),

      email:
        emailNormalizado,

      senhaHash,

      paisOrigemId:
        paisOrigem.id,

      universidadeOrigemId:
        universidadeOrigem.id,

      universidadeDestinoId:
        universidadeDestino.id,

      fotoUrl:
        null,

      idioma,

      tema:
        'claro',

      ativo:
        true,
    });

  const usuarioCompleto =
    await Usuario.findByPk(
      novoUsuario.id,
      {
        include:
          incluirDadosUsuario,
      }
    );

  const token =
    gerarToken(
      usuarioCompleto
    );

  return {
    token,
    usuario:
      formatarUsuario(
        usuarioCompleto
      ),
  };
}

// ============================================================
// BUSCAR USUÁRIO AUTENTICADO
// ============================================================

async function buscarUsuarioAutenticado(
  usuarioId
) {
  const usuario =
    await Usuario.findByPk(
      usuarioId,
      {
        include:
          incluirDadosUsuario,
      }
    );

  if (!usuario) {
    const erro = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;
    throw erro;
  }

  return formatarUsuario(
    usuario
  );
}

// ============================================================
// ATUALIZAR PERFIL
// ============================================================

async function atualizarPerfil(
  usuarioId,
  {
    nome,
    paisOrigemId,
    universidadeOrigemId,
    universidadeDestinoId,
    email,
  }
) {
  if (
    !nome ||
    !paisOrigemId ||
    !universidadeOrigemId ||
    !universidadeDestinoId ||
    !email
  ) {
    const erro = new Error(
      'Todos os campos são obrigatórios.'
    );

    erro.status = 400;
    throw erro;
  }

  const usuario =
    await Usuario.findByPk(
      usuarioId
    );

  if (!usuario) {
    const erro = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;
    throw erro;
  }

  const emailNormalizado =
    email.trim().toLowerCase();

  // ----------------------------------------------------------
  // VERIFICAR E-MAIL DE OUTRO USUÁRIO
  // ----------------------------------------------------------

  const usuarioComEmail =
    await Usuario.findOne({
      where: {
        email:
          emailNormalizado,

        id: {
          [Op.ne]:
            usuarioId,
        },
      },
    });

  if (usuarioComEmail) {
    const erro = new Error(
      'Já existe uma conta com este e-mail.'
    );

    erro.status = 409;
    throw erro;
  }

  // ----------------------------------------------------------
  // VALIDAR PAÍS
  // ----------------------------------------------------------

  const paisOrigem =
    await Pais.findByPk(
      paisOrigemId
    );

  if (!paisOrigem) {
    const erro = new Error(
      'País de origem inválido.'
    );

    erro.status = 400;
    throw erro;
  }

  // ----------------------------------------------------------
  // VALIDAR UNIVERSIDADE DE ORIGEM
  // ----------------------------------------------------------

  const universidadeOrigem =
    await Universidade.findByPk(
      universidadeOrigemId
    );

  if (!universidadeOrigem) {
    const erro = new Error(
      'Universidade de origem inválida.'
    );

    erro.status = 400;
    throw erro;
  }

  if (
    universidadeOrigem.paisId !==
    paisOrigem.id
  ) {
    const erro = new Error(
      'A universidade de origem não pertence ao país selecionado.'
    );

    erro.status = 400;
    throw erro;
  }

  // ----------------------------------------------------------
  // VALIDAR UNIVERSIDADE DE DESTINO
  // ----------------------------------------------------------

  const universidadeDestino =
    await Universidade.findByPk(
      universidadeDestinoId
    );

  if (!universidadeDestino) {
    const erro = new Error(
      'Universidade de destino inválida.'
    );

    erro.status = 400;
    throw erro;
  }

  if (
    universidadeDestino.cidade
      ?.trim()
      .toLowerCase() !==
    'chapecó'
  ) {
    const erro = new Error(
      'A universidade de destino deve estar localizada em Chapecó.'
    );

    erro.status = 400;
    throw erro;
  }

  // ----------------------------------------------------------
  // ATUALIZAR
  // ----------------------------------------------------------

  await usuario.update({
    nomeCompleto:
      nome.trim(),

    email:
      emailNormalizado,

    paisOrigemId:
      paisOrigem.id,

    universidadeOrigemId:
      universidadeOrigem.id,

    universidadeDestinoId:
      universidadeDestino.id,
  });

  const usuarioAtualizado =
    await Usuario.findByPk(
      usuarioId,
      {
        include:
          incluirDadosUsuario,
      }
    );

  return formatarUsuario(
    usuarioAtualizado
  );
}

module.exports = {
  fazerLogin,
  cadastrarUsuario,
  buscarUsuarioAutenticado,
  atualizarPerfil,
};