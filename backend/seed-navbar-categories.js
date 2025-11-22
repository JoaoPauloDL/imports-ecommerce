const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedNavbarCategories() {
  console.log('🌱 Criando categorias do navbar...\n');

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

  for (const category of navbarCategories) {
    try {
      // Verifica se já existe
      const existing = await prisma.category.findFirst({
        where: { 
          OR: [
            { slug: category.slug },
            { name: category.name }
          ]
        }
      });

      if (existing) {
        console.log(`⏭️  Categoria "${category.name}" já existe (ID: ${existing.id})`);
        continue;
      }

      // Cria a categoria
      const created = await prisma.category.create({
        data: category
      });

      console.log(`✅ Criada: ${created.name} (ID: ${created.id}, Slug: ${created.slug})`);
    } catch (error) {
      console.error(`❌ Erro ao criar "${category.name}":`, error.message);
    }
  }

  console.log('\n✨ Processo concluído!');
  
  // Mostra todas as categorias
  console.log('\n📋 Categorias no banco de dados:');
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });
  
  console.table(allCategories.map(c => ({
    ID: c.id.substring(0, 8) + '...',
    Nome: c.name,
    Slug: c.slug,
    Ordem: c.order,
    Ativa: c.isActive ? '✓' : '✗'
  })));
}

seedNavbarCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
