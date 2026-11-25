const Rol = require('./Rol');
const Pais = require('./Pais');
const Universidade = require('./Universidade');
const Usuario = require('./Usuario');
const ConfiguracaoUsuario = require('./ConfiguracaoUsuario');
const CategoriaLugar = require('./CategoriaLugar');
const Lugar = require('./Lugar');
const FavoritoLugar = require('./FavoritoLugar');

// ============================================================
// PAÍS - UNIVERSIDADE
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
// PAÍS DE ORIGEM - USUARIO
// ============================================================

Pais.hasMany(Usuario, {
  foreignKey: 'pais_origem_id',
  as: 'usuariosOrigem',
});

Usuario.belongsTo(Pais, {
  foreignKey: 'pais_origem_id',
  as: 'paisOrigem',
});

// ============================================================
// UNIVERSIDADE DE ORIGEM - USUARIO
// ============================================================

Universidade.hasMany(Usuario, {
  foreignKey: 'universidade_origem_id',
  as: 'usuariosOrigem',
});

Usuario.belongsTo(Universidade, {
  foreignKey: 'universidade_origem_id',
  as: 'universidadeOrigem',
});

// ============================================================
// UNIVERSIDADE DE DESTINO - USUARIO
// ============================================================

Universidade.hasMany(Usuario, {
  foreignKey: 'universidade_destino_id',
  as: 'usuariosDestino',
});

Usuario.belongsTo(Universidade, {
  foreignKey: 'universidade_destino_id',
  as: 'universidadeDestino',
});

// ============================================================
// USUÁRIO - CONFIGURAÇÕES
// ============================================================

Usuario.hasOne(ConfiguracaoUsuario, {
  foreignKey: 'usuarioId',
  as: 'configuracoes',
  onDelete: 'CASCADE',
});

ConfiguracaoUsuario.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ============================================================
// CATEGORIA - LUGAR
// ============================================================

CategoriaLugar.hasMany(Lugar, {
  foreignKey: 'categoriaId',
  as: 'lugares',
  onDelete: 'SET NULL',
});

Lugar.belongsTo(CategoriaLugar, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

// ============================================================
// USUÁRIO - FAVORITOS DE LUGARES
// ============================================================

Usuario.hasMany(FavoritoLugar, {
  foreignKey: 'usuarioId',
  as: 'favoritosLugares',
  onDelete: 'CASCADE',
});

FavoritoLugar.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ============================================================
// LUGAR - FAVORITOS
// ============================================================

Lugar.hasMany(FavoritoLugar, {
  foreignKey: 'lugarId',
  as: 'favoritos',
  onDelete: 'CASCADE',
});

FavoritoLugar.belongsTo(Lugar, {
  foreignKey: 'lugarId',
  as: 'lugar',
});

module.exports = {
  Rol,
  Pais,
  Universidade,
  Usuario,
  ConfiguracaoUsuario,
  CategoriaLugar,
  Lugar,
  FavoritoLugar,
};