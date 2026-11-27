// UTILS — Validações administrativas

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

  return id;
}

function validarEstado(ativo) {
  if (typeof ativo !== 'boolean') {
    throw criarErro('Informe um estado válido.');
  }

  return ativo;
}

function normalizarTexto(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function validarBusca(busca) {
  if (busca !== undefined &&
      (typeof busca !== 'string' || busca.length > 300)) {
    throw criarErro('Busca inválida.');
  }

  return normalizarTexto(busca);
}

function filtroEstado(estado) {
  if (estado === undefined || estado === 'todos') return {};

  if (estado === 'ativos') return { ativo: true };
  if (estado === 'inativos') return { ativo: false };

  throw criarErro('Filtro de estado inválido.');
}

module.exports = {
  criarErro,
  validarId,
  validarEstado,
  normalizarTexto,
  validarBusca,
  filtroEstado,
};