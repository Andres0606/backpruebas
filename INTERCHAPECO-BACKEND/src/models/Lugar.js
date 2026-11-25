// MODEL — Lugar

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lugar = sequelize.define(
  'Lugar',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    categoriaId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'categoria_id',
    },

    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    endereco: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },

    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Chapecó',
    },

    estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Santa Catarina',
    },

    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: {
        min: -90,
        max: 90,
      },
    },

    longitude: {
      type: DataTypes.DECIMAL(9, 6),
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

    telefone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    siteUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'site_url',
    },

    horario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'lugares',

    timestamps: true,

    createdAt: 'criado_em',

    updatedAt: 'atualizado_em',
  }
);

module.exports = Lugar;