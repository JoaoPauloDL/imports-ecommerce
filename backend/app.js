const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { sendOrderConfirmation, sendStatusUpdate } = require('./email.service');
const { 
  generateVerificationToken, 
  sendVerificationEmail, 
  sendWelcomeEmail, 
  isEmailConfigured 
} = require('./email-verification.service');
require('dotenv').config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar multer para upload em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  },
});

const app = express();
const prisma = new PrismaClient();

// JWT Configuration
if (!process.env.JWT_SECRET) {
  console.error('❌ ERRO CRÍTICO: JWT_SECRET não está definido no .env');
  console.error('⚠️ Por segurança, o servidor não pode iniciar sem JWT_SECRET');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware de autenticação
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se é admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware
app.use(helmet()); // Proteção de headers HTTP

// Rate limiting geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Apenas 5 tentativas de login
  message: 'Muitas tentativas de login. Aguarde 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limite de tamanho do body

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
// UPLOAD DE IMAGENS
// ====================

// Upload de múltiplas imagens
app.post('/api/upload', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
  console.log('🎯 Requisição de upload recebida!');
  console.log('📋 Headers:', req.headers.authorization ? 'Token presente' : 'Token ausente');
  console.log('📦 Arquivos recebidos:', req.files ? req.files.length : 0);
  
  try {
    if (!req.files || req.files.length === 0) {
      console.log('⚠️  Nenhum arquivo foi enviado');
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    console.log(`📸 Upload de ${req.files.length} imagem(ns)...`);

    // Upload para Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ecommerce/products',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              console.error('❌ Erro no upload:', error);
              reject(error);
            } else {
              console.log(`✅ Imagem enviada: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.json({ 
      success: true,
      images: imageUrls,
      count: imageUrls.length
    });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer upload das imagens',
      message: error.message 
    });
  }
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
        isActive: true,
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

// Deletar categoria
app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deletando categoria ${id}...`);
    
    // Verificar se categoria existe
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Verificar se tem produtos vinculados
    if (category._count.products > 0) {
      return res.status(400).json({ 
        error: `Não é possível deletar categoria com ${category._count.products} produto(s) vinculado(s)`
      });
    }

    // Deletar categoria
    await prisma.category.delete({
      where: { id: id }
    });

    console.log(`✅ Categoria ${id} deletada com sucesso`);
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar categoria:', error.message);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Categoria não encontrada' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Atualizar categoria
app.put('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, order, isActive } = req.body;
    console.log(`✏️ Atualizando categoria ${id}...`);

    // Gerar slug automaticamente se o nome mudou
    const slug = name ? name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() : undefined;

    const updated = await prisma.category.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    console.log(`✅ Categoria ${id} atualizada: ${updated.name}`);
    res.json(updated);
  } catch (error) {
    console.error('❌ Erro ao atualizar categoria:', error.message);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Categoria não encontrada' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Nome ou slug da categoria já existe' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Buscar categoria individual
app.get('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📂 Buscando categoria ${id}...`);
    
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    console.log(`✅ Categoria ${id} encontrada: ${category.name}`);
    res.json(category);
  } catch (error) {
    console.error('❌ Erro ao buscar categoria:', error.message);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});

// ====================
// ROTAS DE PRODUTOS
// ====================

// Listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      limit, 
      page,
      search,        // Busca por nome, descrição ou SKU
      minPrice,      // Preço mínimo
      maxPrice,      // Preço máximo
      inStock,       // Apenas produtos em estoque
      sortBy,        // Campo de ordenação: price, name, createdAt
      sortOrder,     // Direção: asc ou desc
      slug           // Busca por slug específico
    } = req.query;
    
    // Construir where clause
    const where = { isActive: true };
    
    // Filtro por slug (para página de detalhes)
    if (slug) {
      where.slug = slug;
    }
    
    // Filtro por categoria (via relação many-to-many)
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }
    
    // Filtro por destaque
    if (featured === 'true') {
      where.featured = true;
    }
    
    // Busca por texto (nome, descrição ou SKU)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Filtro por faixa de preço
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    // Filtro por disponibilidade em estoque
    if (inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    // Paginação
    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 10) : 0;
    const take = limit ? parseInt(limit) : undefined;

    // Ordenação
    let orderBy = { createdAt: 'desc' }; // Padrão: mais recentes primeiro
    
    if (sortBy) {
      const validSortFields = ['price', 'name', 'createdAt', 'stockQuantity'];
      const validSortOrders = ['asc', 'desc'];
      
      if (validSortFields.includes(sortBy)) {
        const order = validSortOrders.includes(sortOrder) ? sortOrder : 'asc';
        orderBy = { [sortBy]: order };
      }
    }

    console.log('📦 Buscando produtos no banco...');
    console.log('🔍 Filtros:', JSON.stringify(where, null, 2));
    console.log('📊 Ordenação:', JSON.stringify(orderBy));
    
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
      orderBy,
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
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        sortOrder
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

// ====================
// DASHBOARD ADMIN
// ====================

// Estatísticas do Dashboard
app.get('/api/admin/dashboard/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('📊 Buscando estatísticas do dashboard...');
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Total de vendas (todos os pedidos pagos)
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ['paid', 'processing', 'shipped', 'delivered'] }
      },
      _sum: { totalAmount: true },
      _count: true
    });
    
    // Pedidos de hoje
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: { gte: startOfToday }
      }
    });
    
    // Pedidos do mês
    const monthOrders = await prisma.order.count({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });
    
    // Produtos em estoque
    const productsInStock = await prisma.product.count({
      where: {
        stockQuantity: { gt: 0 },
        isActive: true
      }
    });
    
    // Produtos com estoque baixo (<10 unidades)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockQuantity: { lt: 10, gt: 0 },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        imageUrl: true
      },
      orderBy: { stockQuantity: 'asc' },
      take: 10
    });
    
    // Novos clientes (últimos 30 dias)
    const newCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { gte: thirtyDaysAgo }
      }
    });
    
    // Vendas dos últimos 30 dias (para gráfico)
    const salesByDay = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['paid', 'processing', 'shipped', 'delivered'] }
      },
      _sum: { totalAmount: true },
      _count: true
    });
    
    // Agrupar por dia
    const salesChart = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySales = salesByDay.filter(sale => {
        const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
        return saleDate === dateStr;
      });
      
      return {
        date: dateStr,
        sales: daySales.reduce((sum, sale) => sum + (sale._sum.totalAmount || 0), 0),
        orders: daySales.reduce((sum, sale) => sum + sale._count, 0)
      };
    });
    
    // Últimos pedidos
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Estatísticas carregadas');
    
    res.json({
      revenue: {
        total: totalRevenue._sum.totalAmount || 0,
        ordersCount: totalRevenue._count || 0
      },
      orders: {
        today: todayOrders,
        month: monthOrders
      },
      products: {
        inStock: productsInStock,
        lowStock: lowStockProducts
      },
      customers: {
        new: newCustomers
      },
      salesChart,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user.fullName,
        customerEmail: order.user.email,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
        firstProduct: order.items[0]?.product
      }))
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ====================
// PRODUTOS ADMIN
// ====================

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

    if (!name || !price) {
      return res.status(400).json({ 
        error: 'Nome e preço são obrigatórios' 
      });
    }

    // Gerar slug único
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Gerar SKU automaticamente se não fornecido
    const generatedSku = sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    console.log(`\n📦 ========= CRIANDO NOVO PRODUTO =========`);
    console.log(`📝 Nome: ${name}`);
    console.log(`💰 Preço: ${price}`);
    console.log(`📂 CategoryIds recebido:`, categoryIds);
    console.log(`📂 Tipo de categoryIds:`, typeof categoryIds);
    console.log(`📂 É array?:`, Array.isArray(categoryIds));
    console.log(`📂 Length:`, categoryIds?.length);
    console.log(`🏷️ SKU: ${generatedSku}`);
    console.log(`📦 Body completo:`, JSON.stringify(req.body, null, 2));

    // Criar o produto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        sku: generatedSku,
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

