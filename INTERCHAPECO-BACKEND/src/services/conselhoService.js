
// SERVICE — Gerenciamento de conselhos

const {
  Conselho,
  CategoriaConselho,
  Usuario,
  Pais,
  CurtidaConselho,
  ComentarioConselho,
} = require('../models');

const { removerArquivo } = require('./fotoConselhoService');

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function uuidValido(id) {
  return typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

const incluirRelacionamentos = [
  {
    model: CategoriaConselho,
    as: 'categoria',
    attributes: ['id', 'nome'],
  },
  {
    model: Usuario,
    as: 'autor',
    attributes: ['id', 'nomeCompleto', 'fotoUrl'],
    include: [{
      model: Pais,
      as: 'paisOrigem',
      attributes: ['id', 'nome'],
    }],
  },
];

// Formatar resposta
async function formatarConselho(conselho, usuarioId) {
  const dados = conselho.toJSON();

  const [curtidas, comentarios, curtida] = await Promise.all([
    CurtidaConselho.count({
      where: { conselhoId: dados.id },
    }),
    ComentarioConselho.count({
      where: { conselhoId: dados.id },
    }),
    CurtidaConselho.findOne({
      where: { conselhoId: dados.id, usuarioId },
    }),
  ]);

  return {
    ...dados,
    curtidas,
    comentarios,
    curtido: !!curtida,
    meuConselho: dados.usuarioId === usuarioId,
  };
}

// Listar conselhos
async function listarConselhos(
  usuarioId,
  { ordenacao = 'recentes', categoriaId } = {}
) {
  if (!['recentes', 'populares', 'meus'].includes(ordenacao)) {
  throw criarErro('Ordenação inválida.');
}

const where = { ativo: true };

if (ordenacao === 'meus') {
  where.usuarioId = usuarioId;
}

  if (categoriaId !== undefined) {
    if (!uuidValido(categoriaId)) {
      throw criarErro('Categoria inválida.');
    }
    where.categoriaId = categoriaId;
  }

  const conselhos = await Conselho.findAll({
    where,
    include: incluirRelacionamentos,
    order: [['criado_em', 'DESC']],
  });

  const resultado = await Promise.all(
    conselhos.map((conselho) =>
      formatarConselho(conselho, usuarioId)
    )
  );

  if (ordenacao === 'populares') {
    resultado.sort((a, b) => b.curtidas - a.curtidas);
  }

  return resultado;
}

// Buscar conselho
async function buscarConselho(id, transaction) {
  if (!uuidValido(id)) {
    throw criarErro('Identificador inválido.');
  }

  const conselho = await Conselho.findOne({
    where: { id, ativo: true },
    ...(transaction
      ? { transaction, lock: transaction.LOCK.UPDATE }
      : { include: incluirRelacionamentos }),
  });

  if (!conselho) {
    throw criarErro('Conselho não encontrado.', 404);
  }

  return conselho;
}

async function obterConselho(id, usuarioId) {
  const conselho = await buscarConselho(id);
  return formatarConselho(conselho, usuarioId);
}

function validarAutor(conselho, usuarioId) {
  if (conselho.usuarioId !== usuarioId) {
    throw criarErro(
      'Você não tem permissão para alterar este conselho.',
      403
    );
  }
}

// Validar dados
async function validarDados(dados, criacao = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro('Dados inválidos.');
  }

  const resultado = {};
  const campos = { titulo: 150, conteudo: 5000 };

  for (const [campo, limite] of Object.entries(campos)) {
    if (!criacao && dados[campo] === undefined) continue;

    if (typeof dados[campo] !== 'string' || !dados[campo].trim()) {
      throw criarErro(`O campo ${campo} é obrigatório.`);
    }

    const valor = dados[campo].trim();

    if (valor.length > limite) {
      throw criarErro(`O campo ${campo} excede o limite permitido.`);
    }

    resultado[campo] = valor;
  }

  if (criacao || dados.categoriaId !== undefined) {
    if (!uuidValido(dados.categoriaId)) {
      throw criarErro('Selecione uma categoria válida.');
    }

    const categoria = await CategoriaConselho.findByPk(dados.categoriaId);

    if (!categoria) {
      throw criarErro('Categoria não encontrada.', 404);
    }

    resultado.categoriaId = categoria.id;
  }

  return resultado;
}

// Criar conselho
async function criarConselho(usuarioId, dados) {
  const valores = await validarDados(dados, true);

  const conselho = await Conselho.create({
    ...valores,
    usuarioId,
    ativo: true,
  });

  return obterConselho(conselho.id, usuarioId);
}

// Atualizar conselho
async function atualizarConselho(id, usuarioId, dados) {
  const conselho = await buscarConselho(id);

  validarAutor(conselho, usuarioId);

  const valores = await validarDados(dados);

  if (!Object.keys(valores).length) {
    throw criarErro('Nenhum campo válido informado.');
  }

  await conselho.update(valores);

  return obterConselho(id, usuarioId);
}

// Excluir conselho
async function excluirConselho(id, usuarioId) {
  let imagemAnterior;

  const resultado = await Conselho.sequelize.transaction(async (transaction) => {
    const conselho = await buscarConselho(id, transaction);

    validarAutor(conselho, usuarioId);

    imagemAnterior = conselho.imagemUrl;

    await CurtidaConselho.destroy({
      where: { conselhoId: id },
      transaction,
    });

    await ComentarioConselho.destroy({
      where: { conselhoId: id },
      transaction,
    });

    await conselho.destroy({ transaction });

    return {
      mensagem: 'Conselho excluído com sucesso.',
    };
  });

  try {
    await removerArquivo(imagemAnterior, id);
  } catch (erro) {
    console.error('Erro ao remover imagem do conselho:', erro.name);
  }

  return resultado;
}


module.exports = {
  listarConselhos,
  obterConselho,
  criarConselho,
  atualizarConselho,
  excluirConselho,
  formatarConselho,
  buscarConselho,
};
