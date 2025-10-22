import { logger } from '../utils/simple-logger';

// Mock email service para desenvolvimento
class EmailService {
  private isConfigured = false;

  constructor() {
    // Verificar se temos configuração de email
    if (process.env.SENDGRID_API_KEY || process.env.SMTP_HOST) {
      this.isConfigured = true;
      logger.info('Email service configured');
    } else {
      logger.warn('Email service not configured, using mock implementation');
    }
  }

  async sendEmail(to: string, subject: string, html: string, template?: string) {
    try {
      if (!this.isConfigured) {
        // Mock para desenvolvimento
        logger.info(`Mock email sent to ${to}`, {
          subject,
          template: template || 'custom',
          preview: html.substring(0, 100) + '...'
        });
        return { messageId: `mock-${Date.now()}` };
      }

      // TODO: Implementar envio real quando configurado
      logger.info('Real email would be sent here');
      return { messageId: `real-${Date.now()}` };

    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Erro ao enviar email');
    }
  }

  async sendOrderConfirmation(to: string, order: any) {
    const subject = `Pedido confirmado #${order.id}`;
    const html = `
      <h2>Seu pedido foi confirmado!</h2>
      <p>Número do pedido: <strong>${order.id}</strong></p>
      <p>Total: R$ ${order.totalAmount}</p>
      <p>Status: ${order.status}</p>
    `;
    
    return this.sendEmail(to, subject, html, 'order-confirmation');
  }

  async sendOrderStatusUpdate(to: string, order: any) {
    const subject = `Atualização do pedido #${order.id}`;
    const html = `
      <h2>Seu pedido foi atualizado</h2>
      <p>Número do pedido: <strong>${order.id}</strong></p>
      <p>Novo status: <strong>${order.status}</strong></p>
    `;
    
    return this.sendEmail(to, subject, html, 'order-status-update');
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Redefinir sua senha - David Importados';
    const html = `
      <h2>Redefinir senha</h2>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}">Redefinir senha</a>
      <p>Este link expira em 1 hora.</p>
    `;
    
    return this.sendEmail(to, subject, html, 'password-reset');
  }
}

export default new EmailService();