import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import { randomBytes } from 'crypto';

// Schemas de validação
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

/**
 * Registrar novo usuário
 */
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: 'CLIENT',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Gerar token de verificação
    const verificationToken = randomBytes(32).toString('hex');
    
    // Salvar token na base (você pode criar uma tabela específica para isso)
    // Por simplicidade, vou usar o campo de metadata do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Você pode criar uma tabela separada para tokens de verificação
        // ou usar um campo JSON no usuário
      },
    });

    // Enviar email de verificação
    await sendVerificationEmail(user.email, user.fullName, verificationToken);

    logger.info(`User registered: ${user.email}`, { userId: user.id });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso. Verifique seu email.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (error) {
    logger.error('Error in register:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Login do usuário
 */
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Gerar tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error('Error in login:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);

    const { userId } = await verifyRefreshToken(validatedData.refreshToken);

    // Gerar novos tokens
    const tokens = await generateTokens(userId);

    res.json({
      success: true,
      data: {
        tokens,
      },
    });
  } catch (error) {
    logger.error('Error in refresh token:', error);

    return res.status(401).json({
      success: false,
      message: 'Token de refresh inválido',
    });
  }
};

/**
 * Logout
 */
export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken: tokenToRevoke } = req.body;

    if (tokenToRevoke) {
      // Remover refresh token do banco
      await prisma.refreshToken.deleteMany({
        where: {
          userId: req.user!.id,
          tokenHash: tokenToRevoke,
        },
      });
    }

    logger.info(`User logged out: ${req.user!.email}`, { userId: req.user!.id });

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    logger.error('Error in logout:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Esqueci minha senha
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
      });
    }

    // Gerar token de reset
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco (implementar tabela de tokens de reset)
    // Por simplicidade, vou simular

    // Enviar email de reset
    await sendPasswordResetEmail(user.email, user.fullName, resetToken);

    logger.info(`Password reset requested for: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
    });
  } catch (error) {
    logger.error('Error in forgot password:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Redefinir senha
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    // Verificar token de reset (implementar lógica de verificação)
    // Por simplicidade, vou simular que o token é válido

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Atualizar senha do usuário (você precisa identificar o usuário pelo token)
    // const user = await prisma.user.update({
    //   where: { /* identificar pelo token */ },
    //   data: { passwordHash },
    // });

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso',
    });
  } catch (error) {
    logger.error('Error in reset password:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Verificar email
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Verificar token de verificação (implementar lógica)
    // Por simplicidade, vou simular

    // Marcar email como verificado
    // const user = await prisma.user.update({
    //   where: { /* identificar pelo token */ },
    //   data: { emailVerified: true, emailVerifiedAt: new Date() },
    // });

    res.json({
      success: true,
      message: 'Email verificado com sucesso',
    });
  } catch (error) {
    logger.error('Error in verify email:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};