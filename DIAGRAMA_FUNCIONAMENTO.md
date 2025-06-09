# 🎯 DIAGRAMA DE FUNCIONAMENTO - LOVELYAPP

## 📋 VISÃO GERAL DO SISTEMA

O **LovelyApp** é um sistema completo de jogos íntimos para casais, composto por 3 aplicações principais:

1. **Site de Vendas** (Front) - Porta 3000
2. **App de Jogos** (LovelyApp) - Porta 3001  
3. **Backend API** - Porta 3333

---

## 🏗️ ARQUITETURA DO SISTEMA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SITE VENDAS   │    │   APP JOGOS     │    │   BACKEND API   │
│   (Front)       │    │   (LovelyApp)   │    │   (Express)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3333    │
│                 │    │                 │    │                 │
│ • Next.js 15    │    │ • Next.js 14    │    │ • Express.js    │
│ • TypeScript    │    │ • TypeScript    │    │ • Prisma ORM    │
│ • Tailwind CSS  │    │ • Tailwind CSS  │    │ • SQLite DB     │
│ • Auth System   │    │ • Game System   │    │ • JWT Auth      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PERFECT PAY   │
                    │   (Webhook)     │
                    │                 │
                    │ • Pagamentos    │
                    │ • Assinaturas   │
                    │ • Notificações  │
                    └─────────────────┘
```

---

## 🔄 FLUXO COMPLETO DO USUÁRIO

### 1️⃣ **DESCOBERTA E COMPRA**
```
Usuário → Site de Vendas (Port 3000)
    ↓
Visualiza Planos:
• 🩷 Básico: R$ 47,90 (3 jogos, níveis Leve/Médio)
• 💜 Médio: R$ 57,90 (10 jogos, todos os níveis) ⭐ Mais vendido
• 💖 Premium: R$ 77,90 (Completo + Massagem Tântrica)
    ↓
Clica em "Comprar" → Perfect Pay
    ↓
Realiza Pagamento
    ↓
Perfect Pay → Webhook Backend (/api/webhook/perfect-pay)
```

### 2️⃣ **PROCESSAMENTO DO PAGAMENTO**
```
Webhook Perfect Pay → Backend
    ↓
Processa Dados:
• Verifica status da venda (approved = 2)
• Identifica plano pelo código:
  - PPU38CPQ6NQ → Básico
  - PPU38CPQ73K → Médio  
  - PPU38CPQ742 → Premium
    ↓
Cria/Atualiza Usuário:
• Email do cliente
• Nome completo
• Senha aleatória (se novo usuário)
• Perfil básico com nível de ousadia
• Assinatura ativa
    ↓
Log de Webhook processado
```

### 3️⃣ **ACESSO AO APP**
```
Usuário → App de Jogos (Port 3001)
    ↓
Tela de Login (/login)
• Email: fornecido no pagamento
• Senha: gerada automaticamente
    ↓
Backend valida credenciais
    ↓
Retorna JWT Token + Dados do usuário
    ↓
Redirecionamento para Dashboard
```

### 4️⃣ **EXPERIÊNCIA NO APP**
```
Dashboard Principal
    ↓
Exibe:
• Perfil do usuário
• Plano ativo
• Nível de ousadia
• Jogos disponíveis baseados no plano
    ↓
Usuário seleciona jogo
    ↓
Sistema carrega jogo baseado em:
• Plano do usuário
• Nível de ousadia
• Preferências do perfil
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

```sql
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    USERS    │    │  PROFILES   │    │SUBSCRIPTIONS│
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (UUID)   │◄──►│ userId      │    │ userId      │
│ email       │    │ partnerName │    │ planCode    │
│ name        │    │ moodToday   │    │ planType    │
│ password    │    │ darinessLvl │    │ saleCode    │
│ createdAt   │    │ createdAt   │    │ status      │
│ updatedAt   │    │ updatedAt   │    │ amount      │
└─────────────┘    └─────────────┘    │ startDate   │
                                      │ expiresAt   │
                                      └─────────────┘
                                              │
                                      ┌─────────────┐
                                      │WEBHOOK_LOGS │
                                      ├─────────────┤
                                      │ id          │
                                      │ token       │
                                      │ saleCode    │
                                      │ status      │
                                      │ event       │
                                      │ payload     │
                                      │ processed   │
                                      │ error       │
                                      │ createdAt   │
                                      └─────────────┘
```

