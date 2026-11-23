const Rol = require('./Rol');
const Usuario = require('./Usuario');

Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios',
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol',
});

module.exports = {
  Rol,
  Usuario,
};