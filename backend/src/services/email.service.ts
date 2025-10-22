import nodemailer from 'nodemailer';
import { logger } from '../utils/simple-logger';

// Configurar transporter baseado nas variáveis de ambiente
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Usar SendGrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // Usar SMTP personalizado
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback para desenvolvimento (JSON transport)
    return nodemailer.createTransport({
      jsonTransport: true,
      port: 1025,
      secure: false,
      auth: null,
    });
  }
};

const transporter = createTransporter();

// Templates de email
const getEmailTemplate = (type: string, data: any) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const companyName = process.env.COMPANY_NAME || 'Imports Store';

  switch (type) {
    case 'welcome':
      return {
        subject: `Bem-vindo ao ${companyName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Bem-vindo ao ${companyName}!</h1>
            <p>Olá ${data.name},</p>
            <p>Obrigado por se cadastrar em nossa loja! Estamos muito felizes em tê-lo conosco.</p>
            <p>Para completar seu cadastro, por favor clique no link abaixo para verificar seu email:</p>
            <a href="${baseUrl}/auth/verify?token=${data.token}" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
              Verificar Email
            </a>
            <p>Se você não se cadastrou em nosso site, pode ignorar este email.</p>
            <p>Atenciosamente,<br>Equipe ${companyName}</p>
          </div>
        `,
        text: `
          Bem-vindo ao ${companyName}!
          
          Olá ${data.name},
          
          Obrigado por se cadastrar em nossa loja! Para completar seu cadastro, acesse: ${baseUrl}/auth/verify?token=${data.token}
          
          Se você não se cadastrou em nosso site, pode ignorar este email.
          
          Atenciosamente,
          Equipe ${companyName}
        `,
      };

    case 'verification':
      return {
        subject: `Verificação de Email - ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Verificação de Email</h1>
            <p>Olá ${data.name},</p>
            <p>Clique no link abaixo para verificar seu email:</p>
            <a href="${baseUrl}/auth/verify?token=${data.token}" 
               style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px;">
              Verificar Email
            </a>
            <p>Este link expira em 24 horas.</p>
            <p>Se você não solicitou esta verificação, pode ignorar este email.</p>
          </div>
        `,
        text: `
          Verificação de Email - ${companyName}
          
          Olá ${data.name},
          
          Clique no link para verificar seu email: ${baseUrl}/auth/verify?token=${data.token}
          
          Este link expira em 24 horas.
        `,
      };

    case 'password-reset':
      return {
        subject: `Redefinição de Senha - ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Redefinição de Senha</h1>
            <p>Olá ${data.name},</p>
            <p>Você solicitou a redefinição de sua senha. Clique no link abaixo:</p>
            <a href="${baseUrl}/auth/reset-password?token=${data.token}" 
               style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px;">
              Redefinir Senha
            </a>
            <p>Este link expira em 1 hora.</p>
            <p>Se você não solicitou esta redefinição, pode ignorar este email.</p>
          </div>
        `,
        text: `
          Redefinição de Senha - ${companyName}
          
          Olá ${data.name},
          
          Você solicitou a redefinição de sua senha. Acesse: ${baseUrl}/auth/reset-password?token=${data.token}
          
          Este link expira em 1 hora.
        `,
      };

    case 'order-confirmation':
      return {
        subject: `Pedido Confirmado #${data.orderNumber} - ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Pedido Confirmado!</h1>
            <p>Olá ${data.customerName},</p>
            <p>Seu pedido foi confirmado e está sendo processado.</p>
            <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <h3>Detalhes do Pedido #${data.orderNumber}</h3>
              <p><strong>Total:</strong> R$ ${data.total}</p>
              <p><strong>Status:</strong> ${data.status}</p>
              <p><strong>Previsão de Entrega:</strong> ${data.estimatedDelivery}</p>
            </div>
            <a href="${baseUrl}/orders/${data.orderId}" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
              Acompanhar Pedido
            </a>
          </div>
        `,
        text: `
          Pedido Confirmado #${data.orderNumber}
          
          Olá ${data.customerName},
          
          Seu pedido foi confirmado e está sendo processado.
          
          Total: R$ ${data.total}
          Status: ${data.status}
          Previsão de Entrega: ${data.estimatedDelivery}
          
          Acompanhe em: ${baseUrl}/orders/${data.orderId}
        `,
      };

    case 'shipping-update':
      return {
        subject: `Atualização de Envio #${data.orderNumber} - ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Atualização de Envio</h1>
            <p>Olá ${data.customerName},</p>
            <p>Seu pedido #${data.orderNumber} foi atualizado:</p>
            <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <p><strong>Status:</strong> ${data.status}</p>
              <p><strong>Código de Rastreamento:</strong> ${data.trackingCode}</p>
              <p><strong>Transportadora:</strong> ${data.carrier}</p>
            </div>
            <a href="${baseUrl}/orders/${data.orderId}" 
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
              Rastrear Pedido
            </a>
          </div>
        `,
        text: `
          Atualização de Envio #${data.orderNumber}
          
          Olá ${data.customerName},
          
          Status: ${data.status}
          Código de Rastreamento: ${data.trackingCode}
          Transportadora: ${data.carrier}
          
          Rastreie em: ${baseUrl}/orders/${data.orderId}
        `,
      };

    default:
      throw new Error('Template de email não encontrado');
  }
};

/**
 * Enviar email
 */
export const sendEmail = async (
  to: string,
  template: string,
  data: any,
  options?: {
    from?: string;
    replyTo?: string;
  }
) => {
  try {
    const emailTemplate = getEmailTemplate(template, data);
    const fromEmail = options?.from || process.env.FROM_EMAIL || 'noreply@importsstore.com';
    const fromName = process.env.FROM_NAME || 'Imports Store';

    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
      replyTo: options?.replyTo,
    };

    const result = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${to}`, {
      template,
      messageId: result.messageId,
    });

    return result;
  } catch (error) {
    logger.error('Error sending email:', {
      error,
      to,
      template,
    });
    throw error;
  }
};

// Funções específicas para cada tipo de email
export const sendWelcomeEmail = async (email: string, name: string, verificationToken: string) => {
  return sendEmail(email, 'welcome', { name, token: verificationToken });
};

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  return sendEmail(email, 'verification', { name, token });
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  return sendEmail(email, 'password-reset', { name, token });
};

export const sendOrderConfirmationEmail = async (email: string, orderData: any) => {
  return sendEmail(email, 'order-confirmation', orderData);
};

export const sendShippingUpdateEmail = async (email: string, shippingData: any) => {
  return sendEmail(email, 'shipping-update', shippingData);
};
