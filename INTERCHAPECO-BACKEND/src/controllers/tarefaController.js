
// CONTROLLER — Tarefas

const tarefaService = require('../services/tarefaService');

function tratarErro(res, erro) {
  if (Number.isInteger(erro.status) &&
      erro.status >= 400 && erro.status < 500) {
    return res.status(erro.status).json({
      mensagem: erro.message,
    });
  }

  if (erro.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensagem: 'Dados da tarefa inválidos.',
    });
  }

  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      mensagem: 'Relacionamento inválido.',
    });
  }

  console.error('Erro no gerenciamento de tarefas:', erro.name);

  return res.status(500).json({
    mensagem: 'Não foi possível processar a solicitação.',
  });
}

// Catálogos

async function listarEtapas(req, res) {
  try {
    return res.json(await tarefaService.listarEtapas());
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listarEstados(req, res) {
  try {
    return res.json(await tarefaService.listarEstados());
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function listarPrioridades(req, res) {
  try {
    return res.json(await tarefaService.listarPrioridades());
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

// CRUD

async function listar(req, res) {
  try {
    const tarefas = await tarefaService.listarTarefas(
      req.usuario.id, req.query.etapaId
    );

    return res.json(tarefas);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function obter(req, res) {
  try {
    const tarefa = await tarefaService.obterTarefa(
      req.params.id, req.usuario.id
    );

    return res.json(tarefa);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const tarefa = await tarefaService.criarTarefa(
      req.usuario.id, req.body
    );

    return res.status(201).json(tarefa);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const tarefa = await tarefaService.atualizarTarefa(
      req.params.id, req.usuario.id, req.body
    );

    return res.json(tarefa);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    const resultado = await tarefaService.excluirTarefa(
      req.params.id, req.usuario.id
    );

    return res.json(resultado);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

async function atualizarEstado(req, res) {
  try {
    const tarefa = await tarefaService.atualizarEstado(
      req.params.id, req.usuario.id, req.body?.estadoId
    );

    return res.json(tarefa);
  } catch (erro) {
    return tratarErro(res, erro);
  }
}

module.exports = {
  listarEtapas,
  listarEstados,
  listarPrioridades,
  listar,
  obter,
  criar,
  atualizar,
  excluir,
  atualizarEstado,
};
