
// MODEL — Categoria de atividade

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaAtividade = sequelize.define(
  'CategoriaAtividade',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'categorias_atividade',

    timestamps: false,
  }
);

module.exports = CategoriaAtividade;
