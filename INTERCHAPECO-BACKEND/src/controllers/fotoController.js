const {
  enviarFoto,
  excluirFoto,
} = require('../services/fotoService');

// ============================================================
// ENVIAR FOTO DE PERFIL
// ============================================================

async function atualizarFotoPerfil(req, res) {
  try {
    const resultado = await enviarFoto(
      req.usuario.id,
      req.file
    );

    return res.status(200).json({
      mensagem: 'Foto atualizada com sucesso.',
      ...resultado,
    });
  } catch (erro) {
    console.error(
      'Erro ao atualizar foto:',
      erro
    );

    return res.status(erro.status || 500).json({
      mensagem:
        erro.status
          ? erro.message
          : 'Erro ao atualizar foto de perfil.',
    });
  }
}

// ============================================================
// REMOVER FOTO DE PERFIL
// ============================================================

async function removerFotoPerfil(req, res) {
  try {
    const resultado = await excluirFoto(
      req.usuario.id
    );

    return res.status(200).json({
      mensagem: 'Foto removida com sucesso.',
      ...resultado,
    });
  } catch (erro) {
    console.error(
      'Erro ao remover foto:',
      erro
    );

    return res.status(erro.status || 500).json({
      mensagem:
        erro.status
          ? erro.message
          : 'Erro ao remover foto de perfil.',
    });
  }
}

module.exports = {
  atualizarFotoPerfil,
  removerFotoPerfil,
};