---

## 🎮 SISTEMA DE JOGOS

### **Jogos Disponíveis por Plano:**

| Jogo | Básico | Médio | Premium |
|------|--------|-------|---------|
| Desafios Picantes | ✅ | ✅ | ✅ |
| Sex Roleta | ✅ | ✅ | ✅ |
| Verdade ou Desafio | ✅ | ✅ | ✅ |
| RolePlay | ❌ | ✅ | ✅ |
| Kama 365 | ❌ | ✅ | ✅ |
| Jogar Sozinho | ❌ | ✅ | ✅ |
| Nível de Safadeza | ❌ | ✅ | ✅ |
| Strip Quiz | ❌ | ✅ | ✅ |
| Roleta do Desejo | ❌ | ✅ | ✅ |
| Mímica Proibida | ❌ | ✅ | ✅ |
| **Massagem Tântrica** | ❌ | ❌ | ✅ |
| **Conexão Emocional** | ❌ | ❌ | ✅ |
| **Sistema Conquistas** | ❌ | ❌ | ✅ |

### **Níveis de Intensidade:**
- **Básico:** Leve (1-3) + Médio (4-6)
- **Médio:** Leve (1-3) + Médio (4-6) + Extremo (7-10)
- **Premium:** Todos os níveis + Recursos exclusivos

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Fluxo de Login:**
```
1. Usuário insere email/senha
2. Frontend → POST /api/auth/login
3. Backend valida credenciais
4. Retorna JWT + dados do usuário
5. Frontend armazena token no localStorage
6. Todas as requisições incluem: Authorization: Bearer <token>
```

### **Middleware de Autenticação:**
```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token necessário' });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
};
```

---

## 🌐 ROTAS DA API

### **Públicas:**
- `GET /health` - Status da API
- `POST /api/auth/login` - Login do usuário
- `POST /api/webhook/perfect-pay` - Webhook Perfect Pay

### **Protegidas (requer JWT):**
- `GET /api/auth/validate` - Validar token
- `GET /api/profile` - Dados do perfil
- `PUT /api/profile` - Atualizar perfil
- `GET /api/subscription` - Dados da assinatura

---

## 📡 DIAGRAMA DE COMUNICAÇÕES

### **🔄 Fluxo de Comunicação Completo:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   NAVEGADOR     │     │   PERFECT PAY   │     │   BACKEND API   │
│   (Cliente)     │     │   (Pagamento)   │     │   (Servidor)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │ 1. Acessa Site        │                       │
         ├──────────────────────►│                       │
         │                       │                       │
         │ 2. Visualiza Planos   │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │ 3. Clica "Comprar"    │                       │
         ├──────────────────────►│                       │
         │                       │                       │
         │ 4. Processa Pagamento │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │                       │ 5. Webhook Pagamento  │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ 6. Resposta Webhook   │
         │                       │◄──────────────────────┤
         │                       │                       │
         │ 7. Acessa LovelyApp   │                       │
         ├───────────────────────┼──────────────────────►│
         │                       │                       │
         │ 8. Tela de Login      │                       │
         │◄──────────────────────┼───────────────────────┤
         │                       │                       │
         │ 9. POST /api/auth/login                       │
         ├───────────────────────┼──────────────────────►│
         │                       │                       │
         │ 10. JWT + Dados User  │                       │
         │◄──────────────────────┼───────────────────────┤
         │                       │                       │
         │ 11. GET /api/profile  │                       │
         ├───────────────────────┼──────────────────────►│
         │                       │                       │
         │ 12. Dados do Perfil   │                       │
         │◄──────────────────────┼───────────────────────┤
         │                       │                       │
```

### **🌐 Comunicação Entre Aplicações:**

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│   SITE VENDAS   │◄─────────────────►│   PERFECT PAY   │
│   Port: 3000    │   Redirect URLs   │   (External)    │
└─────────────────┘                   └─────────────────┘
         │                                     │
         │ Link para LovelyApp                 │ Webhook
         │ (após compra)                       │ Notification
         ▼                                     ▼
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│   APP JOGOS     │◄─────────────────►│   BACKEND API   │
│   Port: 3001    │   REST API        │   Port: 3333    │
│                 │   JWT Auth        │                 │
│ • AuthContext   │   JSON Requests   │ • Express.js    │
│ • Components    │                   │ • Prisma ORM    │
│ • Services      │                   │ • SQLite DB     │
└─────────────────┘                   └─────────────────┘
```

