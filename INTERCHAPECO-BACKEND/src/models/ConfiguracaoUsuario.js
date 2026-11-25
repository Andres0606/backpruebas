const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

// ============================================================
// MODEL — CONFIGURAÇÕES DO USUÁRIO
// ============================================================

const ConfiguracaoUsuario = sequelize.define(
  'ConfiguracaoUsuario',
  {
    usuarioId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      field: 'usuario_id',

      references: {
        model: 'usuarios',
        key: 'id',
      },

      onDelete: 'CASCADE',
    },

    notificacoesAtivas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'notificacoes_ativas',
    },

    localizacaoPermitida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'localizacao_permitida',
    },

    latitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },

    precisaoLocalizacao: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'precisao_localizacao',
    },

    localizacaoAtualizadaEm: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'localizacao_atualizada_em',
    },
  },
  {
    tableName: 'configuracoes_usuario',

    timestamps: true,

    createdAt: false,

    updatedAt: 'atualizado_em',
  }
);

module.exports = ConfiguracaoUsuario;