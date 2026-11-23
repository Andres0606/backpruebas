const {
  fazerLogin,
  cadastrarUsuario,
  buscarUsuarioAutenticado,
} = require('../services/authService');

// ============================================================
// LOGIN
// ============================================================

async function login(req, res) {
  try {
    const resultado =
      await fazerLogin(
        req.body
      );

    return res.status(200).json(
      resultado
    );
  } catch (erro) {
    console.error(
      'Erro ao realizar login:',
      erro
    );

    return res
      .status(
        erro.status || 500
      )
      .json({
        mensagem:
          erro.status
            ? erro.message
            : 'Erro ao realizar login.',
      });
  }
}

// ============================================================
// CADASTRO
// ============================================================

async function cadastro(req, res) {
  try {
    const resultado =
      await cadastrarUsuario(
        req.body
      );

    return res.status(201).json(
      resultado
    );
  } catch (erro) {
    console.error(
      'Erro ao cadastrar usuário:',
      erro
    );

    return res
      .status(
        erro.status || 500
      )
      .json({
        mensagem:
          erro.status
            ? erro.message
            : 'Erro ao cadastrar usuário.',
      });
  }
}

// ============================================================
// USUÁRIO AUTENTICADO
// ============================================================

async function obterUsuarioAutenticado(
  req,
  res
) {
  try {
    const usuario =
      await buscarUsuarioAutenticado(
        req.usuario.id
      );

    return res.status(200).json({
      usuario,
    });
  } catch (erro) {
    console.error(
      'Erro ao buscar usuário autenticado:',
      erro
    );

    return res
      .status(
        erro.status || 500
      )
      .json({
        mensagem:
          erro.status
            ? erro.message
            : 'Erro ao buscar usuário.',
      });
  }
}

module.exports = {
  login,
  cadastro,
  obterUsuarioAutenticado,
};