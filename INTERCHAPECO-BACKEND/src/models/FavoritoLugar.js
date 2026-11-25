// MODEL — Lugar favorito do usuário

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritoLugar = sequelize.define(
  'FavoritoLugar',
  {
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'usuario_id',
    },

    lugarId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'lugar_id',
    },

    criadoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'criado_em',
    },
  },
  {
    tableName: 'favoritos_lugares',

    timestamps: false,
  }
);

module.exports = FavoritoLugar;