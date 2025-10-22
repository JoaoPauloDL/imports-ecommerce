import { Request, Response } from 'express';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';

class AdminController {
  // GET /api/admin/dashboard - Dashboard básico
  async getDashboard(req: Request, res: Response) {
    try {
      const stats = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: 'delivered' }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalProducts: stats[0],
          totalOrders: stats[1],
          totalUsers: stats[2],
          totalRevenue: stats[3]._sum.total || 0
        }
      });
    } catch (error) {
      logger.error('Error fetching dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar dashboard'
      });
    }
  }

  // GET /api/admin/stats - Estatísticas gerais
  async getStats(req: Request, res: Response) {
    try {
      // Implementação básica
      res.json({
        success: true,
        data: {
          message: 'Estatísticas em desenvolvimento'
        }
      });
    } catch (error) {
      logger.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar estatísticas'
      });
    }
  }

  // GET /api/admin/products - Produtos para admin
  async getProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        include: {
          _count: { select: { orderItems: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching admin products:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar produtos'
      });
    }
  }

  // GET /api/admin/products/low-stock - Produtos com estoque baixo
  async getLowStockProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        where: {
          stockQuantity: { lte: 10 },
          isActive: true
        },
        include: {
          category: true
        },
        orderBy: { stockQuantity: 'asc' }
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching low stock products:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar produtos com estoque baixo'
      });
    }
  }

  // GET /api/admin/orders - Pedidos para admin
  async getOrders(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: {
            select: { fullName: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true, images: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      logger.error('Error fetching admin orders:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar pedidos'
      });
    }
  }

  // GET /api/admin/orders/recent - Pedidos recentes
  async getRecentOrders(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // última semana
          }
        },
        include: {
          user: {
            select: { fullName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      logger.error('Error fetching recent orders:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar pedidos recentes'
      });
    }
  }

  // GET /api/admin/users - Usuários para admin
  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { orders: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Error fetching admin users:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar usuários'
      });
    }
  }

  // GET /api/admin/users/recent - Usuários recentes
  async getRecentUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // último mês
          }
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Error fetching recent users:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar usuários recentes'
      });
    }
  }

  // Placeholder para relatórios
  async getSalesReport(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      message: 'Relatório de vendas em desenvolvimento'
    });
  }

  async getProductsReport(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      message: 'Relatório de produtos em desenvolvimento'
    });
  }

  async getUsersReport(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      message: 'Relatório de usuários em desenvolvimento'
    });
  }
}

export default new AdminController();
