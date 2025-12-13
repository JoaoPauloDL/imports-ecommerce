const nodemailer = require('nodemailer');
const crypto = require('crypto');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configurar transporter do nodemailer
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true para 465, false para outros
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Gerar token de verificação
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Template de email de verificação
function getVerificationEmailTemplate(userName, verificationLink) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirme seu Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Bem-vindo à David Imports! 🎉</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Olá <strong>${userName}</strong>,
                  </p>
                  
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Obrigado por se registrar em nossa loja! Para garantir a segurança da sua conta e começar a fazer suas compras, precisamos verificar seu endereço de email.
                  </p>
                  
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                    Clique no botão abaixo para confirmar seu email:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${verificationLink}" 
                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                          Confirmar Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    Ou copie e cole este link no seu navegador:<br>
                    <a href="${verificationLink}" style="color: #667eea; word-break: break-all;">${verificationLink}</a>
                  </p>
                  
                  <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 20px 0 0;">
                    <strong>⚠️ Este link expira em 24 horas.</strong><br>
                    Se você não criou esta conta, pode ignorar este email com segurança.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0;">
                    © ${new Date().getFullYear()} David Imports. Todos os direitos reservados.<br>
                    <a href="${FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visitar nossa loja</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Enviar email de verificação
async function sendVerificationEmail(email, userName, token) {
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"David Imports" <${SMTP_USER}>`,
      to: email,
      subject: '✅ Confirme seu email - David Imports',
      html: getVerificationEmailTemplate(userName, verificationLink),
    });

    console.log(`✅ Email de verificação enviado para: ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de verificação');
  }
}

// Template de email de boas-vindas (após verificação)
function getWelcomeEmailTemplate(userName) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Email Confirmado!</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <p style="color: #333333; font-size: 18px; line-height: 1.6; margin: 0 0 20px;">
                    Parabéns, <strong>${userName}</strong>!
                  </p>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                    Sua conta foi verificada com sucesso. Agora você pode aproveitar todas as funcionalidades da David Imports!
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${FRONTEND_URL}/products" 
                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                          Começar a Comprar
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                  <p style="color: #666666; font-size: 13px; margin: 0;">
                    © ${new Date().getFullYear()} David Imports. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Enviar email de boas-vindas
async function sendWelcomeEmail(email, userName) {
  try {
    await transporter.sendMail({
      from: `"David Imports" <${SMTP_USER}>`,
      to: email,
      subject: '🎉 Bem-vindo à David Imports!',
      html: getWelcomeEmailTemplate(userName),
    });

    console.log(`✅ Email de boas-vindas enviado para: ${email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error);
  }
}

// Verificar se o SMTP está configurado
function isEmailConfigured() {
  return !!(SMTP_USER && SMTP_PASS);
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendWelcomeEmail,
  isEmailConfigured
};
