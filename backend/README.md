# 💕 LovelyApp - Backend Simplificado

Backend ultra-simplificado do LovelyApp com SQLite e funcionalidades essenciais.

## 🚀 Setup Rápido

### Pré-requisitos
- **Node.js** 18+

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
npm run db:push

# 3. Iniciar servidor
npm run dev
```

O servidor estará disponível em: `http://localhost:3333`

## 🗄️ Banco de Dados

Usa SQLite (arquivo local `dev.db`) - sem necessidade de Docker.

### Comandos Úteis

```bash
# Visualizar dados
npm run db:studio

# Resetar banco
npm run db:reset

# Aplicar mudanças no schema
npm run db:push
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
DATABASE_URL="file:./dev.db"
PORT=3333
JWT_SECRET=Lovely2024SuperSecureJWTKey9876543210
```

## 🔐 API Endpoints

```bash
# Health check
GET /health

# Login
POST /api/auth/login

# Validar token
GET /api/auth/validate

# Perfil do usuário
GET /api/profile
PUT /api/profile
```

## 🛠️ Estrutura Simplificada

```
backend/
├── prisma/
│   └── schema.prisma    # Schema SQLite
├── server.js            # Servidor principal
├── package.json         # Dependências essenciais
└── .env                 # Configurações simples
```

---

**Backend minimalista para desenvolvimento rápido** 💚 