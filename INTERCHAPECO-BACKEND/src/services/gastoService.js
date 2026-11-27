
// SERVICE — Meus gastos

const { Op, QueryTypes } = require('sequelize');
const { Gasto, CategoriaGasto, OrcamentoMensal } = require('../models');
const { agoraChapeco } = require('../utils/datas');

const relacionamentos = [
  { model: CategoriaGasto, as: 'categoria', attributes: ['id', 'nome'] },
];

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function uuidValido(id) {
  return typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function dataValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const data = new Date(`${valor}T00:00:00Z`);

  return !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === valor &&
    Number(valor.slice(0, 4)) >= 2000;
}

function validarValor(valor) {
  if (!['number', 'string'].includes(typeof valor) ||
      !/^\d{1,10}(\.\d{1,2})?$/.test(String(valor)) ||
      Number(valor) <= 0) {
    throw criarErro('Informe um valor válido e maior que zero.');
  }

  return Number(valor).toFixed(2);
}

function formatarGasto(gasto) {
  const dados = gasto.toJSON();
  return { ...dados, valor: Number(dados.valor) };
}

// Períodos mensais

function montarPeriodo(ano, mes) {
  const chave = `${ano}-${String(mes).padStart(2, '0')}`;
  const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();

  return {
    ano,
    mes,
    chave,
    inicio: `${chave}-01`,
    fim: `${chave}-${ultimoDia}`,
  };
}

function obterPeriodo(ano, mes) {
  if (ano === undefined && mes === undefined) {
    const [anoAtual, mesAtual] = agoraChapeco().data.split('-').map(Number);
    return montarPeriodo(anoAtual, mesAtual);
  }

  if (!/^\d{4}$/.test(String(ano)) ||
      !/^\d{1,2}$/.test(String(mes)) ||
      !['string', 'number'].includes(typeof ano) ||
      !['string', 'number'].includes(typeof mes) ||
      Number(ano) < 2000 || Number(ano) > 9999 ||
      Number(mes) < 1 || Number(mes) > 12) {
    throw criarErro('Informe um período válido.');
  }

  return montarPeriodo(Number(ano), Number(mes));
}

function periodoAnterior(periodo) {
  return periodo.mes === 1
    ? montarPeriodo(periodo.ano - 1, 12)
    : montarPeriodo(periodo.ano, periodo.mes - 1);
}

// Categorias e validações

async function listarCategorias() {
  return CategoriaGasto.findAll({ order: [['nome', 'ASC']] });
}

async function validarDados(dados, criacao = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro('Dados do gasto inválidos.');
  }

  const resultado = {};

  if (criacao || dados.descricao !== undefined) {
    if (typeof dados.descricao !== 'string' ||
        !dados.descricao.trim() || dados.descricao.trim().length > 150) {
      throw criarErro('Informe um conceito de até 150 caracteres.');
    }

    resultado.descricao = dados.descricao.trim();
  }

  if (criacao || dados.valor !== undefined) {
    resultado.valor = validarValor(dados.valor);
  }

  if (criacao || dados.categoriaId !== undefined) {
    if (!uuidValido(dados.categoriaId) ||
        !(await CategoriaGasto.findByPk(dados.categoriaId))) {
      throw criarErro('Categoria inválida.');
    }

    resultado.categoriaId = dados.categoriaId;
  }

  if (criacao || dados.dataGasto !== undefined) {
    if (!dataValida(dados.dataGasto)) {
      throw criarErro('Informe uma data válida.');
    }

    resultado.dataGasto = dados.dataGasto;
  }

  if (dados.observacao !== undefined) {
    if (dados.observacao !== null && typeof dados.observacao !== 'string') {
      throw criarErro('Observação inválida.');
    }

    const observacao = dados.observacao?.trim() || null;

    if (observacao && observacao.length > 3000) {
      throw criarErro('A observação deve ter no máximo 3000 caracteres.');
    }

    resultado.observacao = observacao;
  }

  if (!criacao && !Object.keys(resultado).length) {
    throw criarErro('Nenhum campo válido para atualizar.');
  }

  return resultado;
}

// CRUD

async function buscarGasto(id, usuarioId) {
  if (!uuidValido(id)) throw criarErro('Identificador do gasto inválido.');

  const gasto = await Gasto.findOne({
    where: { id, usuarioId },
    include: relacionamentos,
  });

  if (!gasto) throw criarErro('Gasto não encontrado.', 404);

  return gasto;
}

async function listarGastos(usuarioId, ano, mes) {
  const where = { usuarioId };

  if (ano !== undefined || mes !== undefined) {
    const periodo = obterPeriodo(ano, mes);
    where.dataGasto = { [Op.between]: [periodo.inicio, periodo.fim] };
  }

  const gastos = await Gasto.findAll({
    where,
    include: relacionamentos,
    order: [['dataGasto', 'DESC'], ['criado_em', 'DESC'], ['id', 'DESC']],
  });

  return gastos.map(formatarGasto);
}

async function obterGasto(id, usuarioId) {
  return formatarGasto(await buscarGasto(id, usuarioId));
}

async function criarGasto(usuarioId, dados) {
  const valores = await validarDados(dados, true);
  const gasto = await Gasto.create({ ...valores, usuarioId });

  return obterGasto(gasto.id, usuarioId);
}

