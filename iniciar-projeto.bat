@echo off
echo ========================================
echo 🚀 INICIANDO IMPORTSSTORE COMPLETO
echo ========================================
echo.

echo 📁 Navegando para pasta backend...
cd /d "C:\Users\Usuário\Documents\GitHub\importsStore\backend"

echo 🔍 Verificando se servidor backend já está rodando...
netstat -ano | findstr :5000 > nul
if %errorlevel% == 0 (
    echo ✅ Backend já rodando na porta 5000
) else (
    echo 🚀 Iniciando servidor backend com autenticação na porta 5000...
    start "Backend Server" cmd /k "node server-simples.js"
    timeout /t 3 > nul
)

echo.
echo 📁 Navegando para pasta frontend...
cd /d "C:\Users\Usuário\Documents\GitHub\importsStore\frontend"

echo 🔍 Verificando se frontend já está rodando...
netstat -ano | findstr :3000 > nul
if %errorlevel% == 0 (
    echo ✅ Frontend já rodando na porta 3000
) else (
    echo 🚀 Iniciando servidor frontend na porta 3000...
    start "Frontend Server" cmd /k "npm run dev"
    timeout /t 5 > nul
)

echo.
echo ========================================
echo ✅ SERVIDORES INICIADOS COM AUTENTICAÇÃO!
echo ========================================
echo 🔗 Backend:  http://localhost:5000
echo 🔗 Frontend: http://localhost:3000
echo � Login:    http://localhost:3000/login
echo 🛡️  Admin:    http://localhost:3000/admin
echo ========================================
echo 🔐 CREDENCIAIS DE TESTE:
echo    Email: admin@davidimportados.com
echo    Senha: admin123
echo ========================================
echo.
echo 💡 Aguarde alguns segundos para os servidores iniciarem...
echo 🌐 O navegador abrirá automaticamente em 10 segundos...
echo.

timeout /t 10 > nul
start "" "http://localhost:3000"

echo Pressione qualquer tecla para fechar...
pause > nul