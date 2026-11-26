// SERVICE — Fotografias de lugares

const { randomUUID } = require('crypto');

const supabase = require('../config/supabase');

const { Lugar } = require('../models');

const { validarImagem } = require('./fotoService');

const BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET_LUGARES;

// ============================================================
// CRIAR ERRO
// ============================================================

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// ============================================================
// BUSCAR LUGAR
// ============================================================

async function buscarLugar(id, opcoes = {}) {
  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw criarErro(
      'Identificador inválido.'
    );
  }

  const lugar = await Lugar.findByPk(
    id,
    opcoes
  );

  if (!lugar) {
    throw criarErro(
      'Lugar não encontrado.',
      404
    );
  }

  return lugar;
}

// ============================================================
// REMOVER ARQUIVO DO STORAGE
// ============================================================

async function removerArquivo(imagemUrl, lugarId) {
  if (!imagemUrl) {
    return;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${lugarId}/`);

  const prefixo = data.publicUrl;

  if (!imagemUrl.startsWith(prefixo)) {
    return;
  }

  const nomeArquivo =
    imagemUrl.slice(prefixo.length);

  if (
    !/^[a-f0-9-]+\.(jpg|png|webp)$/.test(
      nomeArquivo
    )
  ) {
    return;
  }

  const caminho =
    `${lugarId}/${nomeArquivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([caminho]);

  if (error) {
    throw error;
  }
}

// ============================================================
// ENVIAR FOTO DO LUGAR
// ============================================================

async function enviarFotoLugar(lugarId, arquivo) {
  await buscarLugar(lugarId);

  const extensao = validarImagem(arquivo);

  const caminho =
    `${lugarId}/${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo.buffer, {
      contentType: arquivo.mimetype,
      upsert: false,
    });

  if (error) {
    console.error(
      'Erro no upload da imagem:',
      error.message
    );

    throw criarErro(
      'Não foi possível enviar a imagem.',
      500
    );
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho);

  const imagemUrl = data.publicUrl;

  let imagemAnterior;

  try {
    await Lugar.sequelize.transaction(
      async (transaction) => {
        const lugar = await buscarLugar(
          lugarId,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
          }
        );

        imagemAnterior = lugar.imagemUrl;

        await lugar.update(
          { imagemUrl },
          { transaction }
        );
      }
    );

  } catch (erro) {

    const { error: erroRemocao } =
      await supabase.storage
        .from(BUCKET)
        .remove([caminho]);

    if (erroRemocao) {
      console.error(
        'Erro ao limpar arquivo:',
        erroRemocao.message
      );
    }

    throw erro;
  }

  // Remover a imagem anterior após salvar a nova.

  try {
    await removerArquivo(
      imagemAnterior,
      lugarId
    );
  } catch (erro) {
    console.error(
      'Erro ao remover imagem anterior:',
      erro.message
    );
  }

  return {
    lugarId,
    imagemUrl,
  };
}

// ============================================================
// EXCLUIR FOTO DO LUGAR
// ============================================================

async function excluirFotoLugar(lugarId) {
  let imagemAnterior;

  await Lugar.sequelize.transaction(
    async (transaction) => {
      const lugar = await buscarLugar(
        lugarId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      imagemAnterior = lugar.imagemUrl;

      await lugar.update(
        { imagemUrl: null },
        { transaction }
      );
    }
  );

  try {
    await removerArquivo(
      imagemAnterior,
      lugarId
    );
  } catch (erro) {
    console.error(
      'Erro ao remover imagem:',
      erro.message
    );
  }

  return {
    lugarId,
    imagemUrl: null,
  };
}

module.exports = {
  enviarFotoLugar,
  excluirFotoLugar,
};