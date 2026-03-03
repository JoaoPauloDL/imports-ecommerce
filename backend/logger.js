/**
 * Logger estruturado para produção e desenvolvimento
 * Usa console em dev, pode ser facilmente expandido para Winston em produção
 */

const isDev = process.env.NODE_ENV !== 'production';

class Logger {
  info(message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = isDev ? '✅' : '[INFO]';
    console.log(`[${timestamp}] ${prefix} ${message}`, data || '');
  }

  warn(message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = isDev ? '⚠️' : '[WARN]';
    console.warn(`[${timestamp}] ${prefix} ${message}`, data || '');
  }

  error(message, error = null) {
    const timestamp = new Date().toISOString();
    const prefix = isDev ? '❌' : '[ERROR]';
    if (error) {
      console.error(`[${timestamp}] ${prefix} ${message}:`, error.message || error);
    } else {
      console.error(`[${timestamp}] ${prefix} ${message}`);
    }
  }

  debug(message, data = null) {
    if (isDev) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] 🔍 ${message}`, data || '');
    }
  }

  // Métodos específicos para diferentes módulos
  auth(message, data = null) {
    this.info(`🔐 ${message}`, data);
  }

  payment(message, data = null) {
    this.info(`💳 ${message}`, data);
  }

  shipping(message, data = null) {
    this.info(`🚚 ${message}`, data);
  }

  order(message, data = null) {
    this.info(`📦 ${message}`, data);
  }

  email(message, data = null) {
    this.info(`📧 ${message}`, data);
  }

  database(message, data = null) {
    this.info(`🗄️ ${message}`, data);
  }
}

module.exports = new Logger();
