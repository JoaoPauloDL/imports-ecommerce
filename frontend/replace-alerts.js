// Script para substituir alert() por toast() em todos os arquivos
// Execute: node replace-alerts.js

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/admin/ImageUpload.tsx',
  'src/app/orders/[id]/OrderDetailContent.tsx',
  'src/app/contact/page.tsx',
  'src/app/(user)/profile/addresses/AddressesContent.tsx',
  'src/app/admin/orders/OrdersManagement.tsx',
  'src/app/admin/categories/page.tsx',
  'src/app/admin/products/[id]/edit/page.tsx'
];

const replacements = [
  {
    from: /alert\('([^']+)'\)/g,
    to: "toast.success('$1')" // Assume success por padrão
  },
  {
    from: /alert\(`([^`]+)`\)/g,
    to: "toast.success(`$1`)"
  },
  {
    from: /alert\("([^"]+)"\)/g,
    to: 'toast.success("$1")'
  }
];

const errorKeywords = ['erro', 'error', 'falha', 'failed', 'não', 'nao'];

function shouldBeError(message) {
  const lowerMessage = message.toLowerCase();
  return errorKeywords.some(keyword => lowerMessage.includes(keyword));
}

console.log('🔄 Iniciando substituição de alert() por toast()...\n');

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Adicionar import se não existir
  if (!content.includes("from '@/lib/toast'")) {
    const importLine = "import { toast } from '@/lib/toast'\n";
    
    // Encontrar a última linha de import
    const importRegex = /^import .+ from .+$/gm;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      content = content.replace(lastImport, lastImport + '\n' + importLine);
    }
  }

  // Substituir alerts
  content = content.replace(/alert\(([^)]+)\)/g, (match, message) => {
    // Determinar se é sucesso ou erro baseado na mensagem
    const isError = shouldBeError(message);
    const toastType = isError ? 'error' : 'success';
    
    return `toast.${toastType}(${message})`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
  } else {
    console.log(`⏭️  ${file} (sem alterações)`);
  }
});

console.log('\n🎉 Substituição concluída!');
