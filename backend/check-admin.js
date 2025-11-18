const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const admins = await prisma.user.findMany({ 
      where: { 
        OR: [
          { role: 'ADMIN' },
          { role: 'admin' }
        ]
      },
      select: { id: true, email: true, fullName: true, role: true }
    });
    
    console.log('\n=== USUARIOS ADMIN NO BANCO ===\n');
    
    if (admins.length === 0) {
      console.log('Nenhum admin encontrado.');
      console.log('\nVoce precisa criar um admin. Use:');
      console.log('  node setup-admin.js');
    } else {
      console.log(`Total: ${admins.length} admin(s)\n`);
      admins.forEach(admin => {
        console.log(`ID: ${admin.id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Nome: ${admin.fullName}`);
        console.log('---');
      });
      console.log('\nVoce pode fazer login com qualquer um desses usuarios.');
    }
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
