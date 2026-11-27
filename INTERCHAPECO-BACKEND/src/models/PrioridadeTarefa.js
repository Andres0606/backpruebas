// MODEL — Prioridade de tarefa

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrioridadeTarefa = sequelize.define('PrioridadeTarefa', {
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
  tableName: 'prioridades_tarefa',
  timestamps: false,
});

module.exports = PrioridadeTarefa;