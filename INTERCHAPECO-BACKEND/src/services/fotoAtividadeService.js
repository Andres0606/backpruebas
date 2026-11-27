
// SERVICE — Fotografias de atividades

const { randomUUID } = require('crypto');
const supabase = require('../config/supabase');
const { Atividade } = require('../models');
const { validarImagem } = require('./fotoService');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET_ATIVIDADES;

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// Buscar atividade e validar criador
async function buscarAtividade(id, usuarioId, opcoes = {}) {
  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw criarErro('Identificador inválido.');
  }

  const atividade = await Atividade.findOne({
    where: { id, ativo: true },
    ...opcoes,
  });

  if (!atividade) {
    throw criarErro('Atividade não encontrada.', 404);
  }

  if (atividade.criadorId !== usuarioId) {
    throw criarErro(
      'Você não tem permissão para alterar esta atividade.',
      403
    );
  }

  return atividade;
}

// Remover arquivo do Storage
async function removerArquivo(imagemUrl, atividadeId) {
  if (!imagemUrl) return;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${atividadeId}/`);

  const prefixo = data.publicUrl;

  if (!imagemUrl.startsWith(prefixo)) return;

  const nomeArquivo = imagemUrl.slice(prefixo.length);

  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(nomeArquivo)) {
    return;
  }

  const caminho = `${atividadeId}/${nomeArquivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([caminho]);

  if (error) throw error;
}

// Enviar ou substituir fotografia
async function enviarFotoAtividade(atividadeId, usuarioId, arquivo) {
  await buscarAtividade(atividadeId, usuarioId);

  const extensao = validarImagem(arquivo);
  const caminho = `${atividadeId}/${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo.buffer, {
      contentType: arquivo.mimetype,
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error.name);
    throw criarErro('Não foi possível enviar a imagem.', 500);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho);

  const imagemUrl = data.publicUrl;
  let imagemAnterior;

  try {
    await Atividade.sequelize.transaction(async (transaction) => {
      const atividade = await buscarAtividade(
        atividadeId,
        usuarioId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      imagemAnterior = atividade.imagemUrl;

      await atividade.update({ imagemUrl }, { transaction });
    });
  } catch (erro) {
    const { error: erroRemocao } = await supabase.storage
      .from(BUCKET)
      .remove([caminho]);

    if (erroRemocao) {
      console.error('Erro ao limpar arquivo:', erroRemocao.name);
    }

    throw erro;
  }

  // Remover a fotografia anterior
  try {
    await removerArquivo(imagemAnterior, atividadeId);
  } catch (erro) {
    console.error('Erro ao remover imagem anterior:', erro.name);
  }

  return { atividadeId, imagemUrl };
}

// Excluir fotografia
async function excluirFotoAtividade(atividadeId, usuarioId) {
  let imagemAnterior;

  await Atividade.sequelize.transaction(async (transaction) => {
    const atividade = await buscarAtividade(
      atividadeId,
      usuarioId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    imagemAnterior = atividade.imagemUrl;

    await atividade.update(
      { imagemUrl: null },
      { transaction }
    );
  });

  try {
    await removerArquivo(imagemAnterior, atividadeId);
  } catch (erro) {
    console.error('Erro ao remover imagem:', erro.name);
  }

  return {
    atividadeId,
    imagemUrl: null,
  };
}

module.exports = {
  enviarFotoAtividade,
  excluirFotoAtividade,
  removerArquivo,
};
