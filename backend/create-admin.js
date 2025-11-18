const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Criando usuário administrador...');

    // Hash da senha admin123
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Verificar se admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      // Atualizar senha do admin existente
      await prisma.user.update({
        where: { email: 'admin@admin.com' },
        data: {
          passwordHash,
          role: 'admin',
          isActive: true,
          emailVerified: true
        }
      });
      console.log('✅ Admin atualizado com sucesso!');
    } else {
      // Criar novo admin
      await prisma.user.create({
        data: {
          email: 'admin@admin.com',
          passwordHash,
          fullName: 'Administrador',
          role: 'admin',
          isActive: true,
          emailVerified: true
        }
      });
      console.log('✅ Admin criado com sucesso!');
    }

    console.log('\n📋 Credenciais do Admin:');
    console.log('   Email: admin@admin.com');
    console.log('   Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere essa senha em produção!\n');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
