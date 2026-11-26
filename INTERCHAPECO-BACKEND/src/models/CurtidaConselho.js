
// MODEL — Curtida em conselho

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CurtidaConselho = sequelize.define('CurtidaConselho', {
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'usuario_id',
  },
  conselhoId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'conselho_id',
  },
  criadoEm: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'criado_em',
  },
}, {
  tableName: 'curtidas_conselhos',
  timestamps: false,
});

module.exports = CurtidaConselho;
