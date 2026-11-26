
// MODEL — Atividade

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atividade = sequelize.define(
  'Atividade',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    criadorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'criador_id',
    },

    categoriaId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'categoria_id',
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    dataAtividade: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'data_atividade',
    },

    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'hora_inicio',
    },

    local: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: -90,
        max: 90,
      },
    },

    longitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: -180,
        max: 180,
      },
    },

    imagemUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'imagem_url',
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'atividades',

    timestamps: true,

    createdAt: 'criado_em',

    updatedAt: 'atualizado_em',
  }
);

module.exports = Atividade;
