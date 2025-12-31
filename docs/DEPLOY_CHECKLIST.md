# ✅ Checklist de Deploy para Produção

**Última atualização:** 30 de Dezembro de 2025  
**Status:** Em progresso

---

## 📋 Itens Completos

### 1. ✅ Configurar Webhooks Mercado Pago
- [x] Validação de assinatura do webhook
- [x] Tabela `webhook_logs` para auditoria
- [x] Atualização automática de estoque quando pagamento aprovado
- [x] Prevenção de reprocessamento duplicado
- [x] Endpoint admin para visualizar logs (`GET /api/admin/webhooks`)
- [x] Salvamento do `paymentId` e `paymentStatus` no pedido

**SQL para rodar no Supabase (se ainda não rodou):**
```sql
CREATE TABLE IF NOT EXISTS "webhook_logs" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'received',
  "order_id" TEXT,
  "payment_id" TEXT,
  "error" TEXT,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "webhook_logs_source_idx" ON "webhook_logs"("source");
CREATE INDEX IF NOT EXISTS "webhook_logs_event_type_idx" ON "webhook_logs"("event_type");
CREATE INDEX IF NOT EXISTS "webhook_logs_order_id_idx" ON "webhook_logs"("order_id");
CREATE INDEX IF NOT EXISTS "webhook_logs_created_at_idx" ON "webhook_logs"("created_at");
```

---

### 2. ✅ Configurar Sistema de Emails
- [x] Template de boas-vindas (`sendWelcomeEmail`)
- [x] Template de verificação de email (`sendEmailVerification`)
- [x] Template de recuperação de senha (`sendPasswordReset`)
- [x] Template de contato (`sendContactEmail`)
- [x] Endpoint `POST /api/auth/forgot-password`
- [x] Endpoint `POST /api/auth/reset-password`
- [x] Endpoint `POST /api/contact`
- [x] Página `/forgot-password` no frontend
- [x] Página `/reset-password` no frontend
- [x] Formulário de contato integrado com API

---

### 3. ✅ Criar .env.production
- [x] Template backend: `backend/.env.production.example`
- [x] Template frontend: `frontend/.env.production.example`
- [x] Atualizado `.gitignore` para ignorar arquivos de produção

**Ação necessária:** Copiar os templates e preencher com valores reais

---

### 4. ✅ Configurar CORS para Produção
- [x] Suporte a múltiplas origens via `CORS_ORIGINS`
- [x] Validação de origem em produção
- [x] Permissão de localhost em desenvolvimento
- [x] Log de origens bloqueadas

---

### 5. ⏳ Migrations no Banco de Produção
- [x] Tabela `webhook_logs` (SQL acima)
- [x] Campos de dimensões em `products` (peso, altura, largura, comprimento)
- [ ] Verificar se todas as tabelas existem no Supabase
- [ ] Rodar `npx prisma db pull` para sincronizar schema

**SQL para adicionar campos de dimensões (Melhor Envio):**
```sql
-- Adicionar campos de peso e dimensões aos produtos
-- Para cálculo preciso de frete

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS height DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS width DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS length DECIMAL(10,2);

-- Comentários
COMMENT ON COLUMN products.weight IS 'Peso em kg';
COMMENT ON COLUMN products.height IS 'Altura em cm';
COMMENT ON COLUMN products.width IS 'Largura em cm';
COMMENT ON COLUMN products.length IS 'Comprimento em cm';
```

**Como verificar:**
1. Acesse Supabase Dashboard
2. Vá em Table Editor
3. Confirme que existem as tabelas: users, products, categories, orders, order_items, addresses, carts, cart_items, reviews, wishlist, refresh_tokens, webhook_logs

---

### 6. ⏳ Testar Fluxo Completo de Checkout
- [ ] Adicionar produto ao carrinho
- [ ] Ir para checkout
- [ ] Preencher endereço (testar ViaCEP)
- [ ] Calcular frete (testar Melhor Envio)
- [ ] Finalizar com Mercado Pago (cartão de teste)
- [ ] Verificar se pedido foi criado
- [ ] Verificar se email foi enviado (se SMTP configurado)

**Cartões de teste Mercado Pago:**
- Aprovado: 5031 4332 1540 6351 (CVV: 123, Validade: qualquer futura)
- Recusado: 5031 4332 1540 6351 (CVV: 456)

