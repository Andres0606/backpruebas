
// MODEL — Interesse em atividade

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InteresseAtividade = sequelize.define(
  'InteresseAtividade',
  {
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'usuario_id',
    },

    atividadeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'atividade_id',
    },

    criadoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'criado_em',
    },
  },
  {
    tableName: 'interesses_atividades',

    timestamps: false,
  }
);

module.exports = InteresseAtividade;
