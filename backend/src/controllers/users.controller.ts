import { Request, Response } from 'express';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

class UsersController {
  // GET /api/users/addresses - Endereços do usuário
  async getAddresses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' }
      });

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      logger.error('Error fetching addresses:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar endereços'
      });
    }
  }

  // POST /api/users/addresses - Criar endereço
  async createAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const addressData = req.body;

      // Se é o primeiro endereço ou marcado como padrão, desmarcar outros
      if (addressData.isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }

      const address = await prisma.address.create({
        data: {
          ...addressData,
          userId
        }
      });

      res.status(201).json({
        success: true,
        data: address,
        message: 'Endereço criado com sucesso'
      });
    } catch (error) {
      logger.error('Error creating address:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar endereço'
      });
    }
  }

  // PUT /api/users/addresses/:id - Atualizar endereço
  async updateAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const addressData = req.body;

      // Se marcado como padrão, desmarcar outros
      if (addressData.isDefault) {
        await prisma.address.updateMany({
          where: { userId, id: { not: id } },
          data: { isDefault: false }
        });
      }

      const address = await prisma.address.update({
        where: { id, userId },
        data: addressData
      });

      res.json({
        success: true,
        data: address,
        message: 'Endereço atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Error updating address:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar endereço'
      });
    }
  }

  // DELETE /api/users/addresses/:id - Deletar endereço
  async deleteAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await prisma.address.delete({
        where: { id, userId }
      });

      res.json({
        success: true,
        message: 'Endereço removido com sucesso'
      });
    } catch (error) {
      logger.error('Error deleting address:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover endereço'
      });
    }
  }

  // PUT /api/users/addresses/:id/default - Marcar como padrão
  async setDefaultAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // Desmarcar todos outros endereços
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });

      // Marcar o escolhido como padrão
      const address = await prisma.address.update({
        where: { id, userId },
        data: { isDefault: true }
      });

      res.json({
        success: true,
        data: address,
        message: 'Endereço definido como padrão'
      });
    } catch (error) {
      logger.error('Error setting default address:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao definir endereço padrão'
      });
    }
  }

  // GET /api/users - Todos usuários (Admin)
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: Number(limit),
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            emailVerified: true,
            lastLoginAt: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários'
      });
    }
  }

  // GET /api/users/:id - Usuário específico (Admin)
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          addresses: true,
          _count: {
            select: { orders: true }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário'
      });
    }
  }

  // PUT /api/users/:id/role - Atualizar role (Admin)
  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true
        }
      });

      res.json({
        success: true,
        data: user,
        message: 'Papel do usuário atualizado'
      });
    } catch (error) {
      logger.error('Error updating user role:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar papel do usuário'
      });
    }
  }

  // PUT /api/users/:id/status - Toggle status (Admin)
  async toggleUserStatus(req: Request, res: Response) {
    try {
      // Esta funcionalidade precisa ser implementada no schema
      // Por enquanto retorna não implementado
      res.status(501).json({
        success: false,
        message: 'Funcionalidade ainda não implementada'
      });
    } catch (error) {
      logger.error('Error toggling user status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao alterar status do usuário'
      });
    }
  }
}

export default new UsersController();