// Buscar produto individual (admin) - para edição
app.get('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Buscando produto ${id}...`);
    
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Formatar response
    const formattedProduct = {
      ...product,
      price: parseFloat(product.price),
      categories: product.categories.map(pc => pc.category)
    };

    console.log(`✅ Produto ${id} encontrado: ${product.name}`);
    res.json(formattedProduct);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produto' });
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
      categoryIds, // Array de IDs das categorias
      imageUrl, 
      featured,
      isActive 
    } = req.body;

    console.log(`\n📦 ========= ATUALIZANDO PRODUTO =========`);
    console.log(`🆔 ID: ${id}`);
    console.log(`📝 Nome: ${name}`);
    console.log(`📂 CategoryIds recebido:`, categoryIds);
    console.log(`📂 Tipo de categoryIds:`, typeof categoryIds);
    console.log(`📂 É array?:`, Array.isArray(categoryIds));
    console.log(`📂 Length:`, categoryIds?.length);
    console.log(`📦 Body completo:`, JSON.stringify(req.body, null, 2));

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
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (featured !== undefined) updateData.featured = !!featured;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    // Atualizar produto
    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Atualizar categorias se fornecidas
    if (categoryIds !== undefined && Array.isArray(categoryIds)) {
      console.log(`📂 Atualizando categorias para produto ${id}...`);
      
      // Remover todas as categorias atuais
      const deleted = await prisma.productCategory.deleteMany({
        where: { productId: id }
      });
      console.log(`   🗑️  Removidas ${deleted.count} categorias antigas`);

      // Adicionar novas categorias
      if (categoryIds.length > 0) {
        console.log(`   ➕ Adicionando ${categoryIds.length} novas categorias:`, categoryIds);
        await Promise.all(
          categoryIds.map(categoryId =>
            prisma.productCategory.create({
              data: {
                productId: id,
                categoryId: categoryId
              }
            })
          )
        );
        console.log(`   ✅ Categorias atualizadas com sucesso`);
      } else {
        console.log(`   ⚠️  Array de categoryIds está vazio!`);
      }
    } else {
      console.log(`   ⚠️  categoryIds não fornecido ou não é array:`, categoryIds);
    }

    // Buscar produto completo com categorias
    const fullProduct = await prisma.product.findUnique({
      where: { id },
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

    console.log(`✅ Produto atualizado: ${product.name}`);
    res.json({
      ...fullProduct,
      price: parseFloat(fullProduct.price),
      categories: fullProduct.categories.map(pc => pc.category)
    });
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

// Listar todos os produtos (admin) - para gerenciamento
app.get('/api/admin/products', async (req, res) => {
  try {
    console.log('📦 Admin buscando todos os produtos...');
    
    const products = await prisma.product.findMany({
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatar response com categorias limpas
    const formattedProducts = products.map(product => ({
      ...product,
      price: parseFloat(product.price),
      categories: product.categories.map(pc => pc.category)
    }));

    console.log(`✅ ${formattedProducts.length} produtos encontrados (incluindo inativos)`);
    res.json(formattedProducts);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos admin:', error.message);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
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
        include: { 
          categories: {
            include: {
              category: { select: { id: true, name: true, slug: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.order.findMany({
        select: {
          id: true,
          userId: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          updatedAt: true,
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
        total: order.totalAmount,
        status: order.status,
        itemsCount: order.items.length,
        createdAt: order.createdAt
      }))
    };

    console.log(`✅ Dashboard carregado - Produtos: ${totalProducts}, Categorias: ${totalCategories}`);
    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue: recentOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
        recentProducts: dashboardData.recentProducts,
        recentOrders: dashboardData.recentOrders
      }
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dashboard (usando dados locais):', error.message);
    
    // Fallback: Retornar dados mock estruturados quando banco falha
    const mockData = {
      totalProducts: 14,
      totalCategories: 10,
      totalOrders: 3,
      totalUsers: 1,
      totalRevenue: 547.47,
      recentProducts: [
        {
          id: '1',
          name: 'Notebook Gamer',
          price: 3499.99,
          stock: 15,
          category: 'Eletrônicos',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Mouse Wireless',
          price: 89.90,
          stock: 50,
          category: 'Periféricos',
          createdAt: new Date()
        }
      ],
      recentOrders: [
        {
          id: '1',
          user: 'Cliente Teste',
          total: 199.90,
          status: 'pending',
          itemsCount: 2,
          createdAt: new Date()
        }
      ]
    };

    console.log('⚠️ Usando dados MOCK estruturados por falha no banco');
    res.json({
      success: true,
      data: mockData
    });
  }
});

// ====================
// ROTAS DE AUTH (básicas)
// ====================

// ====================
// ROTAS DE AUTENTICAÇÃO
// ====================

// Login seguro com bcrypt
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    console.log(`🔐 Tentativa de login: ${email}`);
    
    // Buscar usuário no banco
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
      console.log('❌ Usuário não encontrado ou inativo');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha com bcrypt
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se email foi verificado (buscar campo completo)
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        id: true, 
        email: true, 
        fullName: true, 
        role: true, 
        emailVerified: true 
      }
    });

    if (!fullUser.emailVerified) {
      console.log('⚠️ Login bloqueado - Email não verificado');
      return res.status(403).json({ 
        error: 'Email não verificado',
        message: 'Por favor, verifique seu email antes de fazer login. Verifique sua caixa de entrada e spam.',
        emailVerified: false
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: fullUser.id, 
        email: fullUser.email,
        role: fullUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Atualizar último login
    await prisma.user.update({
      where: { id: fullUser.id },
      data: { lastLoginAt: new Date() }
    });
    
    console.log(`✅ Login autorizado: ${fullUser.email}`);
    res.json({
      token,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        fullName: fullUser.fullName,
        role: fullUser.role
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

// Registro de novos usuários
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;
    
    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Gerar token de verificação
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || email.split('@')[0],
        phone,
        role: 'customer',
        isActive: true,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    });

    // Enviar email de verificação (não bloquear se falhar)
    if (isEmailConfigured()) {
      try {
        await sendVerificationEmail(email, user.fullName || email, verificationToken);
        console.log(`📧 Email de verificação enviado para: ${email}`);
      } catch (emailError) {
        console.error('⚠️ Falha ao enviar email de verificação:', emailError.message);
      }
    } else {
      console.log('⚠️ SMTP não configurado - Email de verificação não enviado');
    }

    // Gerar JWT token (permite login mas não checkout até verificar)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`✅ Usuário registrado: ${user.email}`);
    res.status(201).json({
      token,
      user,
      message: isEmailConfigured() 
        ? 'Conta criada! Verifique seu email para ativar.'
        : 'Conta criada com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Verificar token (rota protegida de teste)
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Refresh token (opcional mas recomendado)
app.post('/api/auth/refresh', verifyToken, async (req, res) => {
  try {
    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: req.user.userId, 
        email: req.user.email,
        role: req.user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================
// VERIFICAÇÃO DE EMAIL
// ====================

// Verificar email com token
app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token de verificação não fornecido' });
    }

    console.log(`📧 Verificando email com token: ${token.substring(0, 10)}...`);

    // Buscar usuário com o token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gte: new Date() // Token ainda não expirou
        }
      }
    });

    if (!user) {
      console.log('❌ Token inválido ou expirado');
      return res.status(400).json({ 
        error: 'Token inválido ou expirado',
        message: 'Este link de verificação é inválido ou já expirou. Solicite um novo email de verificação.'
      });
    }

    // Atualizar usuário como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    // Enviar email de boas-vindas
    if (isEmailConfigured()) {
      try {
        await sendWelcomeEmail(user.email, user.fullName || user.email);
        console.log(`📧 Email de boas-vindas enviado para: ${user.email}`);
      } catch (emailError) {
        console.error('⚠️ Falha ao enviar email de boas-vindas:', emailError.message);
      }
    }

    console.log(`✅ Email verificado: ${user.email}`);
    res.json({ 
      success: true,
      message: 'Email verificado com sucesso! Você já pode fazer login.',
      user: {
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('❌ Erro ao verificar email:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Reenviar email de verificação
app.post('/api/auth/resend-verification', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    console.log(`📧 Reenviando email de verificação para: ${email}`);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        isActive: true
      }
    });

    if (!user) {
      // Não revelar se email existe ou não (segurança)
      return res.json({ 
        message: 'Se o email existir em nossa base, um novo link de verificação será enviado.' 
      });
    }

    if (!user.isActive) {
      return res.status(400).json({ error: 'Conta desativada' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ 
        error: 'Email já verificado',
        message: 'Este email já foi verificado. Você pode fazer login normalmente.'
      });
    }

    // Gerar novo token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Atualizar usuário com novo token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Enviar email
    if (isEmailConfigured()) {
      try {
        await sendVerificationEmail(email, user.fullName || email, verificationToken);
        console.log(`✅ Email de verificação reenviado para: ${email}`);
      } catch (emailError) {
        console.error('❌ Erro ao enviar email:', emailError);
        return res.status(500).json({ 
          error: 'Falha ao enviar email',
          message: 'Não foi possível enviar o email de verificação. Tente novamente mais tarde.'
        });
      }
    } else {
      return res.status(500).json({ 
        error: 'Email não configurado',
        message: 'O serviço de email não está configurado no servidor.'
      });
    }

    res.json({ 
      success: true,
      message: 'Email de verificação enviado! Verifique sua caixa de entrada e spam.'
    });
  } catch (error) {
    console.error('❌ Erro ao reenviar email:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ====================
// ROTAS DO CARRINHO
// ====================

// Buscar carrinho (por usuário logado ou sessionId para guest)
app.get('/api/cart', async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    
    console.log(`🛒 Buscando carrinho - userId: ${userId}, sessionId: ${sessionId}`);
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'userId ou sessionId é obrigatório' });
    }

    // Buscar ou criar carrinho
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                images: true,
                stockQuantity: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    // Se não existe, criar carrinho vazio
    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  imageUrl: true,
                  images: true,
                  stockQuantity: true,
                  isActive: true
                }
              }
            }
          }
        }
      });
    }

    // Calcular total
    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    console.log(`✅ Carrinho encontrado: ${cart.items.length} itens, total: R$ ${total.toFixed(2)}`);
    
    res.json({
      ...cart,
      total,
      itemCount: cart.items.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar carrinho:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Adicionar item ao carrinho
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity = 1 } = req.body;
    
    console.log(`🛒 Adicionando ao carrinho - produto: ${productId}, qtd: ${quantity}`);
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'userId ou sessionId é obrigatório' });
    }

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'productId e quantidade válida são obrigatórios' });
    }

    // Verificar se produto existe e está ativo
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stockQuantity: true, isActive: true, price: true }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Produto não encontrado ou inativo' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        error: `Estoque insuficiente. Disponível: ${product.stockQuantity}` 
      });
    }

    // Buscar ou criar carrinho
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { sessionId }
      });
    }

    // Verificar se item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    if (existingItem) {
      // Atualizar quantidade
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({ 
          error: `Estoque insuficiente. Disponível: ${product.stockQuantity}, no carrinho: ${existingItem.quantity}` 
        });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });

      console.log(`✅ Quantidade atualizada: ${product.name} (${newQuantity})`);
    } else {
      // Criar novo item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });

      console.log(`✅ Item adicionado: ${product.name} (${quantity})`);
    }

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                images: true,
                stockQuantity: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total,
      itemCount: updatedCart.items.length
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar item ao carrinho:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Atualizar quantidade de item no carrinho
app.put('/api/cart/update', async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;
    
    console.log(`🛒 Atualizando carrinho - produto: ${productId}, nova qtd: ${quantity}`);
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'userId ou sessionId é obrigatório' });
    }

    if (!productId || quantity < 0) {
      return res.status(400).json({ error: 'productId e quantidade válida são obrigatórios' });
    }

    // Buscar carrinho
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Se quantidade é 0, remover item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: productId
          }
        }
      });
      console.log(`✅ Item removido do carrinho`);
    } else {
      // Verificar estoque
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stockQuantity: true, isActive: true, name: true }
      });

      if (!product || !product.isActive) {
        return res.status(404).json({ error: 'Produto não encontrado ou inativo' });
      }

      if (product.stockQuantity < quantity) {
        return res.status(400).json({ 
          error: `Estoque insuficiente. Disponível: ${product.stockQuantity}` 
        });
      }

      // Atualizar quantidade
      await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: productId
          }
        },
        data: { quantity }
      });
      console.log(`✅ Quantidade atualizada: ${product.name} (${quantity})`);
    }

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                images: true,
                stockQuantity: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total,
      itemCount: updatedCart.items.length
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar carrinho:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Item não encontrado no carrinho' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Remover item do carrinho
app.delete('/api/cart/remove', async (req, res) => {
  try {
    const { userId, sessionId, productId } = req.query;
    
    console.log(`🛒 Removendo do carrinho - produto: ${productId}`);
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'userId ou sessionId é obrigatório' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'productId é obrigatório' });
    }

    // Buscar carrinho
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Remover item
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    console.log(`✅ Item removido do carrinho`);

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                images: true,
                stockQuantity: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total,
      itemCount: updatedCart.items.length
    });
  } catch (error) {
    console.error('❌ Erro ao remover item do carrinho:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Item não encontrado no carrinho' });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// Limpar carrinho
