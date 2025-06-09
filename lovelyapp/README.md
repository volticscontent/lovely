# 💕 LovelyApp - Plataforma de Jogos para Casais

Plataforma simplificada de jogos íntimos para casais.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática  
- **Tailwind CSS** - Estilização
- **Backend** - Node.js + Express + SQLite

## 🛠️ Setup Rápido

```bash
# Frontend (porta 3001)
cd lovelyapp
npm install
npm run dev

# Backend (porta 3333)
cd backend
npm install
npm run db:push
npm run dev
```

## 🌐 Acesso

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3333

## 🎮 Funcionalidades

- Dashboard personalizado
- 3 jogos básicos:
  - Verdade ou Desafio
  - Perguntas Íntimas  
  - Desafios Românticos
- Perfil do casal
- Sistema de autenticação

## 📊 Dados do Usuário

### Backend fornece:
```json
{
  "user": {
    "id": "uuid",
    "email": "email@exemplo.com", 
    "name": "Nome do Usuário"
  },
  "profile": {
    "partnerName": "Nome do Parceiro",
    "moodToday": "PLAYFUL",
    "darinessLevel": 5
  }
}
```

### Endpoints:
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token
- `GET /api/profile` - Buscar perfil
- `PUT /api/profile` - Atualizar perfil

---

**Plataforma simplificada para desenvolvimento rápido** 💚
