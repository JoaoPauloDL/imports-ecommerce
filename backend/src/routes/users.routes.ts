import { Router } from 'express';
import usersController from '../controllers/users.controller';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas protegidas (usuário logado)
router.get('/addresses', authMiddleware, usersController.getAddresses);
router.post('/addresses', authMiddleware, usersController.createAddress);
router.put('/addresses/:id', authMiddleware, usersController.updateAddress);
router.delete('/addresses/:id', authMiddleware, usersController.deleteAddress);
router.put('/addresses/:id/default', authMiddleware, usersController.setDefaultAddress);

// Rotas de admin
router.get('/', authMiddleware, adminMiddleware, usersController.getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, usersController.getUserById);
router.put('/:id/role', authMiddleware, adminMiddleware, usersController.updateUserRole);
router.put('/:id/status', authMiddleware, adminMiddleware, usersController.toggleUserStatus);

export default router;
