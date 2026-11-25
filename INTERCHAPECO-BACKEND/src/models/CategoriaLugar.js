// MODEL — Categoria de lugar

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaLugar = sequelize.define(
  'CategoriaLugar',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'categorias_lugar',
    timestamps: false,
  }
);

module.exports = CategoriaLugar;