const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define(
  'Rol',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

module.exports = Rol;