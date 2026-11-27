
// SERVICE — Gerenciamento administrativo de usuários

const { Usuario, Rol, Pais, Universidade } = require('../models');

const {
  criarErro, validarId, validarEstado,
  normalizarTexto, validarBusca, filtroEstado,
} = require('../utils/admin');

const atributos = [
  'id', 'nomeCompleto', 'email', 'fotoUrl',
  'ativo', 'criado_em', 'atualizado_em',
];

const relacionamentos = [
  { model: Rol, as: 'rol', attributes: ['id', 'nome'] },
  { model: Pais, as: 'paisOrigem', attributes: ['id', 'nome'] },
  { model: Universidade, as: 'universidadeOrigem', attributes: ['id', 'nome'] },
  { model: Universidade, as: 'universidadeDestino', attributes: ['id', 'nome'] },
];

function formatarUsuario(usuario) {
  const dados = usuario.toJSON();

  return {
    ...dados,
    nome: dados.nomeCompleto,
  };
}

async function listarUsuarios({ busca, estado, rol } = {}) {
  const termo = validarBusca(busca);

  const where = filtroEstado(estado);

  if (rol !== undefined &&
      !['todos', 'Administrador', 'Estudante'].includes(rol)) {
    throw criarErro('Perfil de acesso inválido.');
  }

  const usuarios = await Usuario.findAll({
    attributes: atributos,
    where,
    include: relacionamentos,
    order: [['nomeCompleto', 'ASC'], ['id', 'ASC']],
  });

  return usuarios
    .filter(usuario =>
      !rol || rol === 'todos' || usuario.rol?.nome === rol
    )
    .filter(usuario =>
      !termo ||
      normalizarTexto(usuario.nomeCompleto).includes(termo) ||
      normalizarTexto(usuario.email).includes(termo) ||
      normalizarTexto(usuario.paisOrigem?.nome).includes(termo) ||
      normalizarTexto(usuario.universidadeDestino?.nome).includes(termo)
    )
    .map(formatarUsuario);
}

async function obterUsuario(id) {
  validarId(id);

  const usuario = await Usuario.findByPk(id, {
    attributes: atributos,
    include: relacionamentos,
  });

  if (!usuario) {
    throw criarErro('Usuário não encontrado.', 404);
  }

  return formatarUsuario(usuario);
}

async function atualizarEstadoUsuario(id, administradorId, ativo) {
  validarId(id);
  validarEstado(ativo);

  if (id === administradorId) {
    throw criarErro('Não é possível alterar o estado da própria conta.', 403);
  }

  await Usuario.sequelize.transaction(async transaction => {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'rolId', 'ativo', 'versaoToken'],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!usuario) {
      throw criarErro('Usuário não encontrado.', 404);
    }

    const rol = await Rol.findByPk(usuario.rolId, { transaction });

    if (rol?.nome !== 'Estudante') {
      throw criarErro('Não é possível alterar contas administrativas.', 403);
    }

    if (usuario.ativo !== ativo) {
      await usuario.increment('versaoToken', {
        by: 1,
        transaction,
      });

      await usuario.update({ ativo }, { transaction });
    }
  });

  return obterUsuario(id);
}

module.exports = {
  listarUsuarios,
  obterUsuario,
  atualizarEstadoUsuario,
};
