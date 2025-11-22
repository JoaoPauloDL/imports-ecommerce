const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  console.log('🔍 Verificando categorias no Supabase...\n');
  
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  console.table(categories.map(c => ({
    ID: c.id.substring(0, 8),
    Nome: c.name,
    Slug: c.slug,
    Ativa: c.isActive ? '✅' : '❌',
    Ordem: c.order,
    'Nº Produtos': c._count.products
  })));
  
  console.log('\n📊 Total de categorias:', categories.length);
  console.log('✅ Ativas:', categories.filter(c => c.isActive).length);
  console.log('❌ Inativas:', categories.filter(c => !c.isActive).length);
  
  await prisma.$disconnect();
}

checkCategories();