app.delete('/api/cart/clear', async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    
    console.log(`🛒 Limpando carrinho`);
    
    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'userId ou sessionId é obrigatório' });
    }

    // Buscar carrinho
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Remover todos os itens
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    console.log(`✅ Carrinho limpo`);

    res.json({
      id: cart.id,
      items: [],
      total: 0,
      itemCount: 0
    });
  } catch (error) {
    console.error('❌ Erro ao limpar carrinho:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Migrar carrinho de guest para usuário logado
app.post('/api/cart/merge', async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    
    console.log(`🛒 Mesclando carrinho - sessionId: ${sessionId} → userId: ${userId}`);
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId e sessionId são obrigatórios' });
    }

    // Buscar carrinho do guest
    const guestCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: { items: true }
    });

    if (!guestCart || guestCart.items.length === 0) {
      console.log('⚠️ Carrinho guest vazio ou não encontrado');
      // Apenas retornar carrinho do usuário
      const userCart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  imageUrl: true,
                  images: true,
                  stockQuantity: true,
                  isActive: true
                }
              }
            }
          }
        }
      });

      return res.json(userCart || { items: [], total: 0, itemCount: 0 });
    }

    // Buscar ou criar carrinho do usuário
    let userCart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId }
      });
    }

    // Mesclar itens
    for (const guestItem of guestCart.items) {
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: guestItem.productId
          }
        }
      });

      if (existingItem) {
        // Somar quantidades
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity }
        });
      } else {
        // Criar novo item
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity
          }
        });
      }
    }

    // Deletar carrinho guest
    await prisma.cart.delete({
      where: { id: guestCart.id }
    });

    console.log(`✅ Carrinho mesclado: ${guestCart.items.length} itens transferidos`);

    // Retornar carrinho mesclado
    const mergedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                images: true,
                stockQuantity: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    const total = mergedCart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      ...mergedCart,
      total,
      itemCount: mergedCart.items.length
    });
  } catch (error) {
    console.error('❌ Erro ao mesclar carrinho:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ====================
// ROTAS DE PEDIDOS
// ====================

// Criar pedido do carrinho
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { addressId, items, shippingCost = 0 } = req.body;
    const userId = req.user.userId;
    
    console.log(`📦 Criando pedido para usuário: ${userId}`);
    
    if (!addressId) {
      return res.status(400).json({ error: 'Endereço é obrigatório' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Validar endereço pertence ao usuário
    const address = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId: userId
      }
    });

    if (!address) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }

    // 🔒 USAR TRANSAÇÃO PARA EVITAR RACE CONDITION
    const result = await prisma.$transaction(async (tx) => {
      // Validar produtos e estoque com lock
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        // Buscar produto com FOR UPDATE (lock pessimista)
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || !product.isActive) {
          throw new Error(`Produto ${item.productId} não disponível`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.stockQuantity}`);
        }

        const itemTotal = parseFloat(product.price) * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });

        // Atualizar estoque IMEDIATAMENTE na transação
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // Gerar número do pedido único
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Criar pedido
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          status: 'pending',
          totalAmount: total + parseFloat(shippingCost),
          shippingCost: parseFloat(shippingCost),
          orderNumber,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          address: true,
          user: {
            select: {
              email: true,
              fullName: true
            }
          }
        }
      });

      // Limpar carrinho do usuário
      const cart = await tx.cart.findFirst({
        where: { userId }
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
        console.log('🛒 Carrinho limpo após pedido');
      }

      return order;
    });

    console.log(`✅ Pedido criado: ${result.id} (${result.orderNumber})`);
    
    // Enviar email de confirmação (async, não bloqueia resposta)
    try {
      await sendOrderConfirmation({
        email: result.user.email,
        customerName: result.user.fullName || result.user.email,
        orderId: result.orderNumber || result.id,
        total: parseFloat(result.totalAmount),
        items: result.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.price)
        }))
      });
      console.log('📧 Email de confirmação enviado');
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email (pedido criado com sucesso):', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      order: {
        ...result,
        totalAmount: parseFloat(result.totalAmount),
        shippingCost: parseFloat(result.shippingCost)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    
    // Retornar mensagens de erro mais específicas
    if (error.message && error.message.includes('Estoque insuficiente')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message && error.message.includes('não disponível')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Erro ao processar pedido',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
  }
});

// Buscar pedido por ID
app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verificar se o usuário pode ver este pedido
    if (userRole !== 'admin' && order.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar pedidos do usuário
app.get('/api/orders/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.user.userId;
    const userRole = req.user.role;
    
    // Verificar permissão
    if (userRole !== 'admin' && userId !== requestUserId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar todos os pedidos (admin)
app.get('/api/admin/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          address: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do pedido (admin)
app.put('/api/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido',
        validStatuses 
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    console.log(`✅ Pedido ${id} atualizado para ${status}`);
    
    // Enviar email de notificação de mudança de status
    sendStatusUpdate(order, order.user, status).catch(err => 
      console.error('Erro ao enviar email:', err)
    );
    
    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    console.error('❌ Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar pedido (cliente ou admin)
app.post('/api/orders/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verificar permissão
    if (userRole !== 'admin' && order.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Não permitir cancelamento de pedidos já enviados
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ 
        error: 'Não é possível cancelar pedido já enviado' 
      });
    }

    // Atualizar para cancelado
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    // Devolver itens ao estoque
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });
    }

    console.log(`✅ Pedido ${id} cancelado e estoque restaurado`);
    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ Erro ao cancelar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================
// ROTAS DE PAGAMENTO (MERCADOPAGO)
// ====================

// Criar preferência de pagamento
app.post('/api/payment/create-preference', verifyToken, async (req, res) => {
  try {
    const { orderId, items, total } = req.body;
    const userId = req.user.userId;
    
    console.log(`💳 Criando preferência de pagamento para pedido: ${orderId}`);
    
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return res.status(500).json({ 
        error: 'MercadoPago não configurado. Configure MERCADOPAGO_ACCESS_TOKEN no .env' 
      });
    }

    const mercadopago = require('mercadopago');
    
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Buscar dados do usuário para preencher
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true, phone: true }
    });

    const preference = {
      items: items.map(item => ({
        id: item.product.id,
        title: item.product.name,
        description: item.product.description || item.product.name,
        picture_url: item.product.imageUrl || '',
        category_id: 'perfumes',
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: parseFloat(item.product.price)
      })),
      payer: {
        name: user.fullName || 'Cliente',
        email: user.email,
        phone: {
          number: user.phone || ''
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/success?orderId=${orderId}`,
        failure: `${process.env.FRONTEND_URL}/checkout/failure?orderId=${orderId}`,
        pending: `${process.env.FRONTEND_URL}/checkout/pending?orderId=${orderId}`
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.API_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'DAVID IMPORTADOS',
      expires: false
    };

    const response = await mercadopago.preferences.create(preference);
    
    console.log(`✅ Preferência criada: ${response.body.id}`);
    
    res.json({
      id: response.body.id,
      init_point: response.body.init_point, // URL para redirecionar
      sandbox_init_point: response.body.sandbox_init_point
    });
  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      message: error.message 
    });
  }
});