async function atualizarGasto(id, usuarioId, dados) {
  const gasto = await buscarGasto(id, usuarioId);
  const valores = await validarDados(dados);

  await gasto.update(valores);
  return obterGasto(id, usuarioId);
}

async function excluirGasto(id, usuarioId) {
  const gasto = await buscarGasto(id, usuarioId);

  await gasto.destroy();
  return { mensagem: 'Gasto excluído com sucesso.' };
}

// Orçamento mensal

async function obterOrcamento(usuarioId, ano, mes) {
  const periodo = obterPeriodo(ano, mes);

  const orcamento = await OrcamentoMensal.findOne({
    where: { usuarioId, ano: periodo.ano, mes: periodo.mes },
  });

  return {
    id: orcamento?.id ?? null,
    ano: periodo.ano,
    mes: periodo.mes,
    valor: orcamento ? Number(orcamento.valor) : null,
  };
}

async function atualizarOrcamento(usuarioId, ano, mes, valor) {
  const periodo = obterPeriodo(ano, mes);
  const valorValidado = validarValor(valor);

  const [orcamento] = await Gasto.sequelize.query(`
    INSERT INTO public.orcamentos_mensais
      (usuario_id, ano, mes, valor)
    VALUES ($usuarioId, $ano, $mes, $valor)
    ON CONFLICT (usuario_id, ano, mes)
    DO UPDATE SET
      valor = EXCLUDED.valor,
      atualizado_em = CURRENT_TIMESTAMP
    RETURNING id, ano, mes, valor
  `, {
    bind: {
      usuarioId,
      ano: periodo.ano,
      mes: periodo.mes,
      valor: valorValidado,
    },
    type: QueryTypes.SELECT,
  });

  return { ...orcamento, valor: Number(orcamento.valor) };
}

// Totais e estatísticas

function centavos(valor) {
  return Math.round(Number(valor) * 100);
}

async function obterTotais(usuarioId, periodo) {
  const anterior = periodoAnterior(periodo);

  const registros = await Gasto.sequelize.query(`
    SELECT
      TO_CHAR(g.data_gasto, 'YYYY-MM') AS periodo,
      COALESCE(c.nome, 'Outros') AS categoria,
      SUM(g.valor) AS valor
    FROM public.gastos g
    LEFT JOIN public.categorias_gasto c ON c.id = g.categoria_id
    WHERE g.usuario_id = $usuarioId
      AND g.data_gasto BETWEEN $inicio AND $fim
    GROUP BY 1, 2
    ORDER BY 3 DESC, 2 ASC
  `, {
    bind: {
      usuarioId,
      inicio: anterior.inicio,
      fim: periodo.fim,
    },
    type: QueryTypes.SELECT,
  });

  const atuais = registros.filter(item => item.periodo === periodo.chave);
  const anteriores = registros.filter(item => item.periodo === anterior.chave);

  const somar = lista => lista.reduce((total, item) => total + centavos(item.valor), 0);

  return {
    atuais,
    totalAtual: somar(atuais),
    totalAnterior: somar(anteriores),
  };
}

function montarDistribuicao(lista) {
  const ordenadas = lista
    .filter(item => item.categoria !== 'Outros')
    .map(item => ({ categoria: item.categoria, valor: Number(item.valor) }))
    .sort((a, b) => b.valor - a.valor);

  const principais = ordenadas.slice(0, 3);

  const resto = ordenadas.slice(3)
    .reduce((total, item) => total + centavos(item.valor), 0) +
    lista.filter(item => item.categoria === 'Outros')
      .reduce((total, item) => total + centavos(item.valor), 0);

  return resto > 0
    ? [...principais, { categoria: 'Outros', valor: resto / 100 }]
    : principais;
}

async function obterResumo(usuarioId, ano, mes) {
  const periodo = obterPeriodo(ano, mes);

  const [totais, orcamento] = await Promise.all([
    obterTotais(usuarioId, periodo),
    obterOrcamento(usuarioId, periodo.ano, periodo.mes),
  ]);

  return {
    ano: periodo.ano,
    mes: periodo.mes,
    orcamento: orcamento.valor,
    gasto: totais.totalAtual / 100,
    disponivel: orcamento.valor === null
      ? null
      : (centavos(orcamento.valor) - totais.totalAtual) / 100,
    distribuicao: montarDistribuicao(totais.atuais),
  };
}

async function obterEstatisticas(usuarioId, ano, mes) {
  const periodo = obterPeriodo(ano, mes);
  const { atuais, totalAtual, totalAnterior } =
    await obterTotais(usuarioId, periodo);

  const categorias = atuais.map(item => ({
    categoria: item.categoria,
    valor: Number(item.valor),
    participacao: totalAtual > 0 ? centavos(item.valor) / totalAtual : 0,
  })).sort((a, b) => b.valor - a.valor);

  return {
    ano: periodo.ano,
    mes: periodo.mes,
    gasto: totalAtual / 100,
    gastoAnterior: totalAnterior / 100,
    categorias,
    variacao: totalAnterior > 0
      ? Math.round((totalAtual - totalAnterior) / totalAnterior * 100)
      : null,
  };
}

module.exports = {
  listarCategorias,
  listarGastos,
  obterGasto,
  criarGasto,
  atualizarGasto,
  excluirGasto,
  obterOrcamento,
  atualizarOrcamento,
  obterResumo,
  obterEstatisticas,
};
