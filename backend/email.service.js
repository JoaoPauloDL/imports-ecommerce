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

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate
};
