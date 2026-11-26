
// SERVICE — Comentários em conselhos

const {
  Conselho,
  ComentarioConselho,
  Usuario,
} = require('../models');

const { buscarConselho } = require('./conselhoService');

const incluirAutor = [{
  model: Usuario,
  as: 'autor',
  attributes: ['id', 'nomeCompleto', 'fotoUrl'],
}];

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarConteudo(conteudo) {
  if (typeof conteudo !== 'string' || !conteudo.trim()) {
    throw criarErro('O comentário não pode estar vazio.');
  }

  const texto = conteudo.trim();

  if (texto.length > 1000) {
    throw criarErro('O comentário deve ter no máximo 1000 caracteres.');
  }

  return texto;
}

function formatarComentario(comentario, usuarioId) {
  const dados = comentario.toJSON();

  return {
    ...dados,
    meuComentario: dados.usuarioId === usuarioId,
  };
}

async function contarComentarios(conselhoId, transaction) {
  return ComentarioConselho.count({
    where: { conselhoId },
    transaction,
  });
}

async function buscarComentario(conselhoId, comentarioId, transaction) {
  if (
    typeof comentarioId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(comentarioId)
  ) {
    throw criarErro('Identificador do comentário inválido.');
  }

  const comentario = await ComentarioConselho.findOne({
    where: { id: comentarioId, conselhoId },
    transaction,
  });

  if (!comentario) {
    throw criarErro('Comentário não encontrado.', 404);
  }

  return comentario;
}

function validarAutor(comentario, usuarioId) {
  if (comentario.usuarioId !== usuarioId) {
    throw criarErro(
      'Você não tem permissão para alterar este comentário.',
      403
    );
  }
}

// Listar comentários
async function listarComentarios(usuarioId, conselhoId) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const comentarios = await ComentarioConselho.findAll({
      where: { conselhoId },
      include: incluirAutor,
      order: [['criado_em', 'ASC'], ['id', 'ASC']],
      transaction,
    });

    return comentarios.map((comentario) =>
      formatarComentario(comentario, usuarioId)
    );
  });
}

// Criar comentário
async function criarComentario(usuarioId, conselhoId, dados) {
  const conteudo = validarConteudo(dados?.conteudo);

  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const novo = await ComentarioConselho.create({
      usuarioId,
      conselhoId,
      conteudo,
    }, { transaction });

    const comentario = await ComentarioConselho.findByPk(novo.id, {
      include: incluirAutor,
      transaction,
    });

    return {
      mensagem: 'Comentário publicado com sucesso.',
      comentario: formatarComentario(comentario, usuarioId),
      comentarios: await contarComentarios(conselhoId, transaction),
    };
  });
}

// Atualizar comentário
async function atualizarComentario(
  usuarioId, conselhoId, comentarioId, dados
) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const comentario = await buscarComentario(
      conselhoId, comentarioId, transaction
    );

    validarAutor(comentario, usuarioId);

    const conteudo = validarConteudo(dados?.conteudo);

    await comentario.update({ conteudo }, { transaction });

    const atualizado = await ComentarioConselho.findByPk(comentarioId, {
      include: incluirAutor,
      transaction,
    });

    return {
      mensagem: 'Comentário atualizado com sucesso.',
      comentario: formatarComentario(atualizado, usuarioId),
      comentarios: await contarComentarios(conselhoId, transaction),
    };
  });
}

// Excluir comentário
async function excluirComentario(usuarioId, conselhoId, comentarioId) {
  return Conselho.sequelize.transaction(async (transaction) => {
    await buscarConselho(conselhoId, transaction);

    const comentario = await buscarComentario(
      conselhoId, comentarioId, transaction
    );

    validarAutor(comentario, usuarioId);

    await comentario.destroy({ transaction });

    return {
      mensagem: 'Comentário excluído com sucesso.',
      comentarioId,
      comentarios: await contarComentarios(conselhoId, transaction),
    };
  });
}

module.exports = {
  listarComentarios,
  criarComentario,
  atualizarComentario,
  excluirComentario,
};
