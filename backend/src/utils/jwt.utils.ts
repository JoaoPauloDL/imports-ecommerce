import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { randomBytes, createHash } from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Gerar tokens de acesso e refresh
 */
export const generateTokens = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Token de acesso (15 minutos)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  // Token de refresh (7 dias)
  const refreshTokenRaw = randomBytes(32).toString('hex');
  const refreshTokenHash = createHash('sha256').update(refreshTokenRaw).digest('hex');

  // Salvar refresh token no banco
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: refreshTokenRaw,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  };
};

/**
 * Verificar refresh token
 */
export const verifyRefreshToken = async (token: string) => {
  const tokenHash = createHash('sha256').update(token).digest('hex');

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  if (!refreshToken) {
    throw new Error('Token de refresh inválido');
  }

  if (refreshToken.expiresAt < new Date()) {
    // Token expirado, remover do banco
    await prisma.refreshToken.delete({
      where: { id: refreshToken.id },
    });
    throw new Error('Token de refresh expirado');
  }

  return {
    userId: refreshToken.userId,
    user: refreshToken.user,
  };
};

/**
 * Revogar todos os refresh tokens de um usuário
 */
export const revokeAllTokens = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

/**
 * Limpar tokens expirados (deve ser executado periodicamente)
 */
export const cleanExpiredTokens = async () => {
  const deletedCount = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return deletedCount.count;
};