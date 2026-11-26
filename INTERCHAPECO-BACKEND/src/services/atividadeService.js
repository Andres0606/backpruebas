// SERVICE — Gerenciamento de atividades

const {
  Atividade,
  CategoriaAtividade,
  Usuario,
  InteresseAtividade,
  FavoritoAtividade,
} = require('../models');

const { Op } = require('sequelize');

const {
  agoraChapeco,
  atividadeVencida,
} = require('../utils/datas');

const { removerArquivo } = require('./fotoAtividadeService');
// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

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
    model: CategoriaAtividade,
    as: 'categoria',
    attributes: ['id', 'nome'],
  },
  {
    model: Usuario,
    as: 'criador',
    attributes: [
      'id',
      'nomeCompleto',
      'fotoUrl',
    ],
  },
];

// ============================================================
// FORMATAR ATIVIDADE
// ============================================================

async function formatarAtividade(
  atividade,
  usuarioId
) {
  const dados = atividade.toJSON();

  const interessados =
    await InteresseAtividade.count({
      where: {
        atividadeId: dados.id,
      },
    });

  const interesse = usuarioId
    ? await InteresseAtividade.findOne({
        where: {
          atividadeId: dados.id,
          usuarioId,
        },
      })
    : null;

  const favorito = usuarioId
    ? await FavoritoAtividade.findOne({
        where: {
          atividadeId: dados.id,
          usuarioId,
        },
      })
    : null;

  return {
    ...dados,

    latitude:
      dados.latitude == null
        ? null
        : Number(dados.latitude),

    longitude:
      dados.longitude == null
        ? null
        : Number(dados.longitude),

    interessados,

    interessado: !!interesse,

    guardado: !!favorito,

    vencida: atividadeVencida(dados.dataAtividade, dados.horaInicio),

    minhaAtividade:
      dados.criadorId === usuarioId,
  };
}

// ============================================================
// LISTAR ATIVIDADES
// ============================================================

async function listarAtividades(
  usuarioId,
  {
    ordenacao = 'recentes',
    categoriaId,
  } = {}
) {
  if (
    !['recentes', 'populares'].includes(
      ordenacao
    )
  ) {
    throw criarErro('Ordenação inválida.');
  }

  const agora = agoraChapeco();

  const where = {
    ativo: true,
    [Op.or]: [
      { dataAtividade: { [Op.gt]: agora.data } },
      {
        dataAtividade: agora.data,
        horaInicio: { [Op.gt]: agora.hora },
      },
    ],
  };

  if (categoriaId !== undefined) {
    if (!uuidValido(categoriaId)) {
      throw criarErro('Categoria inválida.');
    }

    where.categoriaId = categoriaId;
  }

  const atividades =
    await Atividade.findAll({
      where,

      include: incluirRelacionamentos,

      order: [
        ['dataAtividade', 'ASC'],
        ['horaInicio', 'ASC'],
      ],
    });

  const resultado = await Promise.all(
    atividades.map((atividade) =>
      formatarAtividade(
        atividade,
        usuarioId
      )
    )
  );

  if (ordenacao === 'populares') {
    resultado.sort(
      (a, b) =>
        b.interessados - a.interessados
    );
  }

  return resultado;
}

// ============================================================
// BUSCAR ATIVIDADE
// ============================================================

async function buscarAtividade(id) {
  if (!uuidValido(id)) {
    throw criarErro('Identificador inválido.');
  }

  const atividade =
    await Atividade.findOne({
      where: {
        id,
        ativo: true,
      },

      include: incluirRelacionamentos,
    });

  if (!atividade) {
    throw criarErro(
      'Atividade não encontrada.',
      404
    );
  }

  return atividade;
}

// ============================================================
// OBTER ATIVIDADE
// ============================================================

async function obterAtividade(
  id,
  usuarioId
) {
  const atividade =
    await buscarAtividade(id);

  return formatarAtividade(
    atividade,
    usuarioId
  );
}

// ============================================================
// VALIDAR CRIADOR
// ============================================================

function validarCriador(
  atividade,
  usuarioId
) {
  if (
    atividade.criadorId !== usuarioId
  ) {
    throw criarErro(
      'Você não tem permissão para alterar esta atividade.',
      403
    );
  }
}

// ============================================================
// VALIDAR DATA
// ============================================================

function validarData(data) {
  if (
    typeof data !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data)
  ) {
    throw criarErro(
      'Informe uma data válida.'
    );
  }

  const objetoData = new Date(
    `${data}T00:00:00.000Z`
  );

  if (
    Number.isNaN(objetoData.getTime()) ||
    objetoData.toISOString().slice(0, 10) !== data
  ) {
    throw criarErro('Data inválida.');
  }

  return data;
}

// ============================================================
// VALIDAR HORÁRIO
// ============================================================

function validarHora(hora) {
  if (
    typeof hora !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(hora)
  ) {
    throw criarErro('Horário inválido.');
  }

  return hora.length === 5
    ? `${hora}:00`
    : hora;
}

// ============================================================
// VALIDAR DADOS
// ============================================================

