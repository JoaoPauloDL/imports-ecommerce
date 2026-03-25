const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    where: {
      items: {
        some: {}
      }
    },
    select: {
      id: true,
      userId: true,
      status: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(JSON.stringify(order));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
