const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ============================================
// CONFIGURE SUA NOVA SENHA AQUI:
// ============================================
const ADMIN_EMAIL = 'admin@davidimportados.com'; // ou 'admin@admin.com'
const NEW_PASSWORD = 'COLOQUE_SUA_SENHA_AQUI';   // ALTERE PARA SUA SENHA FORTE
// ============================================

(async () => {
  try {
    console.log('\n🔐 Resetando senha do admin...\n');
    
    // Verificar se o usuário existe
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: ADMIN_EMAIL },
          { email: 'admin@admin.com' },
          { role: 'admin' }
        ]
      }
    });
    
    if (!user) {
      console.log('❌ Usuário admin não encontrado!');
      console.log('   Emails tentados:', ADMIN_EMAIL, 'e admin@admin.com');
      return;
    }
    
    console.log('📧 Usuário encontrado:', user.email);
    
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    
    // Atualiza a senha
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });
    
    console.log('\n✅ Senha resetada com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user.email);
    console.log('🔑 Nova Senha:', NEW_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANTE: Guarde esta senha em local seguro!');
    console.log('⚠️  Depois de usar, apague a senha deste arquivo!\n');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
