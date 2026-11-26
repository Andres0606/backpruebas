
// MODEL — Conselho

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conselho = sequelize.define('Conselho', {
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
  categoriaId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'categoria_id',
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagemUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'imagem_url',
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'conselhos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Conselho;