async function validarDados(
  dados,
  criacao = false
) {
  if (
    !dados ||
    typeof dados !== 'object' ||
    Array.isArray(dados)
  ) {
    throw criarErro('Dados inválidos.');
  }

  const resultado = {};

  const camposTexto = {
    nome: 150,
    descricao: 5000,
    local: 250,
  };

  for (
    const [campo, limite]
    of Object.entries(camposTexto)
  ) {
    if (
      dados[campo] === undefined &&
      !criacao
    ) {
      continue;
    }

    if (
      typeof dados[campo] !== 'string' ||
      !dados[campo].trim()
    ) {
      throw criarErro(
        `O campo ${campo} é obrigatório.`
      );
    }

    const valor = dados[campo].trim();

    if (valor.length > limite) {
      throw criarErro(
        `O campo ${campo} excede o limite permitido.`
      );
    }

    resultado[campo] = valor;
  }

  // Validar data

  if (
    criacao ||
    dados.dataAtividade !== undefined
  ) {
    resultado.dataAtividade =
      validarData(dados.dataAtividade);
  }

  // Validar horário

  if (
    criacao ||
    dados.horaInicio !== undefined
  ) {
    resultado.horaInicio =
      validarHora(dados.horaInicio);
  }

  // Validar categoria

  if (dados.categoriaId !== undefined) {
    if (dados.categoriaId === null) {
      resultado.categoriaId = null;

    } else {
      if (!uuidValido(dados.categoriaId)) {
        throw criarErro('Categoria inválida.');
      }

      const categoria =
        await CategoriaAtividade.findByPk(
          dados.categoriaId
        );

      if (!categoria) {
        throw criarErro(
          'Categoria não encontrada.',
          404
        );
      }

      resultado.categoriaId =
        categoria.id;
    }
  }

  // Validar coordenadas

  const coordenadas = {
    latitude: 90,
    longitude: 180,
  };

  for (
    const [campo, limite]
    of Object.entries(coordenadas)
  ) {
    if (dados[campo] === undefined) {
      continue;
    }

    if (dados[campo] === null) {
      resultado[campo] = null;
      continue;
    }

    if (
      !['number', 'string'].includes(
        typeof dados[campo]
      ) ||
      String(dados[campo]).trim() === ''
    ) {
      throw criarErro(`${campo} inválida.`);
    }

    const valor = Number(dados[campo]);

    if (
      !Number.isFinite(valor) ||
      valor < -limite ||
      valor > limite
    ) {
      throw criarErro(`${campo} inválida.`);
    }

    resultado[campo] = valor;
  }

  return resultado;
}

// ============================================================
// VALIDAR PAR DE COORDENADAS
// ============================================================

function validarCoordenadas(
  latitude,
  longitude
) {
  const temLatitude = latitude != null;
  const temLongitude = longitude != null;

  if (temLatitude !== temLongitude) {
    throw criarErro(
      'Informe a latitude e a longitude juntas.'
    );
  }
}

// ============================================================
// CRIAR ATIVIDADE
// ============================================================

async function criarAtividade(
  usuarioId,
  dados
) {
  const valores = await validarDados(
    dados,
    true
  );

  if (atividadeVencida(valores.dataAtividade, valores.horaInicio)) {
    throw criarErro('A data e o horário da atividade devem estar no futuro.');
  }

  validarCoordenadas(
    valores.latitude,
    valores.longitude
  );

  const atividade =
    await Atividade.create({
      ...valores,
      criadorId: usuarioId,
      ativo: true,
    });

  return obterAtividade(
    atividade.id,
    usuarioId
  );
}

// ============================================================
// ATUALIZAR ATIVIDADE
// ============================================================

async function atualizarAtividade(
  id,
  usuarioId,
  dados
) {
  const atividade =
    await buscarAtividade(id);

  validarCriador(
    atividade,
    usuarioId
  );

  const valores =
    await validarDados(dados);

  const dataAtividade = valores.dataAtividade ?? atividade.dataAtividade;
  const horaInicio = valores.horaInicio ?? atividade.horaInicio;

  const alterouHorario =
    dataAtividade !== atividade.dataAtividade ||
    horaInicio !== atividade.horaInicio;

  if (alterouHorario && atividadeVencida(dataAtividade, horaInicio)) {
    throw criarErro('A data e o horário da atividade devem estar no futuro.');
  }

  if (Object.keys(valores).length === 0) {
    throw criarErro(
      'Nenhum campo válido informado.'
    );
  }

  const latitude =
    valores.latitude !== undefined
      ? valores.latitude
      : atividade.latitude;

  const longitude =
    valores.longitude !== undefined
      ? valores.longitude
      : atividade.longitude;

  validarCoordenadas(
    latitude,
    longitude
  );

  await atividade.update(valores);

  return obterAtividade(
    id,
    usuarioId
  );
}

// ============================================================
// EXCLUIR ATIVIDADE
// ============================================================

async function excluirAtividade(id, usuarioId) {
  const sequelize = Atividade.sequelize;
  let imagemAnterior = null;

  const resultado = await sequelize.transaction(async (transaction) => {
    if (!uuidValido(id)) {
      throw criarErro('Identificador inválido.');
    }

    const atividade = await Atividade.findOne({
      where: { id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!atividade) {
      throw criarErro('Atividade não encontrada.', 404);
    }

    validarCriador(atividade, usuarioId);

    imagemAnterior = atividade.imagemUrl;

    // Excluir interesses associados
    await InteresseAtividade.destroy({
      where: { atividadeId: id },
      transaction,
    });

    // Excluir favoritos associados
    await FavoritoAtividade.destroy({
      where: { atividadeId: id },
      transaction,
    });

    // Excluir atividade
    await atividade.destroy({ transaction });

    return {
      mensagem: 'Atividade excluída com sucesso.',
    };
  });

  // Remover imagem após confirmar a exclusão
  try {
    await removerArquivo(imagemAnterior, id);
  } catch (erro) {
    console.error('Erro ao remover imagem da atividade:', erro.message);
  }

  return resultado;
}

module.exports = {
  listarAtividades,
  obterAtividade,
  criarAtividade,
  atualizarAtividade,
  excluirAtividade,
  formatarAtividade,
};