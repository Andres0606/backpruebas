// MODEL — Tarefa

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarefa = sequelize.define('Tarefa', {
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
  estadoId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'estado_id',
  },
  prioridadeId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'prioridade_id',
  },
  etapaId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'etapa_id',
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataLimite: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'data_limite',
  },
  concluidaEm: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'concluida_em',
  },
}, {
  tableName: 'tarefas',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Tarefa;