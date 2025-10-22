import { Router } from 'express';
import ordersController from '../controllers/orders.controller';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, schemas } from '../middlewares/validation.middleware';

const router = Router();

// Rotas protegidas (usuário logado)
router.get('/', authMiddleware, ordersController.getUserOrders);
router.get('/:id', authMiddleware, ordersController.getOrderById);
router.post('/', authMiddleware, validateRequest(schemas.order), ordersController.createOrder);
router.post('/:id/cancel', authMiddleware, ordersController.cancelOrder);

// Rotas de admin
router.get('/admin/all', authMiddleware, adminMiddleware, ordersController.getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, ordersController.updateOrderStatus);
router.post('/:id/tracking', authMiddleware, adminMiddleware, ordersController.updateTracking);

export default router;
