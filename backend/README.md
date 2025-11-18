# 🚀 Backend - ImportsStore

Backend do e-commerce desenvolvido com **Node.js**, **Express** e **Prisma ORM**.

---

## 📁 Estrutura

```
backend/
├── app.js                      ⭐ Servidor principal (MVC)
├── prisma/
│   └── schema.prisma           🗄️ Schema do banco de dados
├── check-admin.js              🔍 Verificar usuários admin
├── reset-admin-password.js     🔑 Resetar senha de admin
├── seed-database.js            🌱 Popular banco com dados
└── test-endpoints.ps1          🧪 Testes de API
```

---

## 🚀 Como Rodar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/importsstore"
JWT_SECRET="seu-secret-super-seguro"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro"
FRONTEND_URL="http://localhost:3000"
```

### 3. Configurar Banco de Dados
```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# (Opcional) Popular com dados de teste
npm run seed
```

### 4. Iniciar Servidor
```bash
npm run dev
```

Servidor rodando em: **http://localhost:5000**

---

## 📡 Endpoints Principais

### Públicos
- `GET /health` - Health check
- `GET /api/products` - Lista produtos
- `GET /api/categories` - Lista categorias
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login

### Protegidos (JWT)
- `GET /api/orders` - Pedidos do usuário
- `GET /api/profile` - Perfil

### Admin (JWT + role ADMIN)
- `GET /api/admin/dashboard` - Dashboard
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Atualizar produto

---

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev                  # Iniciar servidor

# Prisma
npm run prisma:generate      # Gerar Prisma Client
npm run prisma:migrate       # Criar migration
npm run prisma:studio        # Interface visual do banco

# Banco de dados
npm run seed                 # Popular com dados de teste

# Utilitários
node check-admin.js          # Verificar admins
node reset-admin-password.js # Resetar senha admin
```

---

## 🗄️ Banco de Dados

### Schema Principal

- **User** - Usuários do sistema
- **Product** - Produtos
- **Category** - Categorias
- **ProductCategory** - Relação N-N (produtos ↔ categorias)
- **Order** - Pedidos
- **OrderItem** - Itens do pedido
- **RefreshToken** - Tokens de refresh JWT

Ver detalhes em: `prisma/schema.prisma`

---

## 🔐 Autenticação

- **JWT** com access tokens (15 min) e refresh tokens (7 dias)
- **Bcrypt** para hash de senhas
- **Role-based access control** (USER/ADMIN)

---

## 📚 Documentação Completa

Veja a documentação completa na raiz do projeto:
- `SISTEMA_COMPLETO.md`
- `GUIA_DEPLOY.md`

---

**Made with ❤️ and Node.js**
