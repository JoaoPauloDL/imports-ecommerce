# Script de Teste dos Endpoints - ImportsStore
# Valida funcionamento após sync do banco

Write-Host "🧪 TESTE DO SISTEMA - ImportsStore" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# 1. Health Check
Write-Host "✅ 1. Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Database: $($health.database)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ FALHA: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Milliseconds 500

# 2. Produtos (com coluna images)
Write-Host "`n✅ 2. Produtos (verifica coluna images)" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get
    $count = $products.Count
    Write-Host "   Total de produtos: $count" -ForegroundColor Green
    
    if ($count -gt 0) {
        $first = $products[0]
        Write-Host "   Primeiro produto:" -ForegroundColor Green
        Write-Host "     - ID: $($first.id)" -ForegroundColor White
        Write-Host "     - Nome: $($first.name)" -ForegroundColor White
        Write-Host "     - Preço: R$ $($first.price)" -ForegroundColor White
        Write-Host "     - Images: $($first.images -join ', ')" -ForegroundColor White
        Write-Host "     - Categorias: $($first.categories.Count)" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ FALHA: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Milliseconds 500

# 3. Categorias
Write-Host "`n✅ 3. Categorias" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
    $count = $categories.Count
    Write-Host "   Total de categorias: $count" -ForegroundColor Green
    
    if ($count -gt 0) {
        Write-Host "   Categorias:" -ForegroundColor Green
        $categories | Select-Object -First 5 | ForEach-Object {
            Write-Host "     - $($_.name) ($($_._count.products) produtos)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "   ❌ FALHA: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Milliseconds 500

# 4. Dashboard Admin
Write-Host "`n✅ 4. Dashboard Admin" -ForegroundColor Yellow
try {
    $dashboard = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Method Get
    Write-Host "   Usuários: $($dashboard.totalUsers)" -ForegroundColor Green
    Write-Host "   Produtos: $($dashboard.totalProducts)" -ForegroundColor Green
    Write-Host "   Categorias: $($dashboard.totalCategories)" -ForegroundColor Green
    Write-Host "   Pedidos: $($dashboard.totalOrders)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ FALHA: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "🎯 Testes concluídos!" -ForegroundColor Green