---

### 7. ⏳ Configurar Domínio e SSL
- [ ] Escolher plataforma de deploy (Railway recomendado)
- [ ] Criar conta na plataforma
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Adicionar domínio customizado
- [ ] Configurar SSL (automático na maioria das plataformas)
- [ ] Atualizar `FRONTEND_URL` e `API_URL` no .env

**Plataformas recomendadas:**
1. **Railway** - Tudo em um, fácil, $5-20/mês
2. **Vercel + Railway** - Frontend Vercel (grátis) + Backend Railway
3. **Render** - Alternativa com plano grátis

---

### 8. ✅ Adicionar Monitoramento Sentry
- [x] Integração Sentry no backend (opcional, ativa se SENTRY_DSN configurado)
- [x] Error handler global no backend
- [x] Componente `ErrorBoundary` no frontend
- [x] Página de erro (`error.tsx`)
- [x] Página 404 (`not-found.tsx`)
- [x] Função `captureError` helper no backend

**Ação necessária:** 
1. Criar conta em [sentry.io](https://sentry.io)
2. Criar projeto Node.js (backend) e Next.js (frontend)
3. Copiar DSN para os arquivos .env

---

### 9. ✅ Configurar Backup Automático DB
- [x] Guia completo criado: `docs/BACKUP_GUIDE.md`
- Opção 1: Backups Supabase (plano Pro $25/mês)
- Opção 2: Script manual pg_dump
- Opção 3: GitHub Actions automático
- Opção 4: Upload para S3

**Recomendação:** Para produção real, considere Supabase Pro

---

### 10. ⏳ Testar Responsividade Mobile
- [ ] Testar em iPhone (Safari)
- [ ] Testar em Android (Chrome)
- [ ] Testar em Tablet
- [ ] Verificar navegação mobile (bottom navigation)
- [ ] Verificar formulários em telas pequenas
- [ ] Verificar imagens e carrossel

**Como testar:**
1. Chrome DevTools > Toggle device toolbar (Ctrl+Shift+M)
2. Testar em: iPhone 12 Pro, Samsung Galaxy S20, iPad

---

## 🚀 Resumo Rápido

| # | Item | Status |
|---|------|--------|
| 1 | Webhooks Mercado Pago | ✅ |
| 2 | Sistema de Emails | ✅ |
| 3 | .env.production | ✅ |
| 4 | CORS Produção | ✅ |
| 5 | Migrations Produção | ⏳ |
| 6 | Testar Checkout | ⏳ |
| 7 | Domínio e SSL | ⏳ |
| 8 | Monitoramento Sentry | ✅ |
| 9 | Backup DB | ✅ |
| 10 | Responsividade | ⏳ |
| 11 | Notificação Admin | ⏳ |
| 12 | Retirada no Local | ⏳ |

**Progresso:** 6/12 completos (50%)

---

### 11. ⏳ Configurar Notificação de Novos Pedidos para Admin
- [x] Função `sendNewOrderNotification` criada
- [x] Integração no fluxo de criação de pedido
- [ ] Configurar `ADMIN_EMAIL` no .env

**O que faz:** Quando um cliente finaliza um pedido, o admin recebe um email com:
- Valor total do pedido
- Dados do cliente (nome, email, telefone)
- Lista de produtos comprados
- Endereço de entrega
- Link direto para o painel admin

**Configuração necessária no .env do backend:**
```env
ADMIN_EMAIL=seu-email@exemplo.com
```

---

### 12. ⏳ Implementar Opção de Retirada no Local
- [ ] Adicionar opção "Retirar no local" no checkout
- [ ] Frete = R$ 0,00 quando retirada selecionada
- [ ] Mostrar endereço da loja para o cliente
- [ ] Adicionar status "ready_for_pickup" e "picked_up"
- [ ] Email informando que pedido está pronto para retirada
- [ ] Configurar endereço da loja no .env

**Configuração necessária no .env do backend:**
```env
STORE_ADDRESS="Rua Exemplo, 123 - Centro, Cidade/UF"
STORE_HOURS="Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h"
```

**Status:** Aguardando informações do endereço da loja

---

## 📞 Como Continuar

Quando quiser continuar, me diga:
> "Vamos continuar o checklist de deploy"

E eu vou carregar este arquivo e continuar de onde paramos!
