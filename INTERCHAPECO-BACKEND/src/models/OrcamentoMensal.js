// MODEL — Orçamento mensal

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrcamentoMensal = sequelize.define('OrcamentoMensal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'usuario_id',
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  tableName: 'orcamentos_mensais',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  indexes: [{
    unique: true,
    fields: ['usuario_id', 'ano', 'mes'],
  }],
});

module.exports = OrcamentoMensal;