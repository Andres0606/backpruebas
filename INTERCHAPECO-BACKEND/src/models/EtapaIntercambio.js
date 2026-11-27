// MODEL — Etapa de intercâmbio

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EtapaIntercambio = sequelize.define('EtapaIntercambio', {
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
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: { min: 1 },
  },
}, {
  tableName: 'etapas_intercambio',
  timestamps: false,
});

module.exports = EtapaIntercambio;