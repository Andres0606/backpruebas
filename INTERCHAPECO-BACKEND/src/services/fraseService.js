// SERVICE — Frases em português

const { QueryTypes } = require('sequelize');
const { Frase, CategoriaFrase } = require('../models');

const relacionamentos = [
  { model: CategoriaFrase, as: 'categoria', attributes: ['id', 'nome'] },
];

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarId(id) {
  if (typeof id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw criarErro('Identificador inválido.');
  }
}

async function validarCategoria(id) {
  validarId(id);

  if (!(await CategoriaFrase.findByPk(id))) {
    throw criarErro('Categoria inválida.');
  }

  return id;
}

function normalizarTexto(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Categorias e quantidade de frases ativas

async function listarCategorias() {
  return Frase.sequelize.query(`
    SELECT
      c.id,
      c.nome,
      COUNT(f.id)::integer AS "totalFrases"
    FROM public.categorias_frase c
    LEFT JOIN public.frases f
      ON f.categoria_id = c.id AND f.ativo = true
    GROUP BY c.id, c.nome
    ORDER BY c.nome
  `, {
    type: QueryTypes.SELECT,
  });
}

// Consulta de frases

async function listarFrases({
  categoriaId, busca, incluirInativas = false,
} = {}) {
  const where = {};

  if (!incluirInativas) where.ativo = true;

  if (categoriaId !== undefined) {
    where.categoriaId = await validarCategoria(categoriaId);
  }

  if (busca !== undefined &&
      (typeof busca !== 'string' || busca.length > 300)) {
    throw criarErro('Busca inválida.');
  }

  const frases = await Frase.findAll({
    where,
    include: relacionamentos,
    order: [['frasePortugues', 'ASC'], ['id', 'ASC']],
  });

  const termo = normalizarTexto(busca?.trim());

  if (!termo) return frases;

  // Busca em português, espanhol e inglês

  return frases.filter(frase =>
    normalizarTexto(frase.frasePortugues).includes(termo) ||
    normalizarTexto(frase.traducaoEspanhol).includes(termo) ||
    normalizarTexto(frase.traducaoIngles).includes(termo) ||
    normalizarTexto(frase.explicacao).includes(termo) ||
    normalizarTexto(frase.explicacaoIngles).includes(termo) ||
    normalizarTexto(frase.explicacaoPortugues).includes(termo) ||
    normalizarTexto(frase.categoria?.nome).includes(termo)
  );
}

// Consulta individual de frase

async function obterFrase(id, incluirInativas = false) {
  validarId(id);

  const where = { id };

  if (!incluirInativas) where.ativo = true;

  const frase = await Frase.findOne({
    where,
    include: relacionamentos,
  });

  if (!frase) {
    throw criarErro('Frase não encontrada.', 404);
  }

  return frase;
}

// Validações

function validarTexto(valor, limite, mensagem) {
  if (typeof valor !== 'string' ||
      !valor.trim() || valor.trim().length > limite) {
    throw criarErro(mensagem);
  }

  return valor.trim();
}

async function validarDados(dados, criacao = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro('Dados da frase inválidos.');
  }

  const resultado = {};

  // Categoria

  if (criacao || dados.categoriaId !== undefined) {
    resultado.categoriaId = await validarCategoria(dados.categoriaId);
  }

  // Frase original em português

  if (criacao || dados.frasePortugues !== undefined) {
    resultado.frasePortugues = validarTexto(
      dados.frasePortugues, 300,
      'Informe uma frase em português de até 300 caracteres.'
    );
  }

  // Tradução em espanhol

  if (criacao || dados.traducaoEspanhol !== undefined) {
    resultado.traducaoEspanhol = validarTexto(
      dados.traducaoEspanhol, 300,
      'Informe uma tradução em espanhol de até 300 caracteres.'
    );
  }

  // Tradução em inglês

  if (criacao || dados.traducaoIngles !== undefined) {
    resultado.traducaoIngles = validarTexto(
      dados.traducaoIngles, 300,
      'Informe uma tradução em inglês de até 300 caracteres.'
    );
  }

  // Contexto de uso em espanhol

  if (criacao || dados.explicacao !== undefined) {
    resultado.explicacao = validarTexto(
      dados.explicacao, 3000,
      'Informe uma explicação em espanhol de até 3000 caracteres.'
    );
  }

  // Contexto de uso em inglês

  if (criacao || dados.explicacaoIngles !== undefined) {
    resultado.explicacaoIngles = validarTexto(
      dados.explicacaoIngles, 3000,
      'Informe uma explicação em inglês de até 3000 caracteres.'
    );
  }

  // Contexto de uso em português

  if (criacao || dados.explicacaoPortugues !== undefined) {
    resultado.explicacaoPortugues = validarTexto(
      dados.explicacaoPortugues, 3000,
      'Informe uma explicação em português de até 3000 caracteres.'
    );
  }

  // Estado da frase

  if (dados.ativo !== undefined) {
    if (typeof dados.ativo !== 'boolean') {
      throw criarErro('Estado da frase inválido.');
    }

    resultado.ativo = dados.ativo;
  }

  if (!criacao && !Object.keys(resultado).length) {
    throw criarErro('Nenhum campo válido para atualizar.');
  }

  return resultado;
}

// Gerenciamento administrativo

async function criarFrase(dados) {
  const valores = await validarDados(dados, true);

  const frase = await Frase.create(valores);

  return obterFrase(frase.id, true);
}

async function atualizarFrase(id, dados) {
  const frase = await obterFrase(id, true);

  const valores = await validarDados(dados);

  await frase.update(valores);

  return obterFrase(frase.id, true);
}

async function desativarFrase(id) {
  const frase = await obterFrase(id, true);

  await frase.update({ ativo: false });

  return {
    mensagem: 'Frase desativada com sucesso.',
  };
}

module.exports = {
  listarCategorias,
  listarFrases,
  obterFrase,
  criarFrase,
  atualizarFrase,
  desativarFrase,
};