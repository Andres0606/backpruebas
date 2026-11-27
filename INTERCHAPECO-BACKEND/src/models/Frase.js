// MODEL — Frase em português

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Frase = sequelize.define('Frase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  categoriaId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'categoria_id',
  },
  frasePortugues: {
    type: DataTypes.STRING(300),
    allowNull: false,
    field: 'frase_portugues',
  },
  traducaoEspanhol: {
    type: DataTypes.STRING(300),
    allowNull: false,
    field: 'traducao_espanhol',
  },
  explicacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  audioUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'audio_url',
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'frases',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Frase;