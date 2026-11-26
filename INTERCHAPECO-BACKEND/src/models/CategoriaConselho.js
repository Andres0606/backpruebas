
// MODEL — Categoria de conselho

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaConselho = sequelize.define('CategoriaConselho', {
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
  tableName: 'categorias_conselho',
  timestamps: false,
});

module.exports = CategoriaConselho;
