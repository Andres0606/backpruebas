const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'rol_id',
    },

    nomeCompleto: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'nome_completo',
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    senhaHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'senha_hash',
    },

    paisOrigemId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'pais_origem_id',
    },

    universidadeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'universidade_id',
    },

    fotoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'foto_url',
    },

    idioma: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'pt-BR',
    },

    tema: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'claro',
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  }
);

module.exports = Usuario;