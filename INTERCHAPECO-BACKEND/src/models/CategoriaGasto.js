// MODEL — Categoria de gasto

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaGasto = sequelize.define('CategoriaGasto', {
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
}, {
  tableName: 'categorias_gasto',
  timestamps: false,
});

module.exports = CategoriaGasto;