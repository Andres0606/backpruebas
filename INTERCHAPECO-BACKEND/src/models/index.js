const Rol = require('./Rol');
const Pais = require('./Pais');
const Universidade = require('./Universidade');
const Usuario = require('./Usuario');
const ConfiguracaoUsuario = require('./ConfiguracaoUsuario');
const CategoriaLugar = require('./CategoriaLugar');
const Lugar = require('./Lugar');
const FavoritoLugar = require('./FavoritoLugar');
const CategoriaAtividade = require('./CategoriaAtividade');
const Atividade = require('./Atividade');
const InteresseAtividade = require('./InteresseAtividade');
const FavoritoAtividade = require('./FavoritoAtividade');
const CategoriaConselho = require('./CategoriaConselho');
const Conselho = require('./Conselho');
const CurtidaConselho = require('./CurtidaConselho');
const ComentarioConselho = require('./ComentarioConselho');
const EtapaIntercambio = require('./EtapaIntercambio');
const EstadoTarefa = require('./EstadoTarefa');
const PrioridadeTarefa = require('./PrioridadeTarefa');
const Tarefa = require('./Tarefa');
const CategoriaGasto = require('./CategoriaGasto');
const Gasto = require('./Gasto');
const OrcamentoMensal = require('./OrcamentoMensal');
const CategoriaFrase = require('./CategoriaFrase');
const Frase = require('./Frase');
const FavoritoFrase = require('./FavoritoFrase');
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


// ============================================================
// USUÁRIO - ATIVIDADES CRIADAS
// ============================================================

Usuario.hasMany(Atividade, {
  foreignKey: 'criadorId',
  as: 'atividadesCriadas',
});

Atividade.belongsTo(Usuario, {
  foreignKey: 'criadorId',
  as: 'criador',
});

// ============================================================
// CATEGORIA - ATIVIDADE
// ============================================================

CategoriaAtividade.hasMany(Atividade, {
  foreignKey: 'categoriaId',
  as: 'atividades',
});

Atividade.belongsTo(CategoriaAtividade, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

// ============================================================
// USUÁRIO - INTERESSES EM ATIVIDADES
// ============================================================

Usuario.hasMany(InteresseAtividade, {
  foreignKey: 'usuarioId',
  as: 'interessesAtividades',
});

InteresseAtividade.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ============================================================
// ATIVIDADE - INTERESSES
// ============================================================

Atividade.hasMany(InteresseAtividade, {
  foreignKey: 'atividadeId',
  as: 'interesses',
});

InteresseAtividade.belongsTo(Atividade, {
  foreignKey: 'atividadeId',
  as: 'atividade',
});

// ============================================================
// USUÁRIO - FAVORITOS DE ATIVIDADES
// ============================================================

Usuario.hasMany(FavoritoAtividade, {
  foreignKey: 'usuarioId',
  as: 'favoritosAtividades',
});

FavoritoAtividade.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ============================================================
// ATIVIDADE - FAVORITOS
// ============================================================

Atividade.hasMany(FavoritoAtividade, {
  foreignKey: 'atividadeId',
  as: 'favoritos',
});

FavoritoAtividade.belongsTo(Atividade, {
  foreignKey: 'atividadeId',
  as: 'atividade',
});


// USUÁRIO - CONSELHOS

Usuario.hasMany(Conselho, {
  foreignKey: 'usuarioId',
  as: 'conselhos',
});

Conselho.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'autor',
});

// CATEGORIA - CONSELHOS

CategoriaConselho.hasMany(Conselho, {
  foreignKey: 'categoriaId',
  as: 'conselhos',
});

Conselho.belongsTo(CategoriaConselho, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

// USUÁRIO - CURTIDAS

Usuario.hasMany(CurtidaConselho, {
  foreignKey: 'usuarioId',
  as: 'curtidasConselhos',
});

CurtidaConselho.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// CONSELHO - CURTIDAS

Conselho.hasMany(CurtidaConselho, {
  foreignKey: 'conselhoId',
  as: 'curtidas',
});

CurtidaConselho.belongsTo(Conselho, {
  foreignKey: 'conselhoId',
  as: 'conselho',
});

// USUÁRIO - COMENTÁRIOS

Usuario.hasMany(ComentarioConselho, {
  foreignKey: 'usuarioId',
  as: 'comentariosConselhos',
});

ComentarioConselho.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'autor',
});

// CONSELHO - COMENTÁRIOS

Conselho.hasMany(ComentarioConselho, {
  foreignKey: 'conselhoId',
  as: 'comentarios',
});

ComentarioConselho.belongsTo(Conselho, {
  foreignKey: 'conselhoId',
  as: 'conselho',
});


// USUÁRIO - TAREFAS

Usuario.hasMany(Tarefa, {
  foreignKey: 'usuarioId',
  as: 'tarefas',
});

Tarefa.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ETAPA - TAREFAS

EtapaIntercambio.hasMany(Tarefa, {
  foreignKey: 'etapaId',
  as: 'tarefas',
});

Tarefa.belongsTo(EtapaIntercambio, {
  foreignKey: 'etapaId',
  as: 'etapa',
});

// ESTADO - TAREFAS

EstadoTarefa.hasMany(Tarefa, {
  foreignKey: 'estadoId',
  as: 'tarefas',
});

Tarefa.belongsTo(EstadoTarefa, {
  foreignKey: 'estadoId',
  as: 'estado',
});

// PRIORIDADE - TAREFAS

PrioridadeTarefa.hasMany(Tarefa, {
  foreignKey: 'prioridadeId',
  as: 'tarefas',
});

Tarefa.belongsTo(PrioridadeTarefa, {
  foreignKey: 'prioridadeId',
  as: 'prioridade',
});

// USUÁRIO - GASTOS

Usuario.hasMany(Gasto, {
  foreignKey: 'usuarioId',
  as: 'gastos',
  onDelete: 'CASCADE',
});

Gasto.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// CATEGORIA - GASTOS

CategoriaGasto.hasMany(Gasto, {
  foreignKey: 'categoriaId',
  as: 'gastos',
  onDelete: 'SET NULL',
});

Gasto.belongsTo(CategoriaGasto, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

// USUÁRIO - ORÇAMENTOS

Usuario.hasMany(OrcamentoMensal, {
  foreignKey: 'usuarioId',
  as: 'orcamentos',
  onDelete: 'CASCADE',
});

OrcamentoMensal.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// CATEGORIA - FRASES

CategoriaFrase.hasMany(Frase, {
  foreignKey: 'categoriaId',
  as: 'frases',
  onDelete: 'SET NULL',
});

Frase.belongsTo(CategoriaFrase, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

// USUÁRIO - FRASES FAVORITAS

Usuario.hasMany(FavoritoFrase, {
  foreignKey: 'usuarioId',
  as: 'favoritosFrases',
  onDelete: 'CASCADE',
});

FavoritoFrase.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// FRASE - FAVORITOS

Frase.hasMany(FavoritoFrase, {
  foreignKey: 'fraseId',
  as: 'favoritos',
  onDelete: 'CASCADE',
});

FavoritoFrase.belongsTo(Frase, {
  foreignKey: 'fraseId',
  as: 'frase',
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
  CategoriaAtividade,
  Atividade,
  InteresseAtividade,
  FavoritoAtividade,
  CategoriaConselho,
  Conselho,
  CurtidaConselho,
  ComentarioConselho,
  EtapaIntercambio,
  EstadoTarefa,
  PrioridadeTarefa,
  Tarefa,
  CategoriaGasto,
  Gasto,
  OrcamentoMensal,
  CategoriaFrase,
  Frase,
  FavoritoFrase,
};