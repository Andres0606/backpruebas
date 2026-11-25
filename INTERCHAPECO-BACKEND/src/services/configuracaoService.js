const {
  Usuario,
  ConfiguracaoUsuario,
} = require('../models');

const sequelize = require('../config/database');

// ============================================================
// CRIAR ERRO
// ============================================================

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;

  return erro;
}

// ============================================================
// BUSCAR USUÁRIO
// ============================================================

async function buscarUsuario(usuarioId, transaction) {
  const usuario = await Usuario.findByPk(
    usuarioId,
    { transaction }
  );

  if (!usuario) {
    throw criarErro(
      'Usuário não encontrado.',
      404
    );
  }

  if (!usuario.ativo) {
    throw criarErro(
      'Usuário inativo.',
      403
    );
  }

  return usuario;
}

// ============================================================
// INICIALIZAR CONFIGURAÇÕES
// ============================================================

async function obterOuCriarConfiguracoes(
  usuarioId,
  transaction
) {
  const [configuracoes] =
    await ConfiguracaoUsuario.findOrCreate({
      where: {
        usuarioId,
      },

      defaults: {
        notificacoesAtivas: true,
        localizacaoPermitida: false,
      },

      transaction,
    });

  return configuracoes;
}

// ============================================================
// FORMATAR CONFIGURAÇÕES
// ============================================================

function formatarConfiguracoes(
  usuario,
  configuracoes
) {
  return {
    idioma: usuario.idioma,

    tema: usuario.tema,

    notificacoesAtivas:
      configuracoes.notificacoesAtivas,

    localizacaoPermitida:
      configuracoes.localizacaoPermitida,
  };
}

// ============================================================
// CONSULTAR CONFIGURAÇÕES
// ============================================================

async function obterConfiguracoes(usuarioId) {
  const usuario =
    await buscarUsuario(usuarioId);

  const configuracoes =
    await obterOuCriarConfiguracoes(usuarioId);

  return formatarConfiguracoes(
    usuario,
    configuracoes
  );
}

// ============================================================
// ATUALIZAR CONFIGURAÇÕES
// ============================================================

async function atualizarConfiguracoes(
  usuarioId,
  dados
) {
  if (
    !dados ||
    typeof dados !== 'object' ||
    Array.isArray(dados)
  ) {
    throw criarErro(
      'Dados inválidos.',
      400
    );
  }

  const {
    idioma,
    tema,
    notificacoesAtivas,
    localizacaoPermitida,
  } = dados;

  const idiomasPermitidos = [
    'pt-BR',
    'es',
    'en',
  ];

  const temasPermitidos = [
    'claro',
    'escuro',
  ];

  const camposPermitidos = [
    'idioma',
    'tema',
    'notificacoesAtivas',
    'localizacaoPermitida',
  ];

  if (
    Object.keys(dados).some(
      (campo) => !camposPermitidos.includes(campo)
    )
  ) {
    throw criarErro(
      'Campo de configuração inválido.',
      400
    );
  }

  // VALIDAR IDIOMA

  if (
    idioma !== undefined &&
    !idiomasPermitidos.includes(idioma)
  ) {
    throw criarErro(
      'Idioma inválido.',
      400
    );
  }

  // VALIDAR TEMA

  if (
    tema !== undefined &&
    !temasPermitidos.includes(tema)
  ) {
    throw criarErro(
      'Tema inválido.',
      400
    );
  }

  // VALIDAR NOTIFICAÇÕES

  if (
    notificacoesAtivas !== undefined &&
    typeof notificacoesAtivas !== 'boolean'
  ) {
    throw criarErro(
      'Valor de notificações inválido.',
      400
    );
  }

  // VALIDAR LOCALIZAÇÃO

  if (
    localizacaoPermitida !== undefined &&
    typeof localizacaoPermitida !== 'boolean'
  ) {
    throw criarErro(
      'Valor de localização inválido.',
      400
    );
  }

  // ATUALIZAR AS DUAS TABELAS

  return sequelize.transaction(
    async (transaction) => {
      const usuario = await buscarUsuario(
        usuarioId,
        transaction
      );

      const configuracoes =
        await obterOuCriarConfiguracoes(
          usuarioId,
          transaction
        );

      const dadosUsuario = {};

      const dadosConfiguracoes = {};

      if (idioma !== undefined) {
        dadosUsuario.idioma = idioma;
      }

      if (tema !== undefined) {
        dadosUsuario.tema = tema;
      }

      if (notificacoesAtivas !== undefined) {
        dadosConfiguracoes.notificacoesAtivas =
          notificacoesAtivas;
      }

      if (localizacaoPermitida !== undefined) {
        dadosConfiguracoes.localizacaoPermitida =
          localizacaoPermitida;

        if (!localizacaoPermitida) {
          dadosConfiguracoes.latitude = null;
          dadosConfiguracoes.longitude = null;
          dadosConfiguracoes.precisaoLocalizacao = null;
          dadosConfiguracoes.localizacaoAtualizadaEm = null;
        }
      }

      if (Object.keys(dadosUsuario).length > 0) {
        await usuario.update(
          dadosUsuario,
          { transaction }
        );
      }

      if (
        Object.keys(dadosConfiguracoes).length > 0
      ) {
        await configuracoes.update(
          dadosConfiguracoes,
          { transaction }
        );
      }

      return formatarConfiguracoes(
        usuario,
        configuracoes
      );
    }
  );
}

module.exports = {
  obterConfiguracoes,
  atualizarConfiguracoes,
};