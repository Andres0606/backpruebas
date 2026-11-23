const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Universidade = sequelize.define(
  'Universidade',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    cidade: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    estado: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    paisId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'pais_id',
    },
  },
  {
    tableName: 'universidades',
    timestamps: false,
  }
);

module.exports = Universidade;