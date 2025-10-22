interface Logger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const logger: Logger = {
  info: (message: string, meta?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
    } else {
      console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), message, meta }));
    }
  },
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
    } else {
      console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), message, error: error?.message || error }));
    }
  },
  warn: (message: string, meta?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
    } else {
      console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), message, meta }));
    }
  },
  debug: (message: string, meta?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  }
};

export { logger };
