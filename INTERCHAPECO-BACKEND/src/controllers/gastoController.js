
// CONTROLLER — Meus gastos

const gastoService = require('../services/gastoService');

function tratarErro(res, erro) {
  if (Number.isInteger(erro.status) &&
      erro.status >= 400 && erro.status < 500) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }

  if (erro.name === 'SequelizeValidationError') {
    return res.status(400).json({ mensagem: 'Dados inválidos.' });
  }

  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ mensagem: 'Relacionamento inválido.' });
  }

  console.error('Erro no gerenciamento de gastos:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

async function listarCategorias(req, res) {
  try {
    return res.json(await gastoService.listarCategorias());
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    const { ano, mes } = req.query;
    return res.json(await gastoService.listarGastos(req.usuario.id, ano, mes));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obter(req, res) {
  try {
    return res.json(await gastoService.obterGasto(req.params.id, req.usuario.id));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const gasto = await gastoService.criarGasto(req.usuario.id, req.body);
    return res.status(201).json(gasto);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const gasto = await gastoService.atualizarGasto(
      req.params.id, req.usuario.id, req.body
    );

    return res.json(gasto);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    return res.json(await gastoService.excluirGasto(req.params.id, req.usuario.id));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obterOrcamento(req, res) {
  try {
    const { ano, mes } = req.query;
    return res.json(await gastoService.obterOrcamento(req.usuario.id, ano, mes));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizarOrcamento(req, res) {
  try {
    const { ano, mes } = req.query;

    return res.json(await gastoService.atualizarOrcamento(
      req.usuario.id, ano, mes, req.body?.valor
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obterResumo(req, res) {
  try {
    const { ano, mes } = req.query;
    return res.json(await gastoService.obterResumo(req.usuario.id, ano, mes));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obterEstatisticas(req, res) {
  try {
    const { ano, mes } = req.query;

    return res.json(await gastoService.obterEstatisticas(
      req.usuario.id, ano, mes
    ));
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listarCategorias,
  listar,
  obter,
  criar,
  atualizar,
  excluir,
  obterOrcamento,
  atualizarOrcamento,
  obterResumo,
  obterEstatisticas,
};
