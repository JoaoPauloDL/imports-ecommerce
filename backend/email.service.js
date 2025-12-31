// Serviço de Email com Nodemailer
const nodemailer = require('nodemailer');

// Configurar transporter
let transporter;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true para porta 465, false para outras
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('✅ Email configurado com SMTP');
} else {
  console.log('⚠️  Email não configurado - Configure as variáveis SMTP no .env');
}

// Email de confirmação de pedido
async function sendOrderConfirmation(order, user) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.product.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          R$ ${parseFloat(item.price).toFixed(2)}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; color: #f59e0b; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pedido Confirmado!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${user.fullName || 'Cliente'}!</h2>
            <p>Seu pedido foi recebido com sucesso e está sendo processado.</p>
            
            <p><strong>Número do Pedido:</strong> #${order.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
            
            <h3>Itens do Pedido:</h3>
            <table>
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Produto</th>
                  <th style="padding: 10px; text-align: center;">Qtd</th>
                  <th style="padding: 10px; text-align: right;">Preço Unit.</th>
                  <th style="padding: 10px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold;">TOTAL:</td>
                  <td class="total" style="padding: 15px; text-align: right;">R$ ${parseFloat(order.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <h3>Endereço de Entrega:</h3>
            <p>
              ${order.address.street}, ${order.address.number}
              ${order.address.complement ? `<br>${order.address.complement}` : ''}
              <br>${order.address.neighborhood} - ${order.address.city}/${order.address.state}
              <br>CEP: ${order.address.zipCode}
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">
                Ver Detalhes do Pedido
              </a>
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              Você receberá atualizações por email sobre o status do seu pedido.
              Em caso de dúvidas, entre em contato conosco.
            </p>
          </div>
          <div class="footer">
            <p><strong>David Importados - Perfumaria de Luxo</strong></p>
            <p>contato@davidimportados.com | (11) 99999-9999</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: user.email,
      subject: `Pedido #${order.id.substring(0, 8).toUpperCase()} confirmado - David Importados`,
      html
    });

    console.log(`✅ Email de confirmação enviado para ${user.email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

// Email de notificação de novo pedido para o ADMIN
async function sendNewOrderNotification(order, user) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'contato@davidimportados.com';

  try {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || 'Produto'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${parseFloat(item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const total = parseFloat(order.totalAmount || 0) + parseFloat(order.shippingCost || 0);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .total { font-size: 20px; font-weight: bold; color: #10b981; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 Novo Pedido Recebido!</h1>
          </div>
          <div class="content">
            <div class="highlight">
              <strong>💰 Valor Total: R$ ${total.toFixed(2)}</strong>
            </div>
            
            <h3>📋 Detalhes do Pedido</h3>
            <p><strong>Número:</strong> #${order.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Data:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString('pt-BR')} às ${new Date(order.createdAt || new Date()).toLocaleTimeString('pt-BR')}</p>
            <p><strong>Status:</strong> ${getStatusText(order.status)}</p>
            <p><strong>Pagamento:</strong> ${order.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
            
            <h3>👤 Cliente</h3>
            <p><strong>Nome:</strong> ${user.fullName || 'Não informado'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Telefone:</strong> ${user.phone || 'Não informado'}</p>
            
            <h3>📦 Produtos</h3>
            <table>
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Produto</th>
                  <th style="padding: 10px; text-align: center;">Qtd</th>
                  <th style="padding: 10px; text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
            
            <p><strong>Subtotal:</strong> R$ ${parseFloat(order.totalAmount || 0).toFixed(2)}</p>
            <p><strong>Frete:</strong> R$ ${parseFloat(order.shippingCost || 0).toFixed(2)}</p>
            <p class="total"><strong>TOTAL: R$ ${total.toFixed(2)}</strong></p>
            
            <h3>📍 Endereço de Entrega</h3>
            <p>
              ${order.shippingAddress?.street || 'Rua não informada'}, ${order.shippingAddress?.number || 'S/N'}
              ${order.shippingAddress?.complement ? `<br>${order.shippingAddress.complement}` : ''}
              <br>${order.shippingAddress?.neighborhood || ''} - ${order.shippingAddress?.city || ''}/${order.shippingAddress?.state || ''}
              <br>CEP: ${order.shippingAddress?.zipCode || ''}
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders" class="button">
                📋 Ver no Painel Admin
              </a>
            </div>
          </div>
          <div class="footer">
            <p><strong>David Importados - Notificação Automática</strong></p>
            <p>Este email foi enviado automaticamente quando um novo pedido foi realizado.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados - Vendas" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: adminEmail,
      subject: `🛒 NOVO PEDIDO #${order.id.substring(0, 8).toUpperCase()} - R$ ${total.toFixed(2)}`,
      html
    });

    console.log(`✅ Notificação de novo pedido enviada para admin: ${adminEmail}`);
  } catch (error) {
    console.error('❌ Erro ao enviar notificação para admin:', error);
  }
}

