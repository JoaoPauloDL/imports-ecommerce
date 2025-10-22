import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    fullName?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.['auth-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'david-importados-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Permissão de administrador requerida.'
    });
  }
  next();
};

export default authMiddleware;
