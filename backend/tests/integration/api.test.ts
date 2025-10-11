import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/app';
import { cleanExpiredTokens } from '../src/utils/jwt.utils';

// Configuração para testes
beforeAll(async () => {
  // Limpar banco de teste
  await prisma.refreshToken.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Limpar tokens expirados
  await cleanExpiredTokens();
  
  // Fechar conexão
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    phone: '+5511999999999',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.fullName).toBe(userData.fullName);
      expect(response.body.data.user.emailVerified).toBe(false);
    });

    it('should not register user with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          email: 'test2@example.com',
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    // Primeiro verificar o email manualmente para os testes
    beforeAll(async () => {
      await prisma.user.updateMany({
        where: { email: userData.email },
        data: { emailVerified: true },
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should not refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      accessToken = loginResponse.body.data.tokens.accessToken;
      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(401);
    });
  });
});

describe('Products Endpoints', () => {
  let accessToken: string;
  let adminToken: string;
  let categoryId: string;
  let productId: string;

  beforeAll(async () => {
    // Criar usuário admin para testes
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: '$2a$12$example', // Hash real seria necessário
        fullName: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    // Criar categoria de teste
    const category = await prisma.category.create({
      data: {
        name: 'Eletrônicos',
        slug: 'eletronicos',
        description: 'Categoria de teste',
        active: true,
      },
    });
    categoryId = category.id;

    // Fazer login como usuário normal
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    accessToken = loginResponse.body.data.tokens.accessToken;
  });

  describe('GET /api/products', () => {
    it('should list products without authentication', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ categoryId })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ search: 'smartphone' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe('GET /api/categories', () => {
    it('should list categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.categories.length).toBeGreaterThan(0);
    });
  });
});

describe('Cart Endpoints', () => {
  let accessToken: string;
  let variantId: string;

  beforeAll(async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    accessToken = loginResponse.body.data.tokens.accessToken;

    // Criar produto de teste para o carrinho
    const product = await prisma.product.create({
      data: {
        categoryId: 'category-id', // Use o ID da categoria criada anteriormente
        name: 'Produto Teste',
        slug: 'produto-teste',
        description: 'Produto para teste do carrinho',
        weightKg: 0.5,
        active: true,
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: 'TEST-001',
        name: 'Produto Teste - Padrão',
        priceBrl: 99.90,
        costBrl: 50.00,
        active: true,
      },
    });

    // Criar estoque
    await prisma.stock.create({
      data: {
        variantId: variant.id,
        quantity: 100,
        reservedQuantity: 0,
      },
    });

    variantId = variant.id;
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          variantId,
          quantity: 2,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/cart/add')
        .send({
          variantId,
          quantity: 1,
        })
        .expect(401);
    });

    it('should validate stock availability', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          variantId,
          quantity: 1000, // Quantidade maior que o estoque
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cart', () => {
    it('should get user cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/cart')
        .expect(401);
    });
  });

  describe('PUT /api/cart/update', () => {
    it('should update cart item quantity', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          variantId,
          quantity: 3,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/cart/remove', () => {
    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ variantId })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});