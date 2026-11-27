// MODEL — Estado de tarefa

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstadoTarefa = sequelize.define('EstadoTarefa', {
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
  tableName: 'estados_tarefa',
  timestamps: false,
});

module.exports = EstadoTarefa;