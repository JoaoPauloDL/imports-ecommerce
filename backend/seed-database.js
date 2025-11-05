const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar categorias
    const categories = [
      { name: 'Ofertas Exclusivas', description: 'Produtos em promoção', order: 1 },
      { name: 'Masculinos', description: 'Produtos masculinos', order: 2 },
      { name: 'Femininos', description: 'Produtos femininos', order: 3 },
      { name: 'Lançamentos', description: 'Produtos recém-chegados', order: 4 },
      { name: 'Eletrônicos', description: 'Dispositivos eletrônicos', order: 5 },
      { name: 'Casa & Decoração', description: 'Itens para casa', order: 6 }
    ];

    console.log('📂 Criando categorias...');
    const createdCategories = [];
    
    for (const category of categories) {
      const slug = category.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      try {
        const created = await prisma.category.upsert({
          where: { slug },
          update: { 
            name: category.name,
            description: category.description,
            order: category.order
          },
          create: {
            name: category.name,
            slug,
            description: category.description,
            order: category.order,
            isActive: true
          }
        });
        createdCategories.push(created);
        console.log(`✅ Categoria: ${created.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar categoria ${category.name}:`, error.message);
      }
    }

    // Criar produtos de exemplo
    console.log('📦 Criando produtos...');
    
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Smartphone Apple com tecnologia avançada',
        price: 8999.99,
        sku: 'IPH15PM001',
        stockQuantity: 10,
        categoryId: createdCategories.find(c => c.name === 'Eletrônicos')?.id,
        featured: true,
        imageUrl: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro+Max'
      },
      {
        name: 'Perfume Importado Masculino',
        description: 'Fragrância masculina exclusiva',
        price: 299.90,
        sku: 'PERF001M',
        stockQuantity: 25,
        categoryId: createdCategories.find(c => c.name === 'Masculinos')?.id,
        featured: true,
        imageUrl: 'https://via.placeholder.com/400x400?text=Perfume+Masculino'
      },
      {
        name: 'Perfume Importado Feminino',
        description: 'Fragrância feminina elegante',
        price: 349.90,
        sku: 'PERF001F',
        stockQuantity: 30,
        categoryId: createdCategories.find(c => c.name === 'Femininos')?.id,
        featured: true,
        imageUrl: 'https://via.placeholder.com/400x400?text=Perfume+Feminino'
      },
      {
        name: 'Smartwatch Premium',
        description: 'Relógio inteligente com GPS',
        price: 1299.90,
        sku: 'SW001PREM',
        stockQuantity: 15,
        categoryId: createdCategories.find(c => c.name === 'Eletrônicos')?.id,
        featured: false,
        imageUrl: 'https://via.placeholder.com/400x400?text=Smartwatch'
      },
      {
        name: 'Luminária LED Inteligente',
        description: 'Luminária com controle por app',
        price: 189.90,
        sku: 'LED001SMART',
        stockQuantity: 20,
        categoryId: createdCategories.find(c => c.name === 'Casa & Decoração')?.id,
        featured: false,
        imageUrl: 'https://via.placeholder.com/400x400?text=Luminaria+LED'
      }
    ];

    for (const product of products) {
      const slug = product.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      try {
        const created = await prisma.product.upsert({
          where: { slug },
          update: {
            name: product.name,
            description: product.description,
            price: product.price,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            featured: product.featured,
            imageUrl: product.imageUrl,
            isActive: true
          },
          create: {
            name: product.name,
            slug,
            description: product.description,
            price: product.price,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            featured: product.featured,
            imageUrl: product.imageUrl,
            isActive: true
          }
        });
        console.log(`✅ Produto: ${created.name} - R$ ${created.price}`);
      } catch (error) {
        console.error(`❌ Erro ao criar produto ${product.name}:`, error.message);
      }
    }

    // Criar usuário admin
    console.log('👤 Criando usuário admin...');
    try {
      const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {
          fullName: 'Administrador',
          role: 'admin',
          isActive: true
        },
        create: {
          email: 'admin@admin.com',
          passwordHash: 'admin123', // Em produção seria um hash real
          fullName: 'Administrador',
          role: 'admin',
          isActive: true,
          emailVerified: true
        }
      });
      console.log(`✅ Admin: ${admin.email}`);
    } catch (error) {
      console.error('❌ Erro ao criar admin:', error.message);
    }

    console.log('🎉 Seed concluído com sucesso!');
    console.log('📊 Dados disponíveis:');
    console.log(`   - ${createdCategories.length} categorias`);
    console.log(`   - ${products.length} produtos`);
    console.log('   - 1 usuário admin (admin@admin.com / admin123)');
    
  } catch (error) {
    console.error('💥 Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();