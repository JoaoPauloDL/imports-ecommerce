$ErrorActionPreference = 'Stop'

$backendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$base = 'http://localhost:5000'

function Invoke-JsonRequest {
  param(
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers,
    [object]$Body
  )

  try {
    $jsonBody = $null
    if ($null -ne $Body) { $jsonBody = ($Body | ConvertTo-Json -Depth 10) }

    $resp = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -Body $jsonBody -ContentType 'application/json' -UseBasicParsing
    $content = if ($resp.Content) { $resp.Content | ConvertFrom-Json } else { $null }

    return [PSCustomObject]@{
      Ok = $true
      StatusCode = [int]$resp.StatusCode
      Data = $content
      Raw = $resp.Content
    }
  }
  catch {
    $status = -1
    $raw = ''

    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $raw = $reader.ReadToEnd()
      $reader.Close()
    }

    $data = $null
    try { if ($raw) { $data = $raw | ConvertFrom-Json } } catch {}

    return [PSCustomObject]@{
      Ok = $false
      StatusCode = $status
      Data = $data
      Raw = $raw
    }
  }
}

Write-Host '🚀 Iniciando backend para validação...'
$proc = Start-Process -FilePath 'node' -ArgumentList 'app.js' -WorkingDirectory $backendPath -PassThru

try {
  Start-Sleep -Seconds 6

  Write-Host '1) Health check'
  $health = Invoke-JsonRequest -Method 'GET' -Url "$base/health" -Headers @{} -Body $null
  if (-not $health.Ok) { throw "Health falhou: HTTP $($health.StatusCode) | $($health.Raw)" }
  Write-Host "   ✅ $($health.Data.status) | DB: $($health.Data.database)"

  $ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $email = "qa.checkout.$ts@example.com"
  $password = '123456'

  Write-Host '2) Registrar usuário de teste'
  $register = Invoke-JsonRequest -Method 'POST' -Url "$base/api/auth/register" -Headers @{} -Body @{
    email = $email
    password = $password
    fullName = 'QA Checkout'
    phone = '11987654321'
  }

  if (-not $register.Ok) { throw "Registro falhou: HTTP $($register.StatusCode) | $($register.Raw)" }
  $token = $register.Data.token
  if (-not $token) { throw 'Token não retornado no registro' }
  Write-Host "   ✅ Usuário criado: $email"

  $auth = @{ Authorization = "Bearer $token" }

  Write-Host '3) Buscar produto com estoque'
  $products = Invoke-JsonRequest -Method 'GET' -Url "$base/api/products" -Headers @{} -Body $null
  if (-not $products.Ok) { throw "Produtos falhou: HTTP $($products.StatusCode) | $($products.Raw)" }

  $product = $products.Data | Where-Object { $_.isActive -eq $true -and [int]$_.stockQuantity -gt 0 } | Select-Object -First 1
  if (-not $product) { throw 'Nenhum produto ativo com estoque para validação' }
  Write-Host "   ✅ Produto: $($product.id) - $($product.name)"

  Write-Host '4) Criar endereço'
  $address = Invoke-JsonRequest -Method 'POST' -Url "$base/api/addresses" -Headers $auth -Body @{
    street = 'Rua Teste'
    number = '123'
    complement = 'Apto 1'
    neighborhood = 'Centro'
    city = 'São Paulo'
    state = 'SP'
    zipCode = '01001000'
    isDefault = $true
  }

  if (-not $address.Ok) { throw "Endereço falhou: HTTP $($address.StatusCode) | $($address.Raw)" }
  $addressId = $address.Data.id
  if (-not $addressId) { throw 'ID do endereço não retornado' }
  Write-Host "   ✅ Endereço: $addressId"

  Write-Host '5) Criar pedido'
  $order = Invoke-JsonRequest -Method 'POST' -Url "$base/api/orders" -Headers $auth -Body @{
    addressId = $addressId
    items = @(@{
      productId = $product.id
      quantity = 1
      price = [decimal]$product.price
    })
  }

  if (-not $order.Ok) { throw "Pedido falhou: HTTP $($order.StatusCode) | $($order.Raw)" }
  $orderId = $order.Data.order.id
  if (-not $orderId) { throw 'ID do pedido não retornado' }
  Write-Host "   ✅ Pedido: $orderId"

  Write-Host '6) Criar preferência de pagamento (Mercado Pago)'
  $payment = Invoke-JsonRequest -Method 'POST' -Url "$base/api/payment/create-preference" -Headers $auth -Body @{ orderId = $orderId }

  if (-not $payment.Ok) { throw "Pagamento falhou: HTTP $($payment.StatusCode) | $($payment.Raw)" }
  if (-not $payment.Data.init_point) { throw "Resposta sem init_point: $($payment.Raw)" }

  Write-Host "   OK Preferencia: $($payment.Data.id)"
  Write-Host "   OK Init point: $($payment.Data.init_point)"
  Write-Host ''
  Write-Host 'VALIDACAO PONTA A PONTA CONCLUIDA COM SUCESSO'
}
finally {
  if ($proc -and -not $proc.HasExited) {
    Write-Host 'Encerrando backend de validacao...'
    Stop-Process -Id $proc.Id -Force
  }
}
