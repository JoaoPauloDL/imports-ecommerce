// Script para aplicar migração manual no banco de dados
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
  console.log('🔄 Iniciando migração manual...\n');

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'prisma', 'migrations', 'manual_order_update.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir em comandos individuais (separados por ponto e vírgula)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('SELECT'));

    console.log(`📝 Encontrados ${commands.length} comandos SQL para executar\n`);

    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`\n⚙️  Executando comando ${i + 1}/${commands.length}:`);
      console.log(`   ${command.substring(0, 60)}...`);
      
      try {
        await prisma.$executeRawUnsafe(command);
        console.log(`   ✅ Comando ${i + 1} executado com sucesso`);
      } catch (error) {
        // Ignorar erros de "já existe" (safe migration)
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`   ⚠️  Comando ${i + 1} já aplicado (pulando)`);
        } else {
          throw error;
        }
      }
    }

    // Verificar as mudanças
    console.log('\n\n🔍 Verificando colunas adicionadas...');
    const result = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name IN ('shipping_cost', 'order_number', 'payment_id', 'payment_status')
      ORDER BY column_name;
    `;

    console.log('\n📊 Colunas na tabela orders:');
    console.table(result);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📌 Próximos passos:');
    console.log('   1. Execute: npx prisma generate');
    console.log('   2. Reinicie o servidor backend');
    
  } catch (error) {
    console.error('\n❌ Erro ao aplicar migração:', error.message);
    console.error('\nDetalhes:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
