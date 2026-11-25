// MODEL — Token de recuperação de senha

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TokenRecuperacaoSenha = sequelize.define(
  'TokenRecuperacaoSenha',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'usuario_id',
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    tokenHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: 'token_hash',
    },

    expiraEm: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expira_em',
    },

    utilizadoEm: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'utilizado_em',
    },

    criadoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'criado_em',
    },
  },
  {
    tableName: 'tokens_recuperacao_senha',
    timestamps: false,
  }
);

module.exports = TokenRecuperacaoSenha;