// Email de atualização de status
async function sendStatusUpdate(order, user, newStatus) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const statusMessages = {
      processing: {
        title: '⏳ Pedido em Processamento',
        message: 'Seu pagamento foi confirmado e seu pedido está sendo preparado para envio.'
      },
      shipped: {
        title: '🚚 Pedido Enviado',
        message: 'Seu pedido foi enviado e está a caminho! Você receberá o código de rastreamento em breve.'
      },
      delivered: {
        title: '✅ Pedido Entregue',
        message: 'Seu pedido foi entregue com sucesso! Esperamos que você goste dos produtos.'
      },
      cancelled: {
        title: '❌ Pedido Cancelado',
        message: 'Seu pedido foi cancelado. Se você tiver dúvidas, entre em contato conosco.'
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      title: 'Atualização de Pedido',
      message: `Status do seu pedido foi atualizado para: ${newStatus}`
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <h2>Olá, ${user.fullName || 'Cliente'}!</h2>
            <p>${statusInfo.message}</p>
            
            <p><strong>Número do Pedido:</strong> #${order.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Novo Status:</strong> ${getStatusText(newStatus)}</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">
                Ver Detalhes do Pedido
              </a>
            </div>
          </div>
          <div class="footer">
            <p><strong>David Importados - Perfumaria de Luxo</strong></p>
            <p>contato@davidimportados.com | (11) 99999-9999</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: user.email,
      subject: `${statusInfo.title} - Pedido #${order.id.substring(0, 8).toUpperCase()}`,
      html
    });

    console.log(`✅ Email de atualização enviado para ${user.email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

function getStatusText(status) {
  const statusMap = {
    pending: 'Pendente',
    processing: 'Em Processamento',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };
  return statusMap[status] || status;
}

// Email de boas-vindas após registro
async function sendWelcomeEmail(user) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { margin: 20px 0; padding: 0; }
          .features li { margin: 10px 0; padding-left: 25px; position: relative; }
          .features li:before { content: "✓"; position: absolute; left: 0; color: #f59e0b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo à David Importados!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${user.fullName || 'Cliente'}!</h2>
            <p>Sua conta foi criada com sucesso! Agora você tem acesso a:</p>
            
            <ul class="features">
              <li>Perfumes importados de luxo com os melhores preços</li>
              <li>Frete calculado automaticamente para todo o Brasil</li>
              <li>Pagamento seguro via Mercado Pago</li>
              <li>Acompanhamento de pedidos em tempo real</li>
              <li>Ofertas exclusivas para membros</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/products" class="button">
                Explorar Produtos
              </a>
            </div>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Precisa de ajuda? Entre em contato conosco pelo email ou WhatsApp.
            </p>
          </div>
          <div class="footer">
            <p><strong>David Importados - Perfumaria de Luxo</strong></p>
            <p>contato@davidimportados.com | (11) 99999-9999</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: user.email,
      subject: `Bem-vindo à David Importados, ${user.fullName || 'Cliente'}! 🎉`,
      html
    });

    console.log(`✅ Email de boas-vindas enviado para ${user.email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error);
  }
}

// Email de verificação de email
async function sendEmailVerification(user, verificationToken) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .code { background: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 3px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verifique seu Email</h1>
          </div>
          <div class="content">
            <h2>Olá, ${user.fullName || 'Cliente'}!</h2>
            <p>Obrigado por se cadastrar na David Importados. Para completar seu registro, clique no botão abaixo para verificar seu email:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                Verificar Meu Email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
            </p>
            <p style="word-break: break-all; color: #f59e0b; font-size: 12px;">
              ${verificationUrl}
            </p>
            
            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              Este link expira em 24 horas. Se você não solicitou este email, ignore-o.
            </p>
          </div>
          <div class="footer">
            <p><strong>David Importados - Perfumaria de Luxo</strong></p>
            <p>contato@davidimportados.com | (11) 99999-9999</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: user.email,
      subject: `Verifique seu email - David Importados`,
      html
    });

    console.log(`✅ Email de verificação enviado para ${user.email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de verificação:', error);
  }
}

// Email de recuperação de senha
async function sendPasswordReset(user, resetToken) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
          </div>
          <div class="content">
            <h2>Olá, ${user.fullName || 'Cliente'}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                Redefinir Minha Senha
              </a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Atenção:</strong> Este link expira em 1 hora. Se você não solicitou a recuperação de senha, ignore este email - sua conta está segura.
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
            </p>
            <p style="word-break: break-all; color: #f59e0b; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>
          <div class="footer">
            <p><strong>David Importados - Perfumaria de Luxo</strong></p>
            <p>contato@davidimportados.com | (11) 99999-9999</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: user.email,
      subject: `Recuperação de senha - David Importados`,
      html
    });

    console.log(`✅ Email de recuperação enviado para ${user.email}`);
  } catch (error) {
    console.error('❌ Erro ao enviar email de recuperação:', error);
  }
}

// Email de contato (formulário de contato)
async function sendContactEmail(name, email, subject, message) {
  if (!transporter) {
    console.log('⚠️  Email não enviado - SMTP não configurado');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .message-box { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 Nova Mensagem de Contato</h1>
          </div>
          <div class="content">
            <div class="info">
              <p><strong>De:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Assunto:</strong> ${subject}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            
            <h3>Mensagem:</h3>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Responda diretamente para: <a href="mailto:${email}">${email}</a>
            </p>
          </div>
          <div class="footer">
            <p><strong>David Importados - Sistema de Contato</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"David Importados - Contato" <${process.env.EMAIL_FROM || 'noreply@davidimportados.com'}>`,
      to: process.env.ADMIN_EMAIL || 'contato@davidimportados.com',
      replyTo: email,
      subject: `[Contato] ${subject}`,
      html
    });

    console.log(`✅ Email de contato recebido de ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email de contato:', error);
    return false;
  }
}

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordReset,
  sendContactEmail,
  sendNewOrderNotification
};
