@echo off
echo =======================================
echo 🚀 INICIANDO SERVIDORES DAVID IMPORTADOS
echo =======================================

echo.
echo 🔧 Iniciando Backend (Admin Server)...
start "Backend" cmd /k "cd /d C:\Users\Usuário\Documents\GitHub\importsStore\backend && node admin-server.js"

echo.
echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Iniciando Frontend (Next.js)...
start "Frontend" cmd /k "cd /d C:\Users\Usuário\Documents\GitHub\importsStore\frontend && npm run dev"

echo.
echo ✅ SERVIDORES INICIADOS!
echo.
echo 📊 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo 🔐 Admin: http://localhost:3000/admin
echo.
echo 🔑 Credenciais Admin:
echo    Email: admin@davidimportados.com
echo    Senha: admin123
echo.
pause