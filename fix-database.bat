@echo off
cls
echo ========================================
echo FIX: Forçando uso do Supabase
echo ========================================
echo.

cd backend

echo [1/3] Deletando SQLite local...
if exist prisma\dev.db (
    del /Q prisma\dev.db
    echo     ✓ dev.db removido
) else (
    echo     ℹ dev.db nao existe
)

if exist prisma\dev.db-journal (
    del /Q prisma\dev.db-journal  
    echo     ✓ dev.db-journal removido
) else (
    echo     ℹ dev.db-journal nao existe
)

echo.
echo [2/3] Deletando Prisma Client antigo...
if exist node_modules\.prisma (
    rmdir /S /Q node_modules\.prisma
    echo     ✓ Cache limpo
)

echo.
echo [3/3] Gerando novo Prisma Client...
call npx prisma generate

echo.
echo ========================================
echo ✓ FEITO!
echo ========================================
echo.
echo IMPORTANTE: 
echo 1. Pare TODOS os servidores (Ctrl+C)
echo 2. Execute: node backend\app.js
echo 3. Execute: npm run dev (no frontend)
echo.
pause
