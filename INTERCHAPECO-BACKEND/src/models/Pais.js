const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pais = sequelize.define(
  'Pais',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    codigoIso: {
      type: DataTypes.CHAR(2),
      allowNull: true,
      unique: true,
      field: 'codigo_iso',
    },
  },
  {
    tableName: 'paises',
    timestamps: false,
  }
);

module.exports = Pais;