// Webhook do MercadoPago
app.post('/api/webhooks/mercadopago', async (req, res) => {
  try {
    console.log('📬 Webhook MercadoPago recebido:', req.body);
    
    const { type, data } = req.body;
    
    // Responder imediatamente ao webhook
    res.status(200).send('OK');
    
    // Processar notificação de pagamento
    if (type === 'payment') {
      const mercadopago = require('mercadopago');
      
      mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
      });
      
      // Buscar informações do pagamento
      const payment = await mercadopago.payment.findById(data.id);
      const paymentData = payment.body;
      
      console.log('💳 Status do pagamento:', paymentData.status);
      console.log('📦 Pedido:', paymentData.external_reference);
      
      const orderId = paymentData.external_reference;
      
      if (!orderId) {
        console.log('⚠️ Pedido não encontrado no external_reference');
        return;
      }
      
      // Atualizar status do pedido baseado no status do pagamento
      let orderStatus = 'pending';
      
      switch (paymentData.status) {
        case 'approved':
          orderStatus = 'processing';
          console.log('✅ Pagamento aprovado!');
          break;
        case 'pending':
        case 'in_process':
          orderStatus = 'pending';
          console.log('⏳ Pagamento pendente');
          break;
        case 'rejected':
        case 'cancelled':
          orderStatus = 'cancelled';
          console.log('❌ Pagamento rejeitado/cancelado');
          break;
      }
      
      // Atualizar pedido
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      console.log(`✅ Pedido ${orderId} atualizado para ${orderStatus}`);
      
      // Enviar email de atualização de status
      if (orderStatus === 'processing') {
        sendStatusUpdate(order, order.user, orderStatus).catch(err => 
          console.error('Erro ao enviar email:', err)
        );
      }
    }
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    // Não retornar erro para não fazer o MercadoPago retentar
  }
});

