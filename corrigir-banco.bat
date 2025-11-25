@echo off
echo ================================
echo CORRIGINDO BANCO DE DADOS
echo ================================
echo.

echo [1/5] Parando servidores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/5] Removendo SQLite local...
cd backend
if exist prisma\dev.db del /Q prisma\dev.db
if exist prisma\dev.db-journal del /Q prisma\dev.db-journal
echo    ✓ SQLite removido

echo [3/5] Regenerando Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo    ✗ Erro ao regenerar Prisma Client
    pause
    exit /b 1
)
echo    ✓ Prisma Client regenerado

echo [4/5] Verificando conexao com Supabase...
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('   ✓ Supabase conectado!'); prisma.$disconnect(); }).catch(err => { console.error('   ✗ Erro:', err.message); process.exit(1); });"

echo [5/5] Iniciando servidores...
start "Backend" cmd /k "cd backend && node app.js"
timeout /t 3 >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo ✓ SISTEMA CORRIGIDO!
echo ================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
