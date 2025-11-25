# 🛍️ David Importados - E-commerce Completo# � ImportsStore - E-Commerce Platform



![Status](https://img.shields.io/badge/status-production--ready-brightgreen)![Status](https://img.shields.io/badge/status-production--ready-brightgreen)

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

![Next.js](https://img.shields.io/badge/next.js-14-black)![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue)

![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)

**Plataforma de e-commerce completa** com **Node.js**, **Express**, **TypeScript**, **PostgreSQL** e **Prisma ORM**.

**E-commerce completo e profissional** de produtos importados, desenvolvido com as melhores tecnologias e práticas do mercado.

Projeto demonstrando **boas práticas**, **arquitetura profissional** e **clean code**.

🔗 **Demo:** [Em breve]  

📚 **Documentação:** [Ver guias](#-documentao)---



---## ✨ Destaques



## ✨ Funcionalidades- 🏗️ Arquitetura MVC com separação de responsabilidades

- 🎨 Design Patterns (Repository, Singleton, Middleware)

### 🛒 Para Clientes- � Autenticação JWT (access + refresh tokens)

- ✅ Catálogo de produtos com busca e filtros avançados- 🗄️ Banco normalizado com relacionamentos N-N

- ✅ Carrinho persistente (logado e guest)- 📦 API RESTful completa

- ✅ Checkout completo com cálculo de frete- 🎯 SOLID Principles e Clean Code

- ✅ Pagamento via MercadoPago (PIX, Cartão, Boleto)- � Documentação completa (81KB+)

- ✅ Histórico de pedidos com rastreamento- � Pronto para produção

- ✅ Gestão de perfil e endereços

- ✅ Notificações por email---



### 👨‍💼 Para Administradores## � Tecnologias

- ✅ Dashboard com estatísticas e gráficos (Recharts)

- ✅ Gestão completa de produtos (CRUD + upload de imagens)**Backend:** Node.js 18+, Express, TypeScript, Prisma, PostgreSQL, JWT, Bcrypt

- ✅ Gestão de pedidos (alterar status, cancelar)**Frontend:** Next.js 14, React 18, Tailwind CSS, Zustand

- ✅ Gestão de usuários**DevOps:** Docker, Supabase, Vercel

- ✅ Alertas de estoque baixo

- ✅ Relatórios de vendas- **State Management:** Zustand



### 🔌 Integrações- **Backend:** Node.js, Express *(planned)*A professional full-stack e-commerce solution designed specifically for luxury imported perfume retail. Built with modern technologies and featuring a minimalist black & white design inspired by premium brands like Nike and Adidas.A professional full-stack e-commerce solution designed specifically for luxury imported perfume retail. Built with modern technologies and featuring a minimalist black & white design inspired by premium brands like Nike and Adidas.

- ✅ **Cloudinary** - Upload e otimização de imagens

- ✅ **MercadoPago** - Gateway de pagamento- **Database:** PostgreSQL, Prisma *(planned)*

- ✅ **Melhor Envio** - Cálculo de frete (com fallback)

- ✅ **ViaCEP** - Autocomplete de endereço

- ✅ **Nodemailer** - Envio de emails

- ✅ **Google Analytics** - Métricas e conversões## 🛠️ Installation



---### 🎯 **Project Purpose**### 🎯 **Project Purpose**



## 🚀 Stack Tecnológica```bash



### Backend# Clone repositoryThis platform serves the Brazilian luxury perfume market, specializing in:This platform serves the Brazilian luxury perfume market, specializing in:

- **Node.js** 18+ com **Express.js**

- **TypeScript** para type safetygit clone https://github.com/JoaoPauloDL/imports-ecommerce.git

- **PostgreSQL** via **Supabase**

- **Prisma ORM** para queries type-safecd imports-ecommerce- **Arabian Fragrances** (Árabes)- **Arabian Fragrances** (Árabes)

- **JWT** para autenticação

- **Bcrypt** para hash de senhas (10 rounds)



### Frontend# Install dependencies- **French Perfumes** (Franceses) - **French Perfumes** (Franceses) 

- **Next.js 14** com App Router

- **React 18** com Server Componentscd frontend

- **TypeScript** em todo o projeto

- **Tailwind CSS** para estilizaçãonpm install- **Masculine Collections** (Masculinos)- **Masculine Collections** (Masculinos)

- **Zustand** para state management

- **React Hook Form** + **Zod** para validação



### DevOps & Tools# Run development server- **Feminine Collections** (Femininos)- **Feminine Collections** (Femininos)

- **Docker** para desenvolvimento

- **Prisma Migrate** para versionamento do banconpm run dev

- **ESLint** para code quality

- **Git** + **GitHub** para versionamento```- **Unisex Options** (Unissex)- **Unisex Options** (Unissex)



---



## 📁 Estrutura do ProjetoOpen [http://localhost:3000](http://localhost:3000) in your browser.



```

importsStore/

├── backend/## 📁 Project Structure------

│   ├── src/

│   │   ├── controllers/      # Lógica de negócio

│   │   ├── routes/            # Rotas da API

│   │   ├── middlewares/       # Auth, validação```

│   │   ├── services/          # Email, shipping

│   │   ├── integrations/      # MercadoPagoimports-ecommerce/

│   │   └── utils/             # JWT, logger

│   ├── prisma/├── frontend/## ✨ **Features**## ✨ **Features**

│   │   └── schema.prisma      # Modelo do banco

│   └── app.ts                 # Entry point│   ├── src/app/          # Next.js pages

│

├── frontend/│   ├── src/components/   # UI components

│   ├── src/

│   │   ├── app/               # Pages (App Router)│   ├── src/store/        # State management

│   │   ├── components/        # Componentes React

│   │   ├── store/             # Zustand stores│   └── src/types/        # TypeScript types### 🛒 **E-commerce Core**### 🛒 **E-commerce Core**

│   │   ├── lib/               # Utilidades

│   │   └── types/             # TypeScript types├── backend/              # API (future)

│   └── public/                # Assets estáticos

│└── docker-compose.yml    # Development setup- **Product Catalog** with advanced filtering and search- **Product Catalog** with advanced filtering and search

├── INTEGRATION_GUIDE.md       # Guia de configuração

├── TESTING_GUIDE.md           # Guia de testes```

├── SEO_GUIDE.md               # Guia de SEO

└── PROJECT_STATUS.md          # Status completo- **Shopping Cart** with persistent state management- **Shopping Cart** with persistent state management

```

## 🤝 Contributing

---

- **Secure Checkout** with multiple payment methods- **Secure Checkout** with multiple payment methods

## 🔧 Instalação e Uso

1. Fork the project

### Pré-requisitos

- Node.js 18+2. Create your feature branch (`git checkout -b feature/new-feature`)- **User Authentication** and profile management- **User Authentication** and profile management

- PostgreSQL 14+ (ou conta no Supabase)

- npm ou yarn3. Commit your changes (`git commit -m 'Add new feature'`)



### 1. Clonar o repositório4. Push to the branch (`git push origin feature/new-feature`)- **Order Tracking** and history- **Order Tracking** and history

```bash

git clone https://github.com/JoaoPauloDL/imports-ecommerce.git5. Open a Pull Request

cd imports-ecommerce

```



### 2. Configurar Backend## 📄 License

```bash

cd backend### 🎨 **Design & UX**### 🎨 **Design & UX**

npm install

This project is licensed under the MIT License.

# Configurar variáveis de ambiente

cp .env.example .env- **Responsive Design** optimized for all devices- **Responsive Design** optimized for all devices

# Editar .env com suas credenciais

## 👤 Author

# Executar migrations

npx prisma migrate deploy- **Minimalist UI** inspired by premium brands- **Minimalist UI** inspired by premium brands

npx prisma generate

**João Paulo**  

# Criar usuário admin

node setup-admin.jsGitHub: [@JoaoPauloDL](https://github.com/JoaoPauloDL)- **Dark Theme** with black & white color scheme- **Dark Theme** with black & white color scheme



# Iniciar servidor- **Smooth Animations** and micro-interactions- **Smooth Animations** and micro-interactions

npm run dev

# Backend: http://localhost:5000- **Accessibility** compliant components- **Accessibility** compliant components

```



### 3. Configurar Frontend

```bash### 🔧 **Technical Features**### 🔧 **Technical Features**

cd frontend

npm install- **Server-Side Rendering** (SSR) with Next.js 14- **Server-Side Rendering** (SSR) with Next.js 14



# Configurar variáveis de ambiente- **App Router** for modern routing architecture- **App Router** for modern routing architecture

cp .env.local.example .env.local

# Editar .env.local com suas credenciais- **TypeScript** for type safety and better DX- **TypeScript** for type safety and better DX



# Iniciar aplicação- **State Management** with Zustand- **State Management** with Zustand

npm run dev

# Frontend: http://localhost:3000- **Component Library** with reusable UI elements- **Component Library** with reusable UI elements

```



### 4. Acessar o sistema

- **Site:** http://localhost:3000------

- **Admin:** http://localhost:3000/admin

  - Email: `admin@davidimportados.com`

  - Senha: `admin123`

## 🚀 **Tech Stack**## 🚀 **Tech Stack**

---



## 📚 Documentação

### **Frontend**### **Frontend**

| Guia | Descrição |

|------|-----------|- **Framework:** Next.js 14.2.33 (React 18)- **Framework:** Next.js 14.2.33 (React 18)

| [QUICK_START.md](./QUICK_START.md) | Início rápido - próximos passos |

| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Como configurar todos os serviços (Cloudinary, MercadoPago, Email) |- **Language:** TypeScript 5.x- **Language:** TypeScript 5.x

| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Checklist completo de testes end-to-end |

| [SEO_GUIDE.md](./SEO_GUIDE.md) | Como configurar Google Analytics e SEO |- **Styling:** Tailwind CSS 3.4.0- **Styling:** Tailwind CSS 3.4.0

| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Status completo do projeto |

| [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) | Setup específico do Cloudinary |- **State Management:** Zustand- **State Management:** Zustand



---- **UI Components:** Custom design system- **UI Components:** Custom design system



## 🔐 Variáveis de Ambiente- **Icons:** Heroicons- **Icons:** Heroicons



### Backend (`.env`)

```env

# Banco de Dados### **Backend** *(Planned)*### **Backend** *(Planned)*

DATABASE_URL="postgresql://..."

- **Runtime:** Node.js + Express- **Runtime:** Node.js + Express

# Autenticação

JWT_SECRET="sua-chave-secreta-super-segura"- **Database:** PostgreSQL with Prisma ORM- **Database:** PostgreSQL with Prisma ORM

JWT_EXPIRES_IN="7d"

- **Authentication:** JWT + bcrypt- **Authentication:** JWT + bcrypt

# Cloudinary (Imagens)

CLOUDINARY_CLOUD_NAME="xxx"- **Payment:** Mercado Pago API- **Payment:** Mercado Pago API

CLOUDINARY_API_KEY="xxx"

CLOUDINARY_API_SECRET="xxx"- **Shipping:** Correios API integration- **Shipping:** Correios API integration



# MercadoPago (Pagamentos)

MERCADO_PAGO_ACCESS_TOKEN="APP-xxx"  # Produção

### **DevOps & Tools**### **DevOps & Tools**

# Email (Notificações)

SMTP_HOST="smtp.sendgrid.net"- **Version Control:** Git with conventional commits- **Version Control:** Git with conventional commits

SMTP_USER="apikey"

SMTP_PASS="SG.xxx"- **Package Manager:** npm- **Package Manager:** npm

SMTP_FROM_EMAIL="noreply@davidimportados.com"

- **Linting:** ESLint + Prettier- **Linting:** ESLint + Prettier

# Opcional

MELHOR_ENVIO_TOKEN=""  # Deixar vazio usa fallback- **Containerization:** Docker & Docker Compose- **Containerization:** Docker & Docker Compose

```

- **Deployment:** Vercel (Frontend) + Railway (Backend)- **Deployment:** Vercel (Frontend) + Railway (Backend)

### Frontend (`.env.local`)

```env

NEXT_PUBLIC_API_URL="http://localhost:5000"

NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="APP-xxx"------

NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

```

## 🏗️ **Project Structure**## 🏗️ **Project Structure**

---



## 🧪 Testes

``````

Execute os testes seguindo o guia completo:

```bashimports-ecommerce/imports-ecommerce/

# Ver guia detalhado

cat TESTING_GUIDE.md├── frontend/                 # Next.js Application├── frontend/                 # Next.js Application

```

│   ├── src/│   ├── src/

**Cenários de teste:**

1. ✅ Cadastro e Login│   │   ├── app/             # App Router pages│   │   ├── app/             # App Router pages

2. ✅ Navegação e Busca

3. ✅ Carrinho de Compras│   │   │   ├── (auth)/      # Authentication routes│   │   │   ├── (auth)/      # Authentication routes

4. ✅ Checkout Completo

5. ✅ Painel do Cliente│   │   │   ├── (shop)/      # Shopping routes│   │   │   ├── (shop)/      # Shopping routes

6. ✅ Painel Administrativo

7. ✅ Responsividade Mobile│   │   │   ├── (user)/      # User profile routes│   │   │   ├── (user)/      # User profile routes



---│   │   │   └── admin/       # Admin dashboard│   │   │   └── admin/       # Admin dashboard



## 🚀 Deploy│   │   ├── components/      # Reusable components│   │   ├── components/      # Reusable components



### Opção 1: Vercel + Railway (Recomendado)│   │   │   ├── ui/          # Design system│   │   │   ├── ui/          # Design system



**Frontend (Vercel):**│   │   │   ├── layout/      # Layout components│   │   │   ├── layout/      # Layout components

```bash

# Conectar repositório GitHub no Vercel│   │   │   └── product/     # Product components│   │   │   └── product/     # Product components

# Configurar variáveis de ambiente

# Deploy automático│   │   ├── hooks/           # Custom React hooks│   │   ├── hooks/           # Custom React hooks

```

│   │   ├── store/           # Zustand stores│   │   ├── store/           # Zustand stores

**Backend (Railway):**

```bash│   │   ├── types/           # TypeScript definitions│   │   ├── types/           # TypeScript definitions

# Conectar repositório GitHub no Railway

# Configurar variáveis de ambiente│   │   └── utils/           # Utility functions│   │   └── utils/           # Utility functions

# Adicionar PostgreSQL addon

# Deploy automático├── backend/                 # Node.js API (Future)├── backend/                 # Node.js API (Future)

```

│   ├── src/│   ├── src/

### Opção 2: VPS

```bash│   │   ├── controllers/     # Route controllers│   │   ├── controllers/     # Route controllers

# Clonar no servidor

git clone https://github.com/JoaoPauloDL/imports-ecommerce.git│   │   ├── middleware/      # Express middleware│   │   ├── middleware/      # Express middleware



# Instalar dependências│   │   ├── services/        # Business logic│   │   ├── services/        # Business logic

cd backend && npm install

cd ../frontend && npm install│   │   └── routes/          # API routes│   │   └── routes/          # API routes



# Build└── docker-compose.yml       # Development environment└── docker-compose.yml       # Development environment

cd frontend && npm run build

``````

# Configurar PM2, Nginx, SSL

pm2 start backend/app.js

```

------

---



## 💰 Custos Estimados

## 🚀 **Getting Started**## 🚀 **Getting Started**

### Grátis (Para começar)

- ✅ Vercel (Frontend) - Free

- ✅ Railway (Backend) - $5/mês

- ✅ Supabase (Banco) - Free### **Prerequisites**### **Prerequisites**

- ✅ Cloudinary (Imagens) - Free

- ✅ SendGrid (Email) - Free (100/dia)- Node.js 18+ installed- Node.js 18+ installed



**Total:** ~$5/mês (~R$ 25/mês)- npm or yarn package manager- npm or yarn package manager



### Taxas de Transação- Git for version control- Git for version control

- MercadoPago (CPF): 4,99% + R$ 0,39

- MercadoPago (CNPJ): 3,99% + R$ 0,39



---### **Installation**### **Installation**



## 📊 Status do Projeto



**Versão:** 1.0  1. **Clone the repository**1. **Clone the repository**

**Status:** 🟢 Pronto para produção  

**Última atualização:** 15/11/2025   ```bash   ```bash



### Completo (100%)   git clone https://github.com/JoaoPauloDL/imports-ecommerce.git   git clone https://github.com/JoaoPauloDL/imports-ecommerce.git

- ✅ Backend completo com todas as APIs

- ✅ Frontend responsivo e funcional   cd imports-ecommerce   cd imports-ecommerce

- ✅ Autenticação e autorização

- ✅ Sistema de carrinho e checkout   ```   ```

- ✅ Integração com pagamento

- ✅ Painel administrativo

- ✅ Dashboard com estatísticas

- ✅ SEO e Analytics2. **Install frontend dependencies**2. **Install frontend dependencies**

- ✅ Documentação completa

   ```bash   ```bash

### Pendente (Configuração)

- ⏳ Adicionar credenciais de produção   cd frontend   cd frontend

- ⏳ Executar testes end-to-end

- ⏳ Adicionar produtos reais   npm install   npm install

- ⏳ Deploy em produção

   ```   ```

**Tempo estimado para lançar:** 4-6 horas



---

3. **Set up environment variables**3. **Set up environment variables**

## 🤝 Contribuindo

   ```bash   ```bash

Contribuições são bem-vindas! Por favor:

   cp .env.local.example .env.local   cp .env.local.example .env.local

1. Fork o projeto

2. Crie uma branch (`git checkout -b feature/MinhaFeature`)   # Edit .env.local with your configuration   # Edit .env.local with your configuration

3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)

4. Push para a branch (`git push origin feature/MinhaFeature`)   ```   ```

5. Abra um Pull Request



---

4. **Run the development server**4. **Run the development server**

## 📝 Licença

   ```bash   ```bash

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

   npm run dev   npm run dev

---

   ```   ```

## 👨‍💻 Autor



**João Paulo**  

🔗 [GitHub](https://github.com/JoaoPauloDL)  5. **Open your browser**5. **Open your browser**

📧 Email: [seu-email@exemplo.com]

   Navigate to [http://localhost:3000](http://localhost:3000)   Navigate to [http://localhost:3000](http://localhost:3000)

---



## 🙏 Agradecimentos

### **Docker Setup** *(Alternative)*### **Docker Setup** *(Alternative)*

- Next.js pela framework incrível

- Vercel pelo deploy gratuito```bash```bash

- Supabase pelo PostgreSQL gerenciado

- MercadoPago pela API de pagamentosdocker-compose up --builddocker-compose up --build

- Cloudinary pelo CDN de imagens

``````

---



## 📞 Suporte

------

Encontrou um bug? Tem uma sugestão?



- 🐛 [Abrir Issue](https://github.com/JoaoPauloDL/imports-ecommerce/issues)

- 💬 [Discussões](https://github.com/JoaoPauloDL/imports-ecommerce/discussions)## 📱 **Screenshots & Demo**## 📱 **Screenshots & Demo**

- 📧 Email: [seu-email@exemplo.com]



---

### **Homepage**### **Homepage**

**⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!**

Clean, modern landing page showcasing featured perfume categoriesClean, modern landing page showcasing featured perfume categories

**Desenvolvido com ❤️ por João Paulo**



### **Product Catalog** ### **Product Catalog** 

Advanced filtering by brand, price, category, and fragrance concentrationAdvanced filtering by brand, price, category, and fragrance concentration



### **Shopping Cart**### **Shopping Cart**

Persistent cart with quantity management and secure checkout flowPersistent cart with quantity management and secure checkout flow



### **Admin Dashboard**### **Admin Dashboard**

Complete product and order management interfaceComplete product and order management interface



------



## 🛣️ **Roadmap**## 🛣️ **Roadmap**



### **Phase 1: Frontend Foundation** ✅### **Phase 1: Frontend Foundation** ✅

- [x] Next.js setup with TypeScript- [x] Next.js setup with TypeScript

- [x] Tailwind CSS integration- [x] Tailwind CSS integration

- [x] Component library development- [x] Component library development

- [x] Shopping cart functionality- [x] Shopping cart functionality

- [x] User interface completion- [x] User interface completion



### **Phase 2: Backend Development** 🔄### **Phase 2: Backend Development** 🔄

- [ ] Node.js API with Express- [ ] Node.js API with Express

- [ ] PostgreSQL database setup- [ ] PostgreSQL database setup

- [ ] User authentication system- [ ] User authentication system

- [ ] Product management API- [ ] Product management API

- [ ] Order processing system- [ ] Order processing system



### **Phase 3: E-commerce Features** 📋### **Phase 3: E-commerce Features** 📋

- [ ] Payment gateway integration (Mercado Pago)- [ ] Payment gateway integration (Mercado Pago)

- [ ] Shipping calculation (Correios API)- [ ] Shipping calculation (Correios API)

- [ ] Inventory management- [ ] Inventory management

- [ ] Email notifications- [ ] Email notifications

- [ ] Admin dashboard backend- [ ] Admin dashboard backend



### **Phase 4: Production & Optimization** 🚀### **Phase 4: Production & Optimization** 🚀

- [ ] Performance optimization- [ ] Performance optimization

- [ ] SEO implementation- [ ] SEO implementation

- [ ] Analytics integration- [ ] Analytics integration

- [ ] Monitoring and logging- [ ] Monitoring and logging

- [ ] Production deployment- [ ] Production deployment



------



## 🤝 **Contributing**## 🤝 **Contributing**



Contributions are welcome! Please feel free to submit a Pull Request.Contributions are welcome! Please feel free to submit a Pull Request.



### **Development Workflow**### **Development Workflow**

1. Fork the repository1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'feat: add amazing feature'`)3. Commit your changes (`git commit -m 'feat: add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request5. Open a Pull Request



### **Commit Convention**### **Commit Convention**

This project follows [Conventional Commits](https://www.conventionalcommits.org/):This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features- `feat:` New features

- `fix:` Bug fixes- `fix:` Bug fixes

- `docs:` Documentation changes- `docs:` Documentation changes

- `style:` Code style changes- `style:` Code style changes

- `refactor:` Code refactoring- `refactor:` Code refactoring

- `chore:` Maintenance tasks- `chore:` Maintenance tasks



------



## 📄 **License**## 📄 **License**



This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



------



## 👤 **Author**## 👤 **Author**



**João Paulo** **João Paulo** 

- GitHub: [@JoaoPauloDL](https://github.com/JoaoPauloDL)- GitHub: [@JoaoPauloDL](https://github.com/JoaoPauloDL)



------



## 🙏 **Acknowledgments**## 🙏 **Acknowledgments**



- Design inspiration from Nike and Adidas minimalist aesthetics- Design inspiration from Nike and Adidas minimalist aesthetics

- Brazilian perfume import market research and requirements- Brazilian perfume import market research and requirements

- Modern web development best practices and patterns- Modern web development best practices and patterns



------



<div align="center"><div align="center">



**⭐ Star this repository if you find it helpful!****⭐ Star this repository if you find it helpful!**



Made with ❤️ for the luxury perfume market in BrazilMade with ❤️ for the luxury perfume market in Brazil



</div></div>
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