@echo off
echo 🚀 Iniciando David Importados Frontend...
echo.

cd /d "C:\Users\Usuário\Documents\GitHub\importsStore\frontend"

echo 📍 Diretório: %CD%
echo 📦 Verificando dependências...

if not exist "node_modules\next" (
    echo ❌ Next.js não encontrado! Instalando...
    npm install
)

echo ✅ Iniciando servidor de desenvolvimento...
echo 🌐 URL: http://localhost:3000
echo.

npx next dev
pause