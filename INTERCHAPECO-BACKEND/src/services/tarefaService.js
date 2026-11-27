
// SERVICE — Tarefas do intercâmbio

const {
  Tarefa, EtapaIntercambio, EstadoTarefa, PrioridadeTarefa,
} = require('../models');

const relacionamentos = [
  { model: EtapaIntercambio, as: 'etapa', attributes: ['id', 'nome', 'ordem'] },
  { model: EstadoTarefa, as: 'estado', attributes: ['id', 'nome'] },
  { model: PrioridadeTarefa, as: 'prioridade', attributes: ['id', 'nome'] },
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
    data.toISOString().slice(0, 10) === valor;
}

function formatarTarefa(tarefa) {
  const dados = tarefa.toJSON();

  return {
    ...dados,
    concluida: dados.estado?.nome === 'Concluído',
  };
}

// Catálogos

async function listarEtapas() {
  return EtapaIntercambio.findAll({
    order: [['ordem', 'ASC']],
  });
}

async function listarEstados() {
  return EstadoTarefa.findAll({
    order: [['nome', 'ASC']],
  });
}

async function listarPrioridades() {
  return PrioridadeTarefa.findAll({
    order: [['nome', 'ASC']],
  });
}

// Validações

async function validarReferencia(Modelo, id, mensagem) {
  if (!uuidValido(id) || !(await Modelo.findByPk(id))) {
    throw criarErro(mensagem);
  }

  return id;
}

async function validarDados(dados, criacao = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw criarErro('Dados da tarefa inválidos.');
  }

  const resultado = {};

  if (criacao || dados.titulo !== undefined) {
    if (typeof dados.titulo !== 'string' || !dados.titulo.trim()) {
      throw criarErro('Informe o título da tarefa.');
    }

    if (dados.titulo.trim().length > 150) {
      throw criarErro('O título deve ter no máximo 150 caracteres.');
    }

    resultado.titulo = dados.titulo.trim();
  }

  if (dados.descricao !== undefined) {
    if (dados.descricao !== null && typeof dados.descricao !== 'string') {
      throw criarErro('Descrição inválida.');
    }

    const descricao = dados.descricao?.trim() || null;

    if (descricao && descricao.length > 3000) {
      throw criarErro('A descrição deve ter no máximo 3000 caracteres.');
    }

    resultado.descricao = descricao;
  }

  if (criacao || dados.etapaId !== undefined) {
    resultado.etapaId = await validarReferencia(
      EtapaIntercambio, dados.etapaId, 'Etapa inválida.'
    );
  }

  if (dados.prioridadeId !== undefined) {
    resultado.prioridadeId = dados.prioridadeId === null
      ? null
      : await validarReferencia(
          PrioridadeTarefa, dados.prioridadeId, 'Prioridade inválida.'
        );
  }

  if (dados.dataLimite !== undefined) {
    if (dados.dataLimite !== null && !dataValida(dados.dataLimite)) {
      throw criarErro('Informe uma data limite válida.');
    }

    resultado.dataLimite = dados.dataLimite;
  }

  if (!criacao && !Object.keys(resultado).length) {
    throw criarErro('Nenhum campo válido para atualizar.');
  }

  return resultado;
}

// Buscar tarefa do usuário autenticado

async function buscarTarefa(id, usuarioId, transaction) {
  if (!uuidValido(id)) {
    throw criarErro('Identificador da tarefa inválido.');
  }

  const tarefa = await Tarefa.findOne({
    where: { id, usuarioId },
    ...(transaction
      ? { transaction, lock: transaction.LOCK.UPDATE }
      : { include: relacionamentos }),
  });

  if (!tarefa) {
    throw criarErro('Tarefa não encontrada.', 404);
  }

  return tarefa;
}

// CRUD

async function listarTarefas(usuarioId, etapaId) {
  const where = { usuarioId };

  if (etapaId !== undefined) {
    where.etapaId = await validarReferencia(
      EtapaIntercambio, etapaId, 'Etapa inválida.'
    );
  }

  const tarefas = await Tarefa.findAll({
    where,
    include: relacionamentos,
    order: [['criado_em', 'ASC'], ['id', 'ASC']],
  });

  return tarefas.map(formatarTarefa);
}

async function obterTarefa(id, usuarioId) {
  return formatarTarefa(await buscarTarefa(id, usuarioId));
}

async function criarTarefa(usuarioId, dados) {
  const valores = await validarDados(dados, true);

  const estado = await EstadoTarefa.findOne({
    where: { nome: 'A Fazer' },
  });

  if (!estado) {
    throw criarErro('Estado inicial não configurado.', 500);
  }

  const tarefa = await Tarefa.create({
    ...valores,
    usuarioId,
    estadoId: estado.id,
    concluidaEm: null,
  });

  return obterTarefa(tarefa.id, usuarioId);
}

async function atualizarTarefa(id, usuarioId, dados) {
  const tarefa = await buscarTarefa(id, usuarioId);
  const valores = await validarDados(dados);

  await tarefa.update(valores);

  return obterTarefa(id, usuarioId);
}

async function excluirTarefa(id, usuarioId) {
  const tarefa = await buscarTarefa(id, usuarioId);

  await tarefa.destroy();

  return { mensagem: 'Tarefa excluída com sucesso.' };
}

// Atualizar estado

async function atualizarEstado(id, usuarioId, estadoId) {
  await validarReferencia(
    EstadoTarefa, estadoId, 'Estado inválido.'
  );

  await Tarefa.sequelize.transaction(async transaction => {
    const tarefa = await buscarTarefa(id, usuarioId, transaction);

    const estado = await EstadoTarefa.findByPk(estadoId, {
      transaction,
    });

    if (!estado) {
      throw criarErro('Estado inválido.');
    }

    await tarefa.update({
      estadoId: estado.id,
      concluidaEm: estado.nome === 'Concluído'
        ? tarefa.concluidaEm ?? new Date()
        : null,
    }, { transaction });
  });

  return obterTarefa(id, usuarioId);
}

module.exports = {
  listarEtapas,
  listarEstados,
  listarPrioridades,
  listarTarefas,
  obterTarefa,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  atualizarEstado,
};
