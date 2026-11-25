// SERVICE — Envio de e-mails

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: process.env.SMTP_SECURE === 'true',

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ============================================================
// VERIFICAR CONEXÃO SMTP
// ============================================================

async function verificarConexaoEmail() {
  await transporter.verify();

  console.log('Conexão SMTP estabelecida com sucesso.');
}

// ============================================================
// ENVIAR E-MAIL
// ============================================================

async function enviarEmail({
  destinatario,
  assunto,
  texto,
  html,
}) {
  const resultado = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: destinatario,
    subject: assunto,
    text: texto,
    html,
  });

  return resultado;
}

module.exports = {
  verificarConexaoEmail,
  enviarEmail,
};