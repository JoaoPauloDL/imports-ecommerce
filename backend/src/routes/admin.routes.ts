import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de admin precisam de autenticação + permissão admin
router.use(authMiddleware, adminMiddleware);

// Dashboard e estatísticas
router.get('/dashboard', adminController.getDashboard);
router.get('/stats', adminController.getStats);

// Gestão de produtos
router.get('/products', adminController.getProducts);
router.get('/products/low-stock', adminController.getLowStockProducts);

// Gestão de pedidos
router.get('/orders', adminController.getOrders);
router.get('/orders/recent', adminController.getRecentOrders);

// Gestão de usuários
router.get('/users', adminController.getUsers);
router.get('/users/recent', adminController.getRecentUsers);

// Relatórios
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/products', adminController.getProductsReport);
router.get('/reports/users', adminController.getUsersReport);

export default router;
