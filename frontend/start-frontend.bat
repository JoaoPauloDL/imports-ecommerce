@echo off
echo 🚀 Iniciando frontend do David Importados...
echo.
echo Verificando se o backend está rodando...
curl -s http://localhost:5000/health > nul
if %errorlevel% neq 0 (
    echo ❌ Backend não está rodando! Inicie primeiro com: node admin-server.js
    echo.
    pause
    exit /b 1
)

echo ✅ Backend está funcionando!
echo 🎨 Iniciando Next.js...
echo.
npm run dev