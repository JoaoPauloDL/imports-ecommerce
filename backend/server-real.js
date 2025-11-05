const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected with Prisma'
  });
});

// ====================
// ROTAS DE CATEGORIAS
// ====================

// Listar categorias
app.get('/api/categories', async (req, res) => {
  try {
    console.log('📂 Buscando categorias no banco...');
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        order: true,
        _count: {
          select: { products: true }
        }
      }
    });
    
    console.log(`✅ ${categories.length} categorias encontradas`);
    res.json(categories);
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Criar categoria
app.post('/api/admin/categories', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    // Gerar slug único
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    console.log(`📂 Criando categoria: ${name}`);
    
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        order: 0
      }
    });

    console.log(`✅ Categoria criada: ${category.id}`);
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Erro ao criar categoria:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Nome ou slug da categoria já existe' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// ====================
// ROTAS DE PRODUTOS
// ====================

// Listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, limit, page } = req.query;
    
    const where = { isActive: true };
    if (category) where.categoryId = category;
    if (featured === 'true') where.featured = true;

    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 10) : 0;
    const take = limit ? parseInt(limit) : undefined;

    console.log('📦 Buscando produtos no banco...');
    
    const products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    const total = await prisma.product.count({ where });

    console.log(`✅ ${products.length} produtos encontrados (total: ${total})`);
    
    // Formatar produtos com categorias
    const formattedProducts = products.map(product => ({
      ...product,
      categories: product.categories.map(pc => pc.category)
    }));

    res.json({
      data: formattedProducts,
      products: formattedProducts,
      pagination: {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || products.length,
        total,
        pages: limit ? Math.ceil(total / parseInt(limit)) : 1
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Buscar produto por ID ou slug
app.get('/api/products/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    console.log(`📦 Buscando produto: ${identifier}`);
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        isActive: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    console.log(`✅ Produto encontrado: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Criar produto
app.post('/api/admin/products', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      sku, 
      stockQuantity, 
      categoryIds, // Array de IDs das categorias
      imageUrl, 
      images, // Array de URLs de imagens
      featured 
    } = req.body;

    if (!name || !price || !sku) {
      return res.status(400).json({ 
        error: 'Nome, preço e SKU são obrigatórios' 
      });
    }

    // Gerar slug único
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    console.log(`📦 Criando produto: ${name}`);
    console.log(`📂 Categorias selecionadas: ${JSON.stringify(categoryIds)}`);

    // Criar o produto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        sku,
        stockQuantity: parseInt(stockQuantity) || 0,
        imageUrl,
        images: images || [],
        featured: !!featured
      }
    });

    // Associar às categorias (se fornecidas)
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      await Promise.all(
        categoryIds.map(categoryId =>
          prisma.productCategory.create({
            data: {
              productId: product.id,
              categoryId: categoryId
            }
          })
        )
      );
    }

    // Buscar o produto completo com categorias
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    });

    console.log(`✅ Produto criado: ${product.id} com ${fullProduct.categories.length} categorias`);
    res.status(201).json({
      ...fullProduct,
      categories: fullProduct.categories.map(pc => pc.category)
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'SKU ou slug do produto já existe' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Atualizar produto
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      sku, 
      stockQuantity, 
      categoryId, 
      imageUrl, 
      featured,
      isActive 
    } = req.body;

    console.log(`📦 Atualizando produto: ${id}`);

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (sku !== undefined) updateData.sku = sku;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (featured !== undefined) updateData.featured = !!featured;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    console.log(`✅ Produto atualizado: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'SKU ou slug do produto já existe' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Deletar produto
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📦 Deletando produto: ${id}`);
    
    await prisma.product.delete({
      where: { id }
    });

    console.log(`✅ Produto deletado: ${id}`);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// ====================
// ROTAS DO DASHBOARD
// ====================

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    console.log('📊 Carregando dashboard do banco...');
    
    // Buscar estatísticas reais do banco
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      recentProducts,
      recentOrders
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.order.findMany({
        include: { 
          user: { select: { fullName: true, email: true } },
          items: { 
            include: { product: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const dashboardData = {
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers
      },
      recentProducts: recentProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stockQuantity,
        category: product.category?.name || 'Sem categoria',
        createdAt: product.createdAt
      })),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        user: order.user?.fullName || order.user?.email || 'Usuário',
        total: order.total,
        status: order.status,
        itemsCount: order.items.length,
        createdAt: order.createdAt
      }))
    };

    console.log(`✅ Dashboard carregado - Produtos: ${totalProducts}, Categorias: ${totalCategories}`);
    res.json(dashboardData);
  } catch (error) {
    console.error('❌ Erro ao carregar dashboard:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ====================
// ROTAS DE AUTH (básicas)
// ====================

// Login simplificado para admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Tentativa de login: ${email}`);
    
    // Para desenvolvimento, aceitar admin básico
    if (email === 'admin@admin.com' && password === 'admin123') {
      const token = 'admin-token-' + Date.now();
      console.log('✅ Login admin autorizado');
      return res.json({
        token,
        user: {
          id: 'admin',
          email: 'admin@admin.com',
          fullName: 'Administrador',
          role: 'admin'
        }
      });
    }

    // Tentar buscar usuário real no banco
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        passwordHash: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Aqui você implementaria a verificação de senha com bcrypt
    // Por enquanto, apenas login básico
    const token = 'user-token-' + Date.now();
    
    console.log(`✅ Login autorizado: ${user.email}`);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('💥 Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 8000;

// Conectar ao banco e iniciar servidor
async function startServer() {
  try {
    // Testar conexão com banco
    await prisma.$connect();
    console.log('🎯 Conexão com banco estabelecida via Prisma');
    
    app.listen(PORT, () => {
      console.log('🚀 ========================================');
      console.log(`🚀 Servidor REAL rodando na porta ${PORT}`);
      console.log('🚀 Usando Prisma + PostgreSQL REAL');
      console.log('🚀 ========================================');
      console.log('📋 Endpoints principais:');
      console.log('🔍 GET  /health');
      console.log('📂 GET  /api/categories');
      console.log('📦 GET  /api/products');
      console.log('📊 GET  /api/admin/dashboard');
      console.log('➕ POST /api/admin/products');
      console.log('🔐 POST /api/auth/login');
      console.log('🚀 ========================================');
      console.log(`💡 Teste em: http://localhost:${PORT}/health`);
      console.log(`📊 Dashboard: http://localhost:3000/admin`);
      console.log('🚀 ========================================');
    });
  } catch (error) {
    console.error('💥 Erro ao conectar com banco:', error);
    process.exit(1);
  }
}

// Tratamento de encerramento
process.on('SIGTERM', async () => {
  console.log('🔄 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();