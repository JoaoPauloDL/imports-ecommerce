const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetCategories() {
  console.log('🔄 RESET COMPLETO DO SISTEMA DE CATEGORIAS\n');
  
  try {
    // 1. LIMPAR TUDO
    console.log('🗑️  PASSO 1: Removendo categorias antigas...');
    
    // Primeiro remove os relacionamentos
    const deletedRelations = await prisma.productCategory.deleteMany({});
    console.log(`   ✅ ${deletedRelations.count} relacionamentos produto-categoria removidos`);
    
    // Depois remove as categorias
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`   ✅ ${deletedCategories.count} categorias removidas\n`);
    
    // 2. CRIAR AS 5 CATEGORIAS DO NAVBAR
    console.log('✨ PASSO 2: Criando as 5 categorias do navbar...\n');
    
    const navbarCategories = [
      {
        name: 'Ofertas',
        slug: 'ofertas',
        description: 'Descontos exclusivos e oportunidades limitadas',
        order: 1,
        isActive: true
      },
      {
        name: 'Essências Árabes',
        slug: 'arabes',
        description: 'Aromas intensos e luxuosos do Oriente Médio',
        order: 2,
        isActive: true
      },
      {
        name: 'Perfumes Franceses',
        slug: 'franceses',
        description: 'Elegância e sofisticação parisiense',
        order: 3,
        isActive: true
      },
      {
        name: 'Masculinos',
        slug: 'masculinos',
        description: 'Fragrâncias marcantes e elegantes',
        order: 4,
        isActive: true
      },
      {
        name: 'Femininos',
        slug: 'femininos',
        description: 'Delicadeza e sofisticação em cada gota',
        order: 5,
        isActive: true
      }
    ];

    const createdCategories = [];
    
    for (const category of navbarCategories) {
      const created = await prisma.category.create({
        data: category
      });
      createdCategories.push(created);
      console.log(`   ✅ ${created.name} (slug: ${created.slug})`);
    }
    
    console.log('\n📊 RESULTADO FINAL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const finalCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });
    
    console.table(finalCategories.map(c => ({
      '🏷️ Nome': c.name,
      '🔗 Slug': c.slug,
      '📝 Descrição': c.description.substring(0, 40) + '...',
      '📍 Ordem': c.order,
      '✓ Ativa': c.isActive ? 'Sim' : 'Não'
    })));
    
    console.log('\n✨ Sistema de categorias resetado com sucesso!');
    console.log('\n📌 PRÓXIMOS PASSOS:');
    console.log('   1. Ao criar um produto, você pode marcar VÁRIAS categorias');
    console.log('   2. Um produto pode estar em "Ofertas" E "Masculinos" ao mesmo tempo');
    console.log('   3. O navbar mostrará automaticamente essas 5 categorias');
    console.log('   4. Os produtos aparecerão quando clicar na categoria correspondente\n');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetCategories();
