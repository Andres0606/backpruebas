// SERVICE — Gerenciamento de lugares

const {
  Lugar,
  CategoriaLugar,
} = require('../models');

const { Op } = require('sequelize');

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

const incluirCategoria = {
  model: CategoriaLugar,
  as: 'categoria',
  attributes: ['id', 'nome'],
};

// ============================================================
// FORMATAR LUGAR
// ============================================================

function formatarLugar(lugar) {
  const dados = lugar.toJSON();

  return {
    ...dados,

    latitude:
      dados.latitude === null
        ? null
        : Number(dados.latitude),

    longitude:
      dados.longitude === null
        ? null
        : Number(dados.longitude),
  };
}

// ============================================================
// LISTAR LUGARES
// ============================================================

async function listarLugares({
  busca,
  categoriaId,
  incluirInativos = false,
} = {}) {

  const where = {};

  if (!incluirInativos) {
    where.ativo = true;
  }

  if (categoriaId) {
    if (!uuidValido(categoriaId)) {
      throw criarErro('Categoria inválida.');
    }

    where.categoriaId = categoriaId;
  }

  if (busca !== undefined) {
    if (
      typeof busca !== 'string' ||
      busca.length > 150
    ) {
      throw criarErro('Busca inválida.');
    }

    const termo = busca.trim();

    if (termo) {
      where[Op.or] = [
        {
          nome: {
            [Op.iLike]: `%${termo}%`,
          },
        },
        {
          descricao: {
            [Op.iLike]: `%${termo}%`,
          },
        },
        {
          endereco: {
            [Op.iLike]: `%${termo}%`,
          },
        },
      ];
    }
  }

  const lugares = await Lugar.findAll({
    where,
    include: [incluirCategoria],
    order: [['nome', 'ASC']],
  });

  return lugares.map(formatarLugar);
}

// ============================================================
// OBTER LUGAR
// ============================================================

async function buscarLugar(
  id,
  incluirInativos = false
) {
  if (!uuidValido(id)) {
    throw criarErro('Identificador inválido.');
  }

  const where = { id };

  if (!incluirInativos) {
    where.ativo = true;
  }

  const lugar = await Lugar.findOne({
    where,
    include: [incluirCategoria],
  });

  if (!lugar) {
    throw criarErro(
      'Lugar não encontrado.',
      404
    );
  }

  return lugar;
}

async function obterLugar(
  id,
  incluirInativos = false
) {
  const lugar = await buscarLugar(
    id,
    incluirInativos
  );

  return formatarLugar(lugar);
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

  // A imagem deve ser gerenciada pela rota de upload.

  if (
    Object.prototype.hasOwnProperty.call(
      dados,
      'imagemUrl'
    )
  ) {
    throw criarErro(
      'Utilize a rota de fotografias para alterar a imagem.'
    );
  }

  const resultado = {};

  const camposTexto = {
    nome: 150,
    descricao: 5000,
    endereco: 250,
    cidade: 100,
    estado: 100,
    telefone: 30,
    horario: 2000,
    siteUrl: 2048,
  };

  const obrigatorios = [
    'nome',
    'cidade',
    'estado',
  ];

  for (
    const [campo, limite]
    of Object.entries(camposTexto)
  ) {
    if (dados[campo] === undefined) {
      continue;
    }

    if (
      dados[campo] !== null &&
      typeof dados[campo] !== 'string'
    ) {
      throw criarErro(
        `Campo ${campo} inválido.`
      );
    }

    const valor =
      dados[campo]?.trim() || null;

    if (
      obrigatorios.includes(campo) &&
      !valor
    ) {
      throw criarErro(
        `O campo ${campo} é obrigatório.`
      );
    }

    if (valor && valor.length > limite) {
      throw criarErro(
        `O campo ${campo} excede o limite permitido.`
      );
    }

    // Validar URL do site

    if (
      valor &&
      campo === 'siteUrl'
    ) {
      try {
        const url = new URL(valor);

        if (
          !['http:', 'https:'].includes(
            url.protocol
          )
        ) {
          throw new Error();
        }
      } catch {
        throw criarErro(
          `O campo ${campo} deve conter uma URL válida.`
        );
      }
    }

    resultado[campo] = valor;
  }

  if (criacao && !resultado.nome) {
    throw criarErro(
      'Informe o nome do lugar.'
    );
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
        await CategoriaLugar.findByPk(
          dados.categoriaId
        );

      if (!categoria) {
        throw criarErro(
          'Categoria não encontrada.',
          404
        );
      }

      resultado.categoriaId = categoria.id;
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
      throw criarErro(
        `${campo} inválida.`
      );
    }

    const valor = Number(dados[campo]);

    if (
      !Number.isFinite(valor) ||
      valor < -limite ||
      valor > limite
    ) {
      throw criarErro(
        `${campo} inválida.`
      );
    }

    resultado[campo] = valor;
  }

  // Validar estado do lugar

  if (dados.ativo !== undefined) {
    if (typeof dados.ativo !== 'boolean') {
      throw criarErro(
        'O campo ativo deve ser booleano.'
      );
    }

    resultado.ativo = dados.ativo;
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
// CRIAR LUGAR
// ============================================================

async function criarLugar(dados) {
  const valores = await validarDados(
    dados,
    true
  );

  validarCoordenadas(
    valores.latitude,
    valores.longitude
  );

  const lugar = await Lugar.create(valores);

  return obterLugar(lugar.id, true);
}

// ============================================================
// ATUALIZAR LUGAR
// ============================================================

async function atualizarLugar(id, dados) {
  const lugar = await buscarLugar(id, true);

  const valores = await validarDados(dados);

  if (Object.keys(valores).length === 0) {
    throw criarErro(
      'Nenhum campo válido informado.'
    );
  }

  const latitude =
    valores.latitude !== undefined
      ? valores.latitude
      : lugar.latitude;

  const longitude =
    valores.longitude !== undefined
      ? valores.longitude
      : lugar.longitude;

  validarCoordenadas(latitude, longitude);

  await lugar.update(valores);

  return obterLugar(id, true);
}

// ============================================================
// DESATIVAR LUGAR
// ============================================================

async function desativarLugar(id) {
  const lugar = await buscarLugar(id, true);

  await lugar.update({
    ativo: false,
  });

  return {
    mensagem:
      'Lugar desativado com sucesso.',
  };
}

module.exports = {
  listarLugares,
  obterLugar,
  criarLugar,
  atualizarLugar,
  desativarLugar,
};