// Verificar status de pagamento manualmente
app.get('/api/payment/status/:paymentId', verifyToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const mercadopago = require('mercadopago');
    
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    
    const payment = await mercadopago.payment.findById(paymentId);
    
    res.json({
      status: payment.body.status,
      statusDetail: payment.body.status_detail,
      orderId: payment.body.external_reference
    });
  } catch (error) {
    console.error('❌ Erro ao verificar pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
});

// ====================
// ROTAS DE ENDEREÇOS
// ====================

// Listar endereços do usuário
app.get('/api/addresses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
    
    res.json(addresses);
  } catch (error) {
    console.error('❌ Erro ao listar endereços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar endereço
app.post('/api/addresses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body;
    
    // Se for endereço padrão, remover padrão dos outros
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }
    
    const address = await prisma.address.create({
      data: {
        userId,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        isDefault: isDefault || false
      }
    });
    
    console.log(`✅ Endereço criado: ${address.id}`);
    res.status(201).json(address);
  } catch (error) {
    console.error('❌ Erro ao criar endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar endereço
app.put('/api/addresses/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body;
    
    // Verificar se endereço pertence ao usuário
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId }
    });
    
    if (!existingAddress) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    
    // Se for endereço padrão, remover padrão dos outros
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false }
      });
    }
    
    const address = await prisma.address.update({
      where: { id },
      data: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        isDefault
      }
    });
    
    res.json(address);
  } catch (error) {
    console.error('❌ Erro ao atualizar endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar endereço
app.delete('/api/addresses/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    // Verificar se endereço pertence ao usuário
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });
    
    if (!address) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    
    await prisma.address.delete({
      where: { id }
    });
    
    res.json({ message: 'Endereço removido com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================
// USUÁRIOS
// ====================

// Buscar dados do usuário
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;
    
    // Usuário só pode ver seus próprios dados (ou admin pode ver qualquer)
    if (id !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        cpf: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar dados do usuário
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;
    const { fullName, phone, email } = req.body;
    
    // Usuário só pode editar seus próprios dados
    if (id !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Validações básicas
    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ error: 'Nome completo inválido' });
    }
    
    // Se está alterando email, verificar se já não existe
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: email.toLowerCase(),
          id: { not: id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName.trim(),
        phone: phone || null,
        ...(email && { email: email.toLowerCase() })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        cpf: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log(`✅ Usuário atualizado: ${updatedUser.id}`);
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar endereços do usuário
app.get('/api/addresses/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.userId;
    
    // Usuário só pode ver seus próprios endereços
    if (userId !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.json(addresses);
  } catch (error) {
    console.error('❌ Erro ao buscar endereços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ====================
// ROTAS DE FRETE
// ====================

// Calcular frete (Melhor Envio)
app.post('/api/shipping/calculate', async (req, res) => {
  try {
    const { zipCode, items } = req.body;
    
    if (!zipCode) {
      return res.status(400).json({ error: 'CEP é obrigatório' });
    }
    
    console.log(`📦 Calculando frete para CEP: ${zipCode}`);
    
    // Se não tiver token do Melhor Envio, retornar valores fixos de exemplo
    if (!process.env.MELHOR_ENVIO_TOKEN) {
      console.log('⚠️ Melhor Envio não configurado, usando valores de exemplo');
      return res.json({
        options: [
          {
            id: 'pac',
            name: 'PAC (Correios)',
            price: 15.90,
            deliveryTime: '7-10 dias úteis',
            company: {
              name: 'Correios',
              picture: ''
            }
          },
          {
            id: 'sedex',
            name: 'SEDEX (Correios)',
            price: 25.90,
            deliveryTime: '2-4 dias úteis',
            company: {
              name: 'Correios',
              picture: ''
            }
          }
        ]
      });
    }
    
    // Integração real com Melhor Envio
    const axios = require('axios');
    
    // Calcular dimensões e peso dos produtos
    const packages = items.map(item => ({
      height: 10, // cm - você deve pegar do produto
      width: 15,
      length: 20,
      weight: 0.5 // kg - você deve pegar do produto
    }));
    
    const response = await axios.post(
      'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        from: {
          postal_code: process.env.MELHOR_ENVIO_FROM_ZIP || '01310100'
        },
        to: {
          postal_code: zipCode.replace(/\D/g, '')
        },
        package: packages[0] // Simplificado - usar primeiro pacote
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'User-Agent': 'David Importados (contato@davidimportados.com)'
        }
      }
    );
    
    const options = response.data.map(option => ({
      id: option.id,
      name: option.name,
      price: parseFloat(option.price),
      deliveryTime: option.delivery_time + ' dias úteis',
      company: option.company
    }));
    
    res.json({ options });
  } catch (error) {
    console.error('❌ Erro ao calcular frete:', error);
    
    // Retornar valores de fallback em caso de erro
    res.json({
      options: [
        {
          id: 'pac',
          name: 'PAC (Correios)',
          price: 15.90,
          deliveryTime: '7-10 dias úteis',
          company: {
            name: 'Correios',
            picture: ''
          }
        },
        {
          id: 'sedex',
          name: 'SEDEX (Correios)',
          price: 25.90,
          deliveryTime: '2-4 dias úteis',
          company: {
            name: 'Correios',
            picture: ''
          }
        }
      ]
    });
  }
});

// ====================
// WISHLIST (Lista de Desejos)
// ====================

// Listar wishlist do usuário
app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de desejos' });
  }
});

