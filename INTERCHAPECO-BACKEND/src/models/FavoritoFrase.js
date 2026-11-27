// MODEL — Frase favorita do usuário

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritoFrase = sequelize.define('FavoritoFrase', {
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'usuario_id',
  },
  fraseId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'frase_id',
  },
  criadoEm: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'criado_em',
  },
}, {
  tableName: 'favoritos_frases',
  timestamps: false,
});

module.exports = FavoritoFrase;