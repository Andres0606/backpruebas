const Rol = require('./Rol');
const Pais = require('./Pais');
const Universidade = require('./Universidade');
const Usuario = require('./Usuario');

// ============================================================
// PAIS - UNIVERSIDADE
// ============================================================

Pais.hasMany(Universidade, {
  foreignKey: 'pais_id',
  as: 'universidades',
});

Universidade.belongsTo(Pais, {
  foreignKey: 'pais_id',
  as: 'pais',
});

// ============================================================
// ROL - USUARIO
// ============================================================

Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios',
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol',
});

// ============================================================
// PAIS - USUARIO
// ============================================================

Pais.hasMany(Usuario, {
  foreignKey: 'pais_origem_id',
  as: 'usuarios',
});

Usuario.belongsTo(Pais, {
  foreignKey: 'pais_origem_id',
  as: 'paisOrigem',
});

// ============================================================
// UNIVERSIDADE - USUARIO
// ============================================================

Universidade.hasMany(Usuario, {
  foreignKey: 'universidade_id',
  as: 'usuarios',
});

Usuario.belongsTo(Universidade, {
  foreignKey: 'universidade_id',
  as: 'universidade',
});

module.exports = {
  Rol,
  Pais,
  Universidade,
  Usuario,
};