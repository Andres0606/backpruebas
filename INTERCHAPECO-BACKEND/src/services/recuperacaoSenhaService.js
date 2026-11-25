// SERVICE — Recuperação de senha

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const sequelize = require('../config/database');
const Usuario = require('../models/Usuario');

const TokenRecuperacaoSenha =
  require('../models/TokenRecuperacaoSenha');

const { enviarEmail } = require('./emailService');

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const TEMPO_EXPIRACAO = 15 * 60 * 1000;
const INTERVALO_SOLICITACAO = 60 * 1000;

const MENSAGEM_SOLICITACAO =
  'Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.';

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function gerarToken() {
  return crypto.randomBytes(32).toString('hex');
}

function gerarHashToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

// ============================================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ============================================================

async function solicitarRecuperacao({ email } = {}) {
  if (typeof email !== 'string') {
    throw criarErro('Informe um e-mail válido.');
  }

  const emailNormalizado =
    email.trim().toLowerCase();

  if (
    emailNormalizado.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailNormalizado
    )
  ) {
    throw criarErro('Informe um e-mail válido.');
  }

  const resultado = await sequelize.transaction(
    async (transaction) => {

      const usuario = await Usuario.findOne({
        where: {
          email: emailNormalizado,
          ativo: true,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!usuario) {
        return null;
      }

      // Evita solicitações consecutivas.

      const tokenRecente =
        await TokenRecuperacaoSenha.findOne({
          where: {
            usuarioId: usuario.id,

            criadoEm: {
              [Op.gt]: new Date(
                Date.now() - INTERVALO_SOLICITACAO
              ),
            },
          },
          transaction,
        });

      if (tokenRecente) {
        return null;
      }

      // Invalida tokens anteriores.

      await TokenRecuperacaoSenha.update(
        {
          utilizadoEm: new Date(),
        },
        {
          where: {
            usuarioId: usuario.id,
            utilizadoEm: null,
          },
          transaction,
        }
      );

      // Gera um novo token seguro.

      const token = gerarToken();

      const tokenHash = gerarHashToken(token);

      const expiraEm = new Date(
        Date.now() + TEMPO_EXPIRACAO
      );

      const registro =
        await TokenRecuperacaoSenha.create(
          {
            usuarioId: usuario.id,
            tokenHash,
            expiraEm,
          },
          {
            transaction,
          }
        );

      return {
        registroId: registro.id,
        email: usuario.email,
        token,
      };
    }
  );

  if (!resultado) {
    return {
      mensagem: MENSAGEM_SOLICITACAO,
    };
  }

  // ==========================================================
  // ENVIAR E-MAIL DE RECUPERAÇÃO
  // ==========================================================

  try {
    await enviarEmail({
      destinatario: resultado.email,

      assunto: 'InterChapecó - Recuperação de senha',

      texto: `
Você solicitou a recuperação da sua senha.

Seu código de recuperação é:

${resultado.token}

Este código é válido por 15 minutos.

Se você não solicitou a recuperação,
ignore esta mensagem.

Equipe InterChapecó
      `,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 24px;
          color: #333333;
        ">

          <h1>InterChapecó</h1>

          <h2>Recuperação de senha</h2>

          <p>Olá!</p>

          <p>
            Recebemos uma solicitação para
            redefinir a senha da sua conta.
          </p>

          <p>
            Utilize o código abaixo para
            continuar com a recuperação:
          </p>

          <div style="
            background-color: #F5EEE5;
            padding: 20px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            word-break: break-all;
            text-align: center;
          ">
            ${resultado.token}
          </div>

          <p>
            Este código é válido por
            <strong>15 minutos.</strong>
          </p>

          <p>
            Se você não solicitou a recuperação,
            ignore este e-mail.
          </p>

          <hr />

          <p>Equipe InterChapecó</p>

          <small>
            Esta é uma mensagem automática.
            Não compartilhe seu código.
          </small>

        </div>
      `,
    });

  } catch (erro) {
    // Invalida o token se o envio falhar.

    await TokenRecuperacaoSenha.update(
      {
        utilizadoEm: new Date(),
      },
      {
        where: {
          id: resultado.registroId,
          utilizadoEm: null,
        },
      }
    );

    console.error(
      'Falha no envio do e-mail de recuperação.'
    );
  }

  return {
    mensagem: MENSAGEM_SOLICITACAO,
  };
}

// ============================================================
// REDEFINIR SENHA
// ============================================================

async function redefinirSenha({
  token,
  novaSenha,
} = {}) {

  if (
    typeof token !== 'string' ||
    !/^[a-f0-9]{64}$/i.test(token.trim())
  ) {
    throw criarErro(
      'Código de recuperação inválido.'
    );
  }

  if (
    typeof novaSenha !== 'string' ||
    novaSenha.length < 6
  ) {
    throw criarErro(
      'A senha deve ter pelo menos 6 caracteres.'
    );
  }

  if (Buffer.byteLength(novaSenha, 'utf8') > 72) {
    throw criarErro(
      'A senha excede o tamanho máximo permitido.'
    );
  }

  const tokenHash = gerarHashToken(
    token.trim().toLowerCase()
  );

  await sequelize.transaction(
    async (transaction) => {

      const registro =
        await TokenRecuperacaoSenha.findOne({
          where: {
            tokenHash,
            utilizadoEm: null,

            expiraEm: {
              [Op.gt]: new Date(),
            },
          },
          transaction,
        });

      if (!registro) {
        throw criarErro(
          'Código inválido ou expirado.'
        );
      }

      const usuario = await Usuario.findByPk(
        registro.usuarioId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!usuario || !usuario.ativo) {
        throw criarErro(
          'Código inválido ou expirado.'
        );
      }

      // Confirma que o token continua válido
      // após obter o bloqueio do usuário.

      await registro.reload({
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (
        registro.utilizadoEm ||
        new Date(registro.expiraEm).getTime()
          <= Date.now()
      ) {
        throw criarErro(
          'Código inválido ou expirado.'
        );
      }

      // Criptografia da nova senha por hash.

      const senhaHash = await bcrypt.hash(
        novaSenha,
        10
      );

        await usuario.update(
        {
            senhaHash,

            versaoToken:
            usuario.versaoToken + 1,
        },
        {
            transaction,
        }
        );

      // Invalida todos os tokens do usuário.

      await TokenRecuperacaoSenha.update(
        {
          utilizadoEm: new Date(),
        },
        {
          where: {
            usuarioId: usuario.id,
            utilizadoEm: null,
          },
          transaction,
        }
      );
    }
  );

  return {
    mensagem: 'Senha redefinida com sucesso.',
  };
}

module.exports = {
  solicitarRecuperacao,
  redefinirSenha,
};