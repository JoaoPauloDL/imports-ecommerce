# E-commerce de Produtos Importados - Entrega Técnica

## 1. Resumo Executivo e MVP

### Stack Tecnológica
- **Backend:** Node.js + Express + TypeScript
- **Frontend:** Next.js (React) + TypeScript  
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Armazenamento:** AWS S3 (compatible) ou Cloudinary
- **Pagamentos:** Mercado Pago (cartões, boleto, PIX)
- **Frete:** Melhor Envio / Correios
- **Email:** Nodemailer + SendGrid
- **Deploy:** Frontend (Vercel) + Backend (Railway/Render) + DB (Supabase)

### MVP - Funcionalidades Obrigatórias
- ✅ Autenticação JWT com refresh tokens
- ✅ Cadastro de usuários e endereços
- ✅ Catálogo de produtos com variantes (SKUs)
- ✅ Carrinho de compras
- ✅ Checkout com Mercado Pago
- ✅ Gestão de pedidos
- ✅ Cálculo de frete por CEP
- ✅ Painel administrativo básico
- ✅ Sistema de estoque

### Funcionalidades Extras (Pós-MVP)
- 🔄 Sistema de cupons
- 🔄 Reviews e avaliações
- 🔄 Wishlist
- 🔄 Sistema de afiliados
- 🔄 Multi-idioma
- 🔄 Cache com Redis
- 🔄 Busca avançada (Elasticsearch)
- 🔄 Notificações push
- 🔄 Dashboard de métricas

## 2. Modelagem de Dados

### Diagrama ER (Mermaid)

```mermaid
erDiagram
    users ||--o{ addresses : has
    users ||--o{ orders : places
    users ||--o{ cart_items : owns
    users ||--o{ refresh_tokens : has
    users ||--o{ audit_logs : triggers
    
    categories ||--o{ products : contains
    products ||--o{ product_variants : has
    products ||--o{ images : has
    product_variants ||--o{ stocks : tracked
    product_variants ||--o{ order_items : sold
    product_variants ||--o{ cart_items : added
    
    orders ||--o{ order_items : contains
    orders ||--|| addresses : shipped_to
    orders ||--|| payments : paid_by
    orders ||--o{ shipments : shipped_by
    orders ||--o{ coupons : uses
    
    payments ||--o{ webhooks_logs : generates
    
    users {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string phone
        enum role
        boolean email_verified
        timestamp created_at
        timestamp updated_at
    }
    
    addresses {
        uuid id PK
        uuid user_id FK
        string name
        string street
        string number
        string complement
        string neighborhood
        string city
        string state
        string zipcode
        boolean is_default
        timestamp created_at
        timestamp updated_at
    }
    
    categories {
        uuid id PK
        string name UK
        string slug UK
        text description
        string image_url
        uuid parent_id FK
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    products {
        uuid id PK
        uuid category_id FK
        string name
        string slug UK
        text description
        text short_description
        decimal weight_kg
        json dimensions_cm
        json meta_tags
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    product_variants {
        uuid id PK
        uuid product_id FK
        string sku UK
        string name
        json attributes
        decimal price_brl
        decimal cost_brl
        decimal compare_at_price
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    stocks {
        uuid id PK
        uuid variant_id FK
        integer quantity
        integer reserved_quantity
        timestamp updated_at
    }
    
    images {
        uuid id PK
        uuid product_id FK
        string url
        string alt_text
        integer sort_order
        timestamp created_at
    }
    
    cart_items {
        uuid id PK
        uuid user_id FK
        uuid variant_id FK
        integer quantity
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        uuid id PK
        string order_number UK
        uuid user_id FK
        uuid shipping_address_id FK
        enum status
        decimal subtotal_brl
        decimal shipping_brl
        decimal discount_brl
        decimal total_brl
        json metadata
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid variant_id FK
        integer quantity
        decimal unit_price_brl
        decimal total_price_brl
        timestamp created_at
    }
    
    payments {
        uuid id PK
        uuid order_id FK
        string external_id UK
        enum method
        enum status
        decimal amount_brl
        json gateway_response
        timestamp created_at
        timestamp updated_at
    }
    
    shipments {
        uuid id PK
        uuid order_id FK
        string tracking_code
        enum carrier
        enum status
        decimal cost_brl
        json metadata
        timestamp created_at
        timestamp updated_at
    }
    
    coupons {
        uuid id PK
        string code UK
        enum type
        decimal value
        decimal min_order_value
        integer usage_limit
        integer used_count
        timestamp valid_from
        timestamp valid_until
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    refresh_tokens {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        timestamp expires_at
        timestamp created_at
    }
    
    webhooks_logs {
        uuid id PK
        uuid payment_id FK
        enum source
        string event_type
        json payload
        enum status
        text error_message
        timestamp created_at
    }
    
    audit_logs {
        uuid id PK
        uuid user_id FK
        string table_name
        string action
        uuid record_id
        json old_values
        json new_values
        timestamp created_at
    }
```

