// MIDDLEWARE — Autorização por perfil de acesso

function autorizar(...rolesPermitidos) {
  return function (req, res, next) {

    // Verifica se o usuário está autenticado.

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.',
      });
    }

    // Verifica se o rol possui permissão.

    if (
      !rolesPermitidos.includes(
        req.usuario.rol
      )
    ) {
      return res.status(403).json({
        mensagem:
          'Você não possui permissão para acessar este recurso.',
      });
    }

    next();
  };
}

module.exports = {
  autorizar,
};