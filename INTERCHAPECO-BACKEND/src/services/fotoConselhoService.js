
// SERVICE — Fotografias de conselhos

const { randomUUID } = require('crypto');
const supabase = require('../config/supabase');
const { Conselho } = require('../models');
const { validarImagem } = require('./fotoService');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET_CONSELHOS;

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// Buscar conselho e validar autor
async function buscarConselho(id, usuarioId, opcoes = {}) {
  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw criarErro('Identificador inválido.');
  }

  const conselho = await Conselho.findOne({
    where: { id, ativo: true },
    ...opcoes,
  });

  if (!conselho) {
    throw criarErro('Conselho não encontrado.', 404);
  }

  if (conselho.usuarioId !== usuarioId) {
    throw criarErro(
      'Você não tem permissão para alterar este conselho.',
      403
    );
  }

  return conselho;
}

// Remover arquivo do Storage
async function removerArquivo(imagemUrl, conselhoId) {
  if (!imagemUrl) return;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${conselhoId}/`);

  const prefixo = data.publicUrl;

  if (!imagemUrl.startsWith(prefixo)) return;

  const nomeArquivo = imagemUrl.slice(prefixo.length);

  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(nomeArquivo)) {
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${conselhoId}/${nomeArquivo}`]);

  if (error) throw error;
}

// Enviar ou substituir fotografia
async function enviarFotoConselho(conselhoId, usuarioId, arquivo) {
  await buscarConselho(conselhoId, usuarioId);

  const extensao = validarImagem(arquivo);
  const caminho = `${conselhoId}/${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo.buffer, {
      contentType: arquivo.mimetype,
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error.message);
    throw criarErro('Não foi possível enviar a imagem.', 500);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho);

  const imagemUrl = data.publicUrl;
  let imagemAnterior;

  try {
    await Conselho.sequelize.transaction(async (transaction) => {
      const conselho = await buscarConselho(conselhoId, usuarioId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      imagemAnterior = conselho.imagemUrl;
      await conselho.update({ imagemUrl }, { transaction });
    });
  } catch (erro) {
    try {
      await removerArquivo(imagemUrl, conselhoId);
    } catch (erroRemocao) {
      console.error('Erro ao limpar arquivo:', erroRemocao.message);
    }

    throw erro;
  }

  try {
    await removerArquivo(imagemAnterior, conselhoId);
  } catch (erro) {
    console.error('Erro ao remover imagem anterior:', erro.message);
  }

  return { conselhoId, imagemUrl };
}

// Excluir fotografia
async function excluirFotoConselho(conselhoId, usuarioId) {
  let imagemAnterior;

  await Conselho.sequelize.transaction(async (transaction) => {
    const conselho = await buscarConselho(conselhoId, usuarioId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    imagemAnterior = conselho.imagemUrl;

    await conselho.update(
      { imagemUrl: null },
      { transaction }
    );
  });

  try {
    await removerArquivo(imagemAnterior, conselhoId);
  } catch (erro) {
    console.error('Erro ao remover imagem:', erro.message);
  }

  return { conselhoId, imagemUrl: null };
}

module.exports = {
  enviarFotoConselho,
  excluirFotoConselho,
  removerArquivo,
};
