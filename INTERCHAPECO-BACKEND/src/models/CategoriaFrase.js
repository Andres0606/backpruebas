// MODEL — Categoria de frase

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaFrase = sequelize.define('CategoriaFrase', {
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
}, {
  tableName: 'categorias_frase',
  timestamps: false,
});

module.exports = CategoriaFrase;