### **🔐 Fluxo de Autenticação Detalhado:**

```
┌─────────────────┐                   ┌─────────────────┐
│   LOVELYAPP     │                   │   BACKEND API   │
│   (Frontend)    │                   │   (Express)     │
└─────────────────┘                   └─────────────────┘
         │                                     │
         │ 1. POST /api/auth/login             │
         │    { email, password }              │
         ├────────────────────────────────────►│
         │                                     │
         │                                     │ 2. Valida credenciais
         │                                     │    bcrypt.compare()
         │                                     │
         │                                     │ 3. Gera JWT
         │                                     │    jwt.sign()
         │                                     │
         │ 4. Response: JWT + User Data        │
         │    { success, data: { token, user }}│
         │◄────────────────────────────────────┤
         │                                     │
         │ 5. Armazena token                   │
         │    localStorage.setItem()           │
         │                                     │
         │ 6. GET /api/profile                 │
         │    Authorization: Bearer <token>    │
         ├────────────────────────────────────►│
         │                                     │
         │                                     │ 7. Valida JWT
         │                                     │    jwt.verify()
         │                                     │
         │                                     │ 8. Busca dados
         │                                     │    prisma.profile.findUnique()
         │                                     │
         │ 9. Response: Profile Data           │
         │    { success, data: profile }       │
         │◄────────────────────────────────────┤
         │                                     │
```

---

## 🗺️ MAPEAMENTO COMPLETO DAS ROTAS

### **🏠 SITE DE VENDAS (Port 3000)**

#### **Rotas Frontend (Next.js):**
```
📁 /front/src/app/
├── 📄 page.tsx                    → GET /
├── 📄 layout.tsx                  → Layout principal
├── 📄 globals.css                 → Estilos globais
├── 📁 login/
    └── 📄 page.tsx               → GET /login
    └── 📁 auth/
        └── 📄 route.ts           → POST /api/auth/*
```

#### **Componentes Principais:**
```
📁 /front/src/components/
├── 📁 vendas/
│   ├── 📄 PlansSection.tsx       → Seção de planos
│   ├── 📄 HeroSection.tsx        → Seção hero
│   └── 📄 TestimonialsSection.tsx → Depoimentos
├── 📁 auth/
│   ├── 📄 LoginForm.tsx          → Formulário login
│   └── 📄 RegisterForm.tsx       → Formulário registro
└── 📁 common/
    ├── 📄 Header.tsx             → Cabeçalho
    ├── 📄 Footer.tsx             → Rodapé
    └── 📄 PixelManager.tsx       → Tracking pixels
```

### **🎮 APP DE JOGOS (Port 3001)**

#### **Rotas Frontend (Next.js):**
```
📁 /lovelyapp/src/app/
├── 📄 page.tsx                    → GET / (HomePage)
├── 📄 layout.tsx                  → Layout principal
├── 📄 globals.css                 → Estilos globais
├── 📁 login/
│   └── 📄 page.tsx               → GET /login
├── 📁 plans/
│   └── 📄 page.tsx               → GET /plans
└── 📁 [userId]/
    ├── 📄 page.tsx               → GET /[userId] (Dashboard)
    ├── 📁 profile/
    │   └── 📄 page.tsx           → GET /[userId]/profile
    └── 📁 games/
        ├── 📄 page.tsx           → GET /[userId]/games
        ├── 📁 desafios-picantes/
        │   └── 📄 page.tsx       → GET /[userId]/games/desafios-picantes
        ├── 📁 sex-roleta/
        │   └── 📄 page.tsx       → GET /[userId]/games/sex-roleta
        └── 📁 verdade-desafio/
            └── 📄 page.tsx       → GET /[userId]/games/verdade-desafio
```

