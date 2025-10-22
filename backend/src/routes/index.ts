import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import ordersRoutes from './orders.routes';
import usersRoutes from './users.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

// Rota de teste
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API David Importados funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
