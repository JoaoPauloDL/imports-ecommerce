import { Request, Response } from 'express';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';

class ProductsController {
  // GET /api/products - Listar produtos com filtros
  async getProducts(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        search,
        minPrice,
        maxPrice,
        brand,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { isActive: true };

      // Filtros
      if (category) {
        where.category = { slug: category };
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      if (brand) {
        where.brand = { contains: brand, mode: 'insensitive' };
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            category: true,
            images: true,
            _count: {
              select: { reviews: true }
            }
          }
        }),
        prisma.product.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos'
      });
    }
  }

  // GET /api/products/featured - Produtos em destaque
  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true
        },
        take: 8,
        include: {
          category: true,
          images: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos em destaque'
      });
    }
  }

  // GET /api/products/search - Buscar produtos
  async searchProducts(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }

      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q as string, mode: 'insensitive' } },
            { description: { contains: q as string, mode: 'insensitive' } },
            { brand: { contains: q as string, mode: 'insensitive' } },
            { tags: { has: q as string } }
          ]
        },
        take: 20,
        include: {
          category: true,
          images: true
        }
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos'
      });
    }
  }

  // GET /api/products/categories - Listar categorias
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar categorias'
      });
    }
  }

  // GET /api/products/category/:slug - Produtos por categoria
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 12 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const category = await prisma.category.findUnique({
        where: { slug }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            categoryId: category.id,
            isActive: true
          },
          skip,
          take: Number(limit),
          include: {
            category: true,
            images: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count({
          where: {
            categoryId: category.id,
            isActive: true
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          category,
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos da categoria'
      });
    }
  }

  // GET /api/products/:slug - Produto específico
  async getProductBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: true,
          reviews: {
            include: {
              user: {
                select: {
                  fullName: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Produtos relacionados
      const relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true
        },
        take: 4,
        include: {
          images: true
        }
      });

      res.json({
        success: true,
        data: {
          product,
          relatedProducts
        }
      });
    } catch (error) {
      logger.error('Error fetching product by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto'
      });
    }
  }

  // POST /api/products - Criar produto (Admin)
  async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;

      const product = await prisma.product.create({
        data: {
          ...productData,
          slug: productData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        },
        include: {
          category: true,
          images: true
        }
      });

      logger.info(`Product created: ${product.id}`);

      res.status(201).json({
        success: true,
        data: product,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar produto'
      });
    }
  }

  // PUT /api/products/:id - Atualizar produto (Admin)
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: productData,
        include: {
          category: true,
          images: true
        }
      });

      logger.info(`Product updated: ${product.id}`);

      res.json({
        success: true,
        data: product,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar produto'
      });
    }
  }

  // DELETE /api/products/:id - Deletar produto (Admin)
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.product.update({
        where: { id },
        data: { isActive: false }
      });

      logger.info(`Product deleted: ${id}`);

      res.json({
        success: true,
        message: 'Produto removido com sucesso'
      });
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover produto'
      });
    }
  }

  // POST /api/products/:id/images - Upload de imagens (Admin)
  async uploadImages(req: Request, res: Response) {
    // TODO: Implementar upload de imagens
    res.status(501).json({
      success: false,
      message: 'Upload de imagens ainda não implementado'
    });
  }

  // DELETE /api/products/:id/images/:imageId - Deletar imagem (Admin)
  async deleteImage(req: Request, res: Response) {
    // TODO: Implementar remoção de imagens
    res.status(501).json({
      success: false,
      message: 'Remoção de imagens ainda não implementada'
    });
  }
}

export default new ProductsController();