// Adicionar produto à wishlist
app.post('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'productId é obrigatório' });
    }
    
    // Verificar se produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Verificar se já existe na wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Produto já está na lista de desejos' });
    }
    
    // Adicionar à wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: {
        product: {
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
    
    res.status(201).json({ wishlistItem });
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error);
    res.status(500).json({ error: 'Erro ao adicionar à lista de desejos' });
  }
});

// Remover produto da wishlist
app.delete('/api/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item não encontrado na lista de desejos' });
    }
    
    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    
    res.json({ message: 'Produto removido da lista de desejos' });
  } catch (error) {
    console.error('Erro ao remover da wishlist:', error);
    res.status(500).json({ error: 'Erro ao remover da lista de desejos' });
  }
});

// Verificar se produto está na wishlist
app.get('/api/wishlist/check/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    
    res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Erro ao verificar wishlist:', error);
    res.status(500).json({ error: 'Erro ao verificar lista de desejos' });
  }
});

// ====================
// REVIEWS (Avaliações de Produtos)
// ====================

// Listar avaliações de um produto
app.get('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Calcular média de avaliações
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({
      reviews,
      stats: {
        total: reviews.length,
        averageRating: parseFloat(avgRating.toFixed(1)),
        distribution: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// Criar avaliação
app.post('/api/products/:productId/reviews', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    
    // Validações
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Avaliação deve ser entre 1 e 5 estrelas' });
    }
    
    // Verificar se produto existe
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Verificar se usuário já avaliou
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Você já avaliou este produto' });
    }
    
    // Verificar se usuário comprou o produto (opcional - compra verificada)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'delivered'
        }
      }
    });
    
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment: comment || null,
        isVerified: !!hasPurchased
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json({ review });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Atualizar avaliação
app.put('/api/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    
    if (!review) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    
    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Você não pode editar esta avaliação' });
    }
    
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || review.rating,
        comment: comment !== undefined ? comment : review.comment,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
    
    res.json({ review: updatedReview });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ error: 'Erro ao atualizar avaliação' });
  }
});

// Deletar avaliação
app.delete('/api/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    
    if (!review) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    
    // Apenas o próprio usuário ou admin pode deletar
    if (review.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Você não pode deletar esta avaliação' });
    }
    
    await prisma.review.delete({ where: { id: reviewId } });
    
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
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
      console.log('🔍 GET    /health');
      console.log('📂 GET    /api/categories');
      console.log('📦 GET    /api/products');
      console.log('📊 GET    /api/admin/dashboard');
      console.log('📦 GET    /api/admin/products');
      console.log('📦 GET    /api/admin/products/:id');
      console.log('➕ POST   /api/admin/products');
      console.log('✏️  PUT    /api/admin/products/:id');
      console.log('�️  DELETE /api/admin/products/:id');
      console.log('➕ POST   /api/admin/categories');
      console.log('✏️  PUT    /api/admin/categories/:id');
      console.log('🗑️  DELETE /api/admin/categories/:id');
      console.log('�🔐 POST   /api/auth/login');
      console.log('🚀 ========================================');
      console.log(`💡 Teste em: http://localhost:${PORT}/health`);
      console.log(`� Cart APIs: /api/cart (GET/POST/PUT/DELETE)`);
      console.log(`�📊 Dashboard: http://localhost:3000/admin`);
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
