import pino from 'pino';

// Configuração do logger baseada no ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  
  // Pretty print apenas em desenvolvimento
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Em produção, usar formato JSON estruturado
  ...(!isDevelopment && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),

  // Campos base sempre incluídos
  base: {
    pid: false,
    hostname: false,
    env: process.env.NODE_ENV,
    service: 'imports-store-api',
  },

  // Redact de campos sensíveis
  redact: [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'cookie',
    'set-cookie',
  ],
});

// Funções utilitárias para logs específicos
export const logRequest = (req: any, res: any) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  }, 'HTTP Request');
};

export const logResponse = (req: any, res: any, duration: number) => {
  logger.info({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration,
    userId: req.user?.id,
  }, 'HTTP Response');
};

export const logError = (error: Error, context?: any) => {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  }, 'Application Error');
};

export const logTransaction = (action: string, data: any, userId?: string) => {
  logger.info({
    action,
    data,
    userId,
    timestamp: new Date().toISOString(),
  }, 'Business Transaction');
};

export const logSecurity = (event: string, details: any, req?: any) => {
  logger.warn({
    securityEvent: event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?.id,
    timestamp: new Date().toISOString(),
  }, 'Security Event');
};
