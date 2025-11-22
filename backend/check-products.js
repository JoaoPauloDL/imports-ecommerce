const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  console.log('🔍 Verificando produtos e suas categorias...\n');
  
  const products = await prisma.product.findMany({
    include: {
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('📦 PRODUTOS E SUAS CATEGORIAS:\n');
  
  products.forEach((product, index) => {
    const cats = product.categories.map(pc => pc.category.name).join(', ');
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Ativo: ${product.isActive ? '✅' : '❌'}`);
    console.log(`   Categorias: ${cats || '(sem categoria)'}`);
    console.log(`   Slugs: ${product.categories.map(pc => pc.category.slug).join(', ')}`);
    console.log('');
  });
  
  console.log(`📊 Total: ${products.length} produtos`);
  console.log(`✅ Ativos: ${products.filter(p => p.isActive).length}`);
  console.log(`📂 Com categorias: ${products.filter(p => p.categories.length > 0).length}`);
  console.log(`❌ Sem categorias: ${products.filter(p => p.categories.length === 0).length}`);
  
  await prisma.$disconnect();
}

checkProducts();