## 3. Estrutura de Pastas

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/          # Controllers da API
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── products.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── payments.controller.ts
│   │   ├── admin.controller.ts
│   │   └── webhooks.controller.ts
│   ├── services/             # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── products.service.ts
│   │   ├── cart.service.ts
│   │   ├── orders.service.ts
│   │   ├── payments.service.ts
│   │   ├── shipping.service.ts
│   │   └── email.service.ts
│   ├── middlewares/          # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts
│   ├── routes/               # Definição de rotas
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── products.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── admin.routes.ts
│   │   └── webhooks.routes.ts
│   ├── models/               # Modelos Prisma
│   │   ├── index.ts
│   │   └── types.ts
│   ├── utils/                # Utilitários
│   │   ├── logger.ts
│   │   ├── validator.ts
│   │   ├── crypto.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── config/               # Configurações
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   ├── aws.ts
│   │   └── mercadopago.ts
│   ├── integrations/         # Integrações externas
│   │   ├── mercadopago.integration.ts
│   │   ├── melhorenvio.integration.ts
│   │   ├── correios.integration.ts
│   │   └── sendgrid.integration.ts
│   └── app.ts               # Aplicação Express
├── prisma/                   # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/                    # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                     # Documentação
├── .env.example
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

### Frontend (Next.js + React)
```
frontend/
├── src/
│   ├── app/                  # App Router (Next.js 13+)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/
│   │   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes de UI
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── products/        # Componentes de produtos
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductDetail.tsx
│   │   └── forms/           # Formulários
│   │       ├── LoginForm.tsx
│   │       ├── CheckoutForm.tsx
│   │       └── AddressForm.tsx
│   ├── lib/                  # Utilitários e configurações
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── store/                # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── productsStore.ts
│   ├── types/                # Tipos TypeScript
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── products.ts
│   └── styles/               # Estilos
│       ├── globals.css
│       └── components.css
├── public/                   # Arquivos estáticos
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 4. API - Endpoints

### Autenticação
```
POST   /api/auth/register     # Registrar usuário
POST   /api/auth/login        # Login
POST   /api/auth/refresh      # Refresh token
POST   /api/auth/logout       # Logout
POST   /api/auth/forgot       # Esqueci senha
POST   /api/auth/reset        # Reset senha
GET    /api/auth/verify/:token # Verificar email
```

### Usuários
```
GET    /api/users/profile     # Perfil do usuário [AUTH]
PUT    /api/users/profile     # Atualizar perfil [AUTH]
GET    /api/users/addresses   # Listar endereços [AUTH]
POST   /api/users/addresses   # Criar endereço [AUTH]
PUT    /api/users/addresses/:id # Atualizar endereço [AUTH]
DELETE /api/users/addresses/:id # Deletar endereço [AUTH]
```

### Produtos
```
GET    /api/products          # Listar produtos [PUBLIC]
GET    /api/products/:slug    # Produto por slug [PUBLIC]
GET    /api/products/:id/variants # Variantes do produto [PUBLIC]
GET    /api/categories        # Listar categorias [PUBLIC]
GET    /api/categories/:slug  # Categoria por slug [PUBLIC]
```

### Carrinho
```
GET    /api/cart              # Ver carrinho [AUTH]
POST   /api/cart/add          # Adicionar item [AUTH]
PUT    /api/cart/update       # Atualizar quantidade [AUTH]
DELETE /api/cart/remove       # Remover item [AUTH]
DELETE /api/cart/clear        # Limpar carrinho [AUTH]
```

### Checkout e Pedidos
```
POST   /api/orders/calculate  # Calcular frete [AUTH]
POST   /api/orders/create     # Criar pedido [AUTH]
GET    /api/orders            # Listar pedidos [AUTH]
GET    /api/orders/:id        # Ver pedido [AUTH]
PUT    /api/orders/:id/cancel # Cancelar pedido [AUTH]
```

### Pagamentos
```
POST   /api/payments/preference # Criar preferência MP [AUTH]
GET    /api/payments/:id/status # Status pagamento [AUTH]
```

### Admin
```
GET    /api/admin/dashboard   # Dashboard [ADMIN]
GET    /api/admin/products    # Listar produtos [ADMIN]
POST   /api/admin/products    # Criar produto [ADMIN]
PUT    /api/admin/products/:id # Atualizar produto [ADMIN]
DELETE /api/admin/products/:id # Deletar produto [ADMIN]
GET    /api/admin/orders      # Listar pedidos [ADMIN]
PUT    /api/admin/orders/:id  # Atualizar pedido [ADMIN]
GET    /api/admin/users       # Listar usuários [ADMIN]
```

### Webhooks
```
POST   /api/webhooks/mercadopago # Webhook MP [PUBLIC]
POST   /api/webhooks/melhorenvio # Webhook ME [PUBLIC]
```

## 5. Dependências

### Backend package.json
Será criado na próxima etapa com todas as dependências necessárias.

### Frontend package.json
Será criado na próxima etapa com todas as dependências necessárias.

## 6. Roadmap em Sprints

### Sprint 0: Setup e Configuração
**Entregáveis:**
- Configuração do ambiente de desenvolvimento
- Setup do projeto backend com Express + TypeScript
- Setup do projeto frontend com Next.js + TypeScript
- Configuração do banco PostgreSQL com Prisma
- Docker Compose para desenvolvimento local
- CI/CD pipeline básico

**Critérios de Aceitação:**
- Projeto rodando localmente com Docker
- Pipeline CI/CD funcionando
- Banco de dados configurado e acessível
- Linting e formatação configurados

### Sprint 1: Autenticação e Produtos MVP
**Entregáveis:**
- Sistema de autenticação JWT com refresh tokens
- CRUD de usuários e endereços
- CRUD de produtos e variantes
- Sistema de categorias
- Upload e gerenciamento de imagens

**Critérios de Aceitação:**
- Usuário pode se registrar e fazer login
- Usuário pode gerenciar perfil e endereços
- Admin pode cadastrar produtos com variantes
- Produtos são exibidos no frontend
- Imagens são uploadadas e servidas corretamente

### Sprint 2: Carrinho e Checkout
**Entregáveis:**
- Sistema de carrinho de compras
- Cálculo de frete por CEP
- Integração com Mercado Pago
- Processo de checkout completo
- Gestão de estoque

**Critérios de Aceitação:**
- Usuário pode adicionar/remover itens do carrinho
- Frete é calculado automaticamente
- Pagamento é processado via Mercado Pago
- Pedido é criado após pagamento aprovado
- Estoque é atualizado automaticamente

### Sprint 3: Painel Administrativo
**Entregáveis:**
- Dashboard administrativo
- Gestão de produtos e categorias
- Gestão de pedidos e usuários
- Relatórios básicos
- Sistema de permissões

**Critérios de Aceitação:**
- Admin pode visualizar métricas no dashboard
- Admin pode gerenciar produtos e pedidos
- Relatórios são gerados corretamente
- Permissões são validadas em todas as rotas

### Sprint 4: Integrações e Webhooks
**Entregáveis:**
- Webhooks do Mercado Pago
- Sistema de email transacional
- Rastreamento de pedidos
- Sistema de cupons
- Logs de auditoria

**Critérios de Aceitação:**
- Webhooks são processados corretamente
- Emails são enviados para eventos importantes
- Usuário pode rastrear pedidos
- Cupons funcionam corretamente no checkout
- Todas as ações são logadas para auditoria

### Sprint 5: Testes e Deploy
**Entregáveis:**
- Testes unitários e de integração
- Testes E2E
- Deploy em produção
- Monitoramento e logs
- Documentação da API

**Critérios de Aceitação:**
- Cobertura de testes > 80%
- Aplicação deployada e funcionando em produção
- Monitoramento configurado
- Documentação completa da API
- Performance dentro dos padrões aceitáveis

## 7. Exemplos de Código

Os exemplos de código detalhados serão criados nos próximos arquivos...

## 8. Configurações de Ambiente

Ver arquivo `.env.example` que será criado a seguir.

## 9. CI/CD & Deploy

Ver arquivos `docker-compose.yml`, `Dockerfile` e `.github/workflows/ci.yml`.

## 10. Testes e QA

### Estratégia de Testes
- **Testes Unitários:** Jest + Supertest (backend) / Jest + RTL (frontend)
- **Testes de Integração:** Supertest com banco de teste
- **Testes E2E:** Playwright ou Cypress
- **Cobertura:** > 80% para funções críticas

### Ferramentas
- Jest para testes unitários
- Supertest para testes de API
- React Testing Library para componentes
- Playwright para E2E
- Coverage com NYC/Istanbul

## 11. Segurança e Performance

### Checklist de Segurança
- ✅ Input validation com express-validator
- ✅ Rate limiting com express-rate-limit
- ✅ Helmet para headers de segurança
- ✅ CORS configurado adequadamente
- ✅ Prevenção SQL injection (Prisma ORM)
- ✅ Sanitização XSS
- ✅ Proteção CSRF
- ✅ Rotação de secrets
- ✅ Backup automático do banco
- ✅ Logs estruturados
- ✅ Monitoramento com Sentry

### Performance
- Cache Redis para sessões e dados frequentes
- CDN para imagens e assets estáticos
- Compressão gzip/brotli
- Otimização de queries SQL
- Lazy loading de componentes
- Image optimization no Next.js

## 12. Operações

### Backup
- Backup diário automático do PostgreSQL
- Retenção de 30 dias
- Backup de imagens no S3

### Migrations
- Migrations versionadas com Prisma
- Rollback strategy
- Ambiente de staging para testes

### Monitoramento
- Logs estruturados com Pino
- Métricas de performance
- Alertas para erros críticos
- Uptime monitoring

## 13. Extras Opcionais

### Cache (Redis)
- Cache de sessões
- Cache de produtos populares
- Cache de cálculos de frete

### Search (Elasticsearch/Algolia)
- Busca full-text em produtos
- Filtros avançados
- Autocomplete

### Multi-currency
- Suporte a múltiplas moedas
- Conversão automática
- Preços regionalizados

### Split Payments
- Pagamentos divididos entre vendedores
- Marketplace multi-vendor
- Comissões automáticas

---

**Próximos arquivos:** Agora vou criar todos os arquivos de código, configurações e exemplos detalhados.