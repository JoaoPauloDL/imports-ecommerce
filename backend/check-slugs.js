const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSlugs() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      take: 10
    });

    console.log('\n📋 Produtos e seus slugs:');
    console.log('='.repeat(50));
    
    products.forEach(p => {
      console.log(`${p.name.padEnd(30)} → slug: "${p.slug}"`);
    });

    console.log('='.repeat(50));
    console.log(`\n✅ Total: ${products.length} produtos`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSlugs();
