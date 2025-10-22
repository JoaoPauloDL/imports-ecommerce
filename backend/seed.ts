import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('❌ Usuário admin já existe:', existingAdmin.email);
      return;
    }

    // Criar usuário admin
    const password = 'admin123'; // Senha temporária
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@davidimportados.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
        active: true,
        emailVerified: true
      }
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha:', password);
    console.log('⚠️  IMPORTANTE: Altere esta senha após o primeiro login!');

    // Criar alguns produtos de exemplo
    const sampleProducts = [
      {
        name: 'Perfume Importado Masculino',
        slug: 'perfume-masculino-01',
        description: 'Fragrância elegante e sofisticada para homens modernos.',
        price: 149.90,
        sku: 'PERF-MASC-001',
        stock: 50,
        active: true,
        featured: true
      },
      {
        name: 'Perfume Importado Feminino',
        slug: 'perfume-feminino-01',
        description: 'Perfume delicado e envolvente para mulheres refinadas.',
        price: 179.90,
        sku: 'PERF-FEM-001',
        stock: 30,
        active: true,
        featured: true
      },
      {
        name: 'Eau de Toilette Unissex',
        slug: 'eau-de-toilette-unissex',
        description: 'Fragrância versátil para todas as ocasiões.',
        price: 99.90,
        sku: 'EDT-UNI-001',
        stock: 25,
        active: true,
        featured: false
      }
    ];

    for (const productData of sampleProducts) {
      await prisma.product.create({
        data: productData
      });
    }

    console.log('✅ Produtos de exemplo criados!');

  } catch (error) {
    console.error('❌ Erro ao criar dados iniciais:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();