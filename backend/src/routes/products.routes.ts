import { Router } from 'express';
import productsController from '../controllers/products.controller';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, schemas } from '../middlewares/validation.middleware';

const router = Router();

// Rotas públicas
router.get('/', productsController.getProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/search', productsController.searchProducts);
router.get('/categories', productsController.getCategories);
router.get('/category/:slug', productsController.getProductsByCategory);
router.get('/:slug', productsController.getProductBySlug);

// Rotas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, validateRequest(schemas.product), productsController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validateRequest(schemas.product), productsController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productsController.deleteProduct);
router.post('/:id/images', authMiddleware, adminMiddleware, productsController.uploadImages);
router.delete('/:id/images/:imageId', authMiddleware, adminMiddleware, productsController.deleteImage);

export default router;
