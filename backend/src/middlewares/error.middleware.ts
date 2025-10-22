import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/simple-logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro
  logger.error(`Error: ${error.message} - ${req.method} ${req.url}`, error);

  // Status code padrão
  let status = error.status || error.statusCode || 500;
  let message = error.message || 'Erro interno do servidor';

  // Tratar erros específicos
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Dados de entrada inválidos';
  }

  if (error.name === 'UnauthorizedError' || error.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Token de acesso inválido';
  }

  if (error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expirado';
  }

  if (error.name === 'CastError') {
    status = 400;
    message = 'ID inválido fornecido';
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    status = 400;
    message = 'Erro na operação do banco de dados';
  }

  // Não expor stack trace em produção
  const response: any = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = error.message;
    response.stack = error.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
