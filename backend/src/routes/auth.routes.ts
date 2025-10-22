import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validateRequest, schemas } from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.post('/register', validateRequest(schemas.register), authController.register);
router.post('/login', validateRequest(schemas.login), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rotas protegidas
router.post('/logout', authMiddleware, authController.logout);
// TODO: Implementar getProfile, updateProfile, changePassword
// router.get('/me', authMiddleware, authController.getProfile);
// router.put('/profile', authMiddleware, validateRequest(schemas.updateProfile), authController.updateProfile);
// router.post('/change-password', authMiddleware, authController.changePassword);

export default router;
