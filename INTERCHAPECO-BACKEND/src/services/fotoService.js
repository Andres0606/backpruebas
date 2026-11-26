const { randomUUID } = require('crypto');

const supabase = require('../config/supabase');
const { Usuario } = require('../models');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET;

// ============================================================
// CRIAR ERRO
// ============================================================

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// ============================================================
// BUSCAR USUÁRIO
// ============================================================

async function buscarUsuario(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId);

  if (!usuario) {
    throw criarErro('Usuário não encontrado.', 404);
  }

  if (!usuario.ativo) {
    throw criarErro('Usuário inativo.', 403);
  }

  return usuario;
}

// ============================================================
// VALIDAR IMAGEM
// ============================================================

function validarImagem(arquivo) {
  if (!arquivo?.buffer?.length) {
    throw criarErro('Nenhuma imagem foi enviada.', 400);
  }

  const buffer = arquivo.buffer;

  // JPEG
  if (
    arquivo.mimetype === 'image/jpeg' &&
    buffer.subarray(0, 3).toString('hex') === 'ffd8ff'
  ) {
    return 'jpg';
  }

  // PNG
  if (
    arquivo.mimetype === 'image/png' &&
    buffer.subarray(0, 8).toString('hex') ===
      '89504e470d0a1a0a'
  ) {
    return 'png';
  }

  // WEBP
  if (
    arquivo.mimetype === 'image/webp' &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }

  throw criarErro('Formato de imagem inválido.', 400);
}

// ============================================================
// REMOVER ARQUIVO DO STORAGE
// ============================================================

async function removerArquivo(fotoUrl, usuarioId) {
  if (!fotoUrl) {
    return;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${usuarioId}/`);

  const prefixo = data.publicUrl;

  if (!fotoUrl.startsWith(prefixo)) {
    return;
  }

  const nomeArquivo = fotoUrl.slice(prefixo.length);

  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(nomeArquivo)) {
    return;
  }

  const caminho = `${usuarioId}/${nomeArquivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([caminho]);

  if (error) {
    throw error;
  }
}

// ============================================================
// ENVIAR FOTO
// ============================================================

async function enviarFoto(usuarioId, arquivo) {
  const usuario = await buscarUsuario(usuarioId);

  const extensao = validarImagem(arquivo);

  const fotoAnterior = usuario.fotoUrl;

  const caminho =
    `${usuarioId}/${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo.buffer, {
      contentType: arquivo.mimetype,
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error.message);

    throw criarErro(
      'Não foi possível enviar a foto.',
      500
    );
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho);

  const fotoUrl = data.publicUrl;

  try {
    await usuario.update({
      fotoUrl,
    });
  } catch (erro) {
    const { error: erroRemocao } = await supabase.storage
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

  // Remover foto anterior após salvar a nova

  try {
    await removerArquivo(fotoAnterior, usuarioId);
  } catch (erro) {
    console.error(
      'Erro ao remover foto anterior:',
      erro.message
    );
  }

  return {
    fotoUrl,
  };
}

// ============================================================
// EXCLUIR FOTO
// ============================================================

async function excluirFoto(usuarioId) {
  const usuario = await buscarUsuario(usuarioId);

  const fotoAnterior = usuario.fotoUrl;

  await usuario.update({
    fotoUrl: null,
  });

  try {
    await removerArquivo(fotoAnterior, usuarioId);
  } catch (erro) {
    console.error(
      'Erro ao remover arquivo:',
      erro.message
    );
  }

  return {
    fotoUrl: null,
  };
}

module.exports = {
  enviarFoto,
  excluirFoto,
  validarImagem,
};