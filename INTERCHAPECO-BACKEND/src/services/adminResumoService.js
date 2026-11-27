// SERVICE — Resumo administrativo

const {
  Usuario,
  Rol,
  Lugar,
  Frase,
  Conselho,
  Atividade,
  ComentarioConselho,
  CategoriaLugar,
  CategoriaFrase,
  CategoriaConselho,
  CategoriaAtividade,
} = require('../models');

async function contarEstados(model) {
  const [ativos, inativos] = await Promise.all([
    model.count({ where: { ativo: true } }),
    model.count({ where: { ativo: false } }),
  ]);

  return {
    total: ativos + inativos,
    ativos,
    inativos,
  };
}

async function obterResumo() {
  const [
    usuarios,
    administradores,
    estudantesAtivos,
    estudantesInativos,
    lugares,
    frases,
    conselhos,
    atividades,
    comentarios,
    categoriasLugar,
    categoriasFrase,
    categoriasConselho,
    categoriasAtividade,
  ] = await Promise.all([
    contarEstados(Usuario),

    Usuario.count({
      include: [{
        model: Rol,
        as: 'rol',
        required: true,
        where: { nome: 'Administrador' },
      }],
    }),

    Usuario.count({
      where: { ativo: true },
      include: [{
        model: Rol,
        as: 'rol',
        required: true,
        where: { nome: 'Estudante' },
      }],
    }),

    Usuario.count({
      where: { ativo: false },
      include: [{
        model: Rol,
        as: 'rol',
        required: true,
        where: { nome: 'Estudante' },
      }],
    }),

    contarEstados(Lugar),
    contarEstados(Frase),
    contarEstados(Conselho),
    contarEstados(Atividade),
    ComentarioConselho.count(),
    CategoriaLugar.count(),
    CategoriaFrase.count(),
    CategoriaConselho.count(),
    CategoriaAtividade.count(),
  ]);

  return {
    usuarios: {
      ...usuarios,
      administradores,
      estudantes: estudantesAtivos + estudantesInativos,
      estudantesAtivos,
      estudantesInativos,
    },
    lugares,
    frases,
    conselhos,
    atividades,
    comentarios,
    categorias: {
      total: categoriasLugar + categoriasFrase +
        categoriasConselho + categoriasAtividade,
      lugares: categoriasLugar,
      frases: categoriasFrase,
      conselhos: categoriasConselho,
      atividades: categoriasAtividade,
    },
  };
}

module.exports = { obterResumo };