
// MODEL — Comentário em conselho

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComentarioConselho = sequelize.define('ComentarioConselho', {
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
  conselhoId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'conselho_id',
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'comentarios_conselhos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = ComentarioConselho;
