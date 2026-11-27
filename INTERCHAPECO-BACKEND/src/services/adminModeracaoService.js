
// SERVICE — Moderação de conteúdos

const {
  Conselho,
  CategoriaConselho,
  ComentarioConselho,
  Atividade,
  CategoriaAtividade,
  Usuario,
  Pais,
} = require('../models');

const { formatarConselho } = require('./conselhoService');
const { formatarAtividade } = require('./atividadeService');

const {
  criarErro,
  validarId,
  validarEstado,
  normalizarTexto,
  validarBusca,
  filtroEstado,
} = require('../utils/admin');

const autor = ['id', 'nomeCompleto', 'fotoUrl'];

const TIPOS = {
  conselhos: {
    model: Conselho,
    include: [
      {
        model: CategoriaConselho,
        as: 'categoria',
        attributes: ['id', 'nome'],
      },
      {
        model: Usuario,
        as: 'autor',
        attributes: autor,
        include: [{
          model: Pais,
          as: 'paisOrigem',
          attributes: ['id', 'nome'],
        }],
      },
    ],
    formatar: formatarConselho,
  },

  atividades: {
    model: Atividade,
    include: [
      {
        model: CategoriaAtividade,
        as: 'categoria',
        attributes: ['id', 'nome'],
      },
      {
        model: Usuario,
        as: 'criador',
        attributes: autor,
      },
    ],
    formatar: formatarAtividade,
  },
};

function obterTipo(tipo) {
  if (!Object.prototype.hasOwnProperty.call(TIPOS, tipo)) {
    throw criarErro('Tipo de conteúdo inválido.', 404);
  }

  return TIPOS[tipo];
}

async function listarConteudos(
  tipo, administradorId, { busca, estado, categoriaId } = {}
) {
  const config = obterTipo(tipo);
  const termo = validarBusca(busca);
  const where = filtroEstado(estado);

  if (categoriaId !== undefined) {
    where.categoriaId = validarId(categoriaId);
  }

  const registros = await config.model.findAll({
    where,
    include: config.include,
    order: [['criado_em', 'DESC'], ['id', 'ASC']],
  });

  const filtrados = registros.filter(item =>
    !termo ||
    [
      item.titulo,
      item.nome,
      item.conteudo,
      item.descricao,
      item.local,
      item.autor?.nomeCompleto,
      item.criador?.nomeCompleto,
      item.categoria?.nome,
    ].some(valor =>
      normalizarTexto(valor).includes(termo)
    )
  );

  return Promise.all(
    filtrados.map(item => config.formatar(item, administradorId))
  );
}

async function obterConteudo(tipo, id, administradorId) {
  validarId(id);

  const config = obterTipo(tipo);

  const registro = await config.model.findByPk(id, {
    include: config.include,
  });

  if (!registro) {
    throw criarErro('Conteúdo não encontrado.', 404);
  }

  return config.formatar(registro, administradorId);
}

async function atualizarEstadoConteudo(
  tipo, id, administradorId, ativo
) {
  validarId(id);
  validarEstado(ativo);

  const { model } = obterTipo(tipo);

  await model.sequelize.transaction(async transaction => {
    const registro = await model.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!registro) {
      throw criarErro('Conteúdo não encontrado.', 404);
    }

    await registro.update({ ativo }, { transaction });
  });

  return obterConteudo(tipo, id, administradorId);
}

// Comentários

async function listarComentarios(conselhoId) {
  validarId(conselhoId);

  const conselho = await Conselho.findByPk(conselhoId, {
    attributes: ['id'],
  });

  if (!conselho) {
    throw criarErro('Conselho não encontrado.', 404);
  }

  return ComentarioConselho.findAll({
    where: { conselhoId },
    include: [{
      model: Usuario,
      as: 'autor',
      attributes: autor,
    }],
    order: [['criado_em', 'ASC'], ['id', 'ASC']],
  });
}

async function excluirComentario(conselhoId, comentarioId) {
  validarId(conselhoId);
  validarId(comentarioId);

  return Conselho.sequelize.transaction(async transaction => {
    const conselho = await Conselho.findByPk(conselhoId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!conselho) {
      throw criarErro('Conselho não encontrado.', 404);
    }

    const comentario = await ComentarioConselho.findOne({
      where: { id: comentarioId, conselhoId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!comentario) {
      throw criarErro('Comentário não encontrado.', 404);
    }

    await comentario.destroy({ transaction });

    const comentarios = await ComentarioConselho.count({
      where: { conselhoId },
      transaction,
    });

    return {
      mensagem: 'Comentário excluído pela administração.',
      comentarioId,
      comentarios,
    };
  });
}

module.exports = {
  listarConteudos,
  obterConteudo,
  atualizarEstadoConteudo,
  listarComentarios,
  excluirComentario,
};
