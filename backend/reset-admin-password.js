const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  try {
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualiza a senha do admin@admin.com
    const updated = await prisma.user.update({
      where: { email: 'admin@admin.com' },
      data: { passwordHash: hashedPassword }
    });
    
    console.log('\n✅ Senha resetada com sucesso!\n');
    console.log('Email: admin@admin.com');
    console.log('Senha: admin123');
    console.log('\nVoce pode fazer login agora!\n');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