#### **Componentes Principais:**
```
📁 /lovelyapp/src/components/
├── 📄 LoginForm.tsx              → Formulário de login
├── 📄 UserDashboard.tsx          → Dashboard principal
├── 📁 games/
│   ├── 📄 GameCard.tsx           → Card de jogo
│   ├── 📄 GameSelector.tsx       → Seletor de jogos
│   └── 📄 GameInterface.tsx      → Interface do jogo
└── 📁 profile/
    ├── 📄 ProfileForm.tsx        → Formulário perfil
    └── 📄 ProfileDisplay.tsx     → Exibição perfil
```

#### **Contextos e Serviços:**
```
📁 /lovelyapp/src/
├── 📁 contexts/
│   └── 📄 AuthContext.tsx        → Contexto autenticação
├── 📁 services/
│   └── 📄 api.ts                 → Serviços API
└── 📁 types/
    └── 📄 index.ts               → Definições TypeScript
```

### **🔧 BACKEND API (Port 3333)**

#### **Rotas da API (Express.js):**
```
📁 /backend/
├── 📄 server.js                  → Servidor principal
├── 📁 routes/ (estrutura sugerida)
│   ├── 📄 auth.js               → Rotas autenticação
│   ├── 📄 profile.js            → Rotas perfil
│   ├── 📄 subscription.js       → Rotas assinatura
│   ├── 📄 games.js              → Rotas jogos
│   └── 📄 webhook.js            → Rotas webhook
└── 📁 middleware/
    ├── 📄 auth.js               → Middleware autenticação
    ├── 📄 cors.js               → Middleware CORS
    └── 📄 validation.js         → Middleware validação
```

#### **Endpoints Detalhados:**

##### **🔓 Rotas Públicas:**
```javascript
// Health Check
GET    /health
Response: { status: 'OK', app: 'LovelyApp' }

// Autenticação
POST   /api/auth/login
Body:   { email: string, password: string }
Response: { success: boolean, data: { token: string, user: User } }

// Webhook Perfect Pay
POST   /api/webhook/perfect-pay
Body:   { token, code, sale_status_enum, customer, plan, ... }
Response: { success: boolean, message: string, data?: any }
```

##### **🔒 Rotas Protegidas (JWT):**
```javascript
// Validação de Token
GET    /api/auth/validate
Headers: Authorization: Bearer <token>
Response: { success: boolean, data: { user: User } }

// Perfil do Usuário
GET    /api/profile
Headers: Authorization: Bearer <token>
Response: { success: boolean, data: Profile }

PUT    /api/profile
Headers: Authorization: Bearer <token>
Body:   { partnerName?: string, moodToday?: string, darinessLevel?: number }
Response: { success: boolean, data: Profile }

// Assinatura
GET    /api/subscription
Headers: Authorization: Bearer <token>
Response: { success: boolean, data: Subscription }

// Jogos (futuro)
GET    /api/games
Headers: Authorization: Bearer <token>
Response: { success: boolean, data: Game[] }

GET    /api/games/:gameId/questions
Headers: Authorization: Bearer <token>
Query:  ?level=1-10&category=string
Response: { success: boolean, data: Question[] }
```

### **🔄 Middleware Stack:**

```javascript
// Ordem dos middlewares no Express
app.use(cors({...}))              // 1. CORS
app.use(express.json())           // 2. JSON Parser
app.use('/api/auth', authRoutes)  // 3. Rotas Auth
app.use('/api', auth, apiRoutes)  // 4. Rotas protegidas
app.use(errorHandler)             // 5. Error Handler
```

### **📊 Códigos de Status HTTP:**

```
✅ Sucesso:
200 - OK (GET requests)
201 - Created (POST requests)
204 - No Content (OPTIONS preflight)

⚠️ Erro Cliente:
400 - Bad Request (dados inválidos)
401 - Unauthorized (sem token)
403 - Forbidden (token inválido)
404 - Not Found (recurso não encontrado)

❌ Erro Servidor:
500 - Internal Server Error (erro interno)
502 - Bad Gateway (erro de proxy)
503 - Service Unavailable (serviço indisponível)
```

### **🌐 URLs de Desenvolvimento:**

