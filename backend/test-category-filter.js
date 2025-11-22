const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCategoryFilter() {
  console.log('🔍 Testando filtro de categoria "masculinos"...\n');
  
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: {
        some: {
          category: {
            slug: 'masculinos'
          }
        }
      }
    },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
  
  console.log(`✅ Produtos encontrados em "Masculinos": ${products.length}\n`);
  
  products.forEach((prod, index) => {
    console.log(`${index + 1}. ${prod.name}`);
    console.log(`   ID: ${prod.id}`);
    console.log(`   Categorias: ${prod.categories.map(c => c.category.name).join(', ')}`);
    console.log('');
  });
  
  if (products.length === 0) {
    console.log('❌ Nenhum produto encontrado!');
    console.log('\n🔍 Verificando MALBEC especificamente...\n');
    
    const malbec = await prisma.product.findFirst({
      where: {
        name: { contains: 'MALBEC', mode: 'insensitive' }
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    
    if (malbec) {
      console.log(`✅ MALBEC encontrado:`);
      console.log(`   ID: ${malbec.id}`);
      console.log(`   Ativo: ${malbec.isActive ? 'Sim' : 'Não'}`);
      console.log(`   Categorias: ${malbec.categories.map(c => c.category.name).join(', ')}`);
      console.log(`   Slugs: ${malbec.categories.map(c => c.category.slug).join(', ')}`);
    } else {
      console.log('❌ MALBEC não encontrado no banco!');
    }
  }
  
  await prisma.$disconnect();
}

testCategoryFilter();
