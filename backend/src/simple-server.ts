import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando!' });
});

// Teste de conexão com banco
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    
    res.json({
      success: true,
      message: 'Conexão com banco OK!',
      data: {
        users: userCount,
        products: productCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao conectar com banco',
      error: error.message
    });
  }
});

// Login admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
});

// Admin - Dashboard
app.get('/api/admin/dashboard', async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dashboard',
      error: error.message
    });
  }
});

// Admin - Listar produtos
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
});

// Admin - Criar produto
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, slug, description, price, sku, stockQuantity, featured } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: parseFloat(price),
        sku,
        stockQuantity: parseInt(stockQuantity) || 0,
        featured: Boolean(featured),
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Teste DB: http://localhost:${PORT}/api/test-db`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});