```
🏠 Site de Vendas:
http://192.168.100.18:3000/
http://192.168.100.18:3000/login
http://192.168.100.18:3000/plans

🎮 App de Jogos:
http://192.168.100.18:3001/
http://192.168.100.18:3001/login
http://192.168.100.18:3001/[userId]
http://192.168.100.18:3001/[userId]/games

🔧 Backend API:
http://192.168.100.18:3333/health
http://192.168.100.18:3333/api/auth/login
http://192.168.100.18:3333/api/profile
http://192.168.100.18:3333/api/subscription
```

---

## 💳 INTEGRAÇÃO PERFECT PAY

### **Códigos dos Planos:**
```javascript
const PLAN_MAPPING = {
  'PPU38CPQ6NQ': { type: 'basico', name: 'Plano Básico' },
  'PPU38CPQ73K': { type: 'medio', name: 'Plano Médio' },
  'PPU38CPQ742': { type: 'premium', name: 'Plano Premium' }
};
```

### **Webhook Payload:**
```json
{
  "token": "webhook_token",
  "code": "sale_code_unique",
  "sale_status_enum": 2,
  "sale_amount": 57.90,
  "customer": {
    "email": "cliente@email.com",
    "full_name": "Nome Cliente"
  },
  "plan": {
    "code": "PPU38CPQ73K"
  },
  "date_approved": "2024-01-15T10:30:00Z"
}
```

---

## 🚀 FLUXO DE DESENVOLVIMENTO

### **Ambiente Local:**
```bash
# Terminal 1 - Backend
cd backend
npm start  # Porta 3333

# Terminal 2 - Site de Vendas
cd front
npm run dev  # Porta 3000

# Terminal 3 - App de Jogos
cd lovelyapp
npm run dev  # Porta 3001
```

### **URLs de Acesso:**
- **Site Vendas:** `http://192.168.100.18:3000`
- **App Jogos:** `http://192.168.100.18:3001`
- **Backend API:** `http://192.168.100.18:3333`

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### **CORS Backend:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://192.168.100.18:3000',
    'http://192.168.100.18:3001'
  ],
  credentials: true
}));
```

### **Variáveis de Ambiente:**
```env
# Backend (.env)
DATABASE_URL="file:./dev.db"
JWT_SECRET="lovelyapp-secret"
PORT=3333

# LovelyApp (.env.local)
NEXT_PUBLIC_API_URL=http://192.168.100.18:3333
NEXT_PUBLIC_APP_NAME=LovelyApp
```

---

## 📊 MONITORAMENTO E LOGS

### **Logs do Sistema:**
- ✅ Webhooks processados com sucesso
- ❌ Erros de processamento
- 🔔 Novos usuários criados
- 🔐 Tentativas de login
- 🎮 Acesso aos jogos

### **Tabela WebhookLog:**
- Armazena todos os webhooks recebidos
- Status de processamento
- Payload completo para debug
- Erros detalhados

---

## 🎯 PRÓXIMOS PASSOS

### **Funcionalidades Pendentes:**
1. **Sistema de Jogos Completo**
   - Implementar lógica de cada jogo
   - Sistema de perguntas/desafios
   - Progressão de níveis

2. **Recursos Premium**
   - Massagem Tântrica guiada
   - Modo Conexão Emocional
   - Sistema de Conquistas

3. **Melhorias UX/UI**
   - Animações nos jogos
   - Feedback visual
   - Modo escuro/claro

4. **Analytics**
   - Tracking de uso
   - Métricas de engajamento
   - Relatórios de conversão

---

## 🔒 SEGURANÇA

### **Medidas Implementadas:**
- ✅ JWT para autenticação
- ✅ Senhas hasheadas (bcrypt)
- ✅ CORS configurado
- ✅ Validação de dados
- ✅ Logs de auditoria

### **Recomendações:**
- 🔐 HTTPS em produção
- 🛡️ Rate limiting
- 🔍 Validação de webhook token
- 📝 Logs de segurança

---

## 📈 MÉTRICAS DE SUCESSO

### **KPIs Principais:**
- **Conversão:** Site → Compra → Uso do App
- **Retenção:** Usuários ativos mensais
- **Engajamento:** Tempo médio por sessão
- **Satisfação:** Feedback dos usuários

---

*Diagrama atualizado em: $(date)*
*Versão: 2.0*
*Status: Sistema Funcional ✅* 