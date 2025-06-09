require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || 'lovelyapp-secret';
const APP_BASE_URL = process.env.APP_URL || process.env.LOVELY_APP_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ✅ DEBUG: Mostrar variáveis de ambiente carregadas
console.log('\n🔧 [DEBUG] Variáveis de ambiente carregadas:');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 APP_URL:', process.env.APP_URL);
console.log('📍 LOVELY_APP_URL:', process.env.LOVELY_APP_URL);
console.log('📍 FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('📍 APP_BASE_URL (final):', APP_BASE_URL);
console.log('📍 FRONTEND_URL (final):', FRONTEND_URL);
console.log('');

// Inicializar Prisma
const prisma = new PrismaClient();

// ========================================
// SISTEMA DE LOGS COLORIDOS
// ========================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.cyan}[${timestamp}] ℹ️  ${message}${colors.reset}`);
    if (data) console.log(`${colors.cyan}   📄 Dados:${colors.reset}`, data);
  },
  success: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.green}[${timestamp}] ✅ ${message}${colors.reset}`);
    if (data) console.log(`${colors.green}   📄 Dados:${colors.reset}`, data);
  },
  warning: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.yellow}[${timestamp}] ⚠️  ${message}${colors.reset}`);
    if (data) console.log(`${colors.yellow}   📄 Dados:${colors.reset}`, data);
  },
  error: (message, error = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.red}[${timestamp}] ❌ ${message}${colors.reset}`);
    if (error) console.log(`${colors.red}   🔥 Erro:${colors.reset}`, error);
  },
  webhook: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.magenta}[${timestamp}] 🔔 WEBHOOK: ${message}${colors.reset}`);
    if (data) console.log(`${colors.magenta}   📄 Dados:${colors.reset}`, data);
  },
  auth: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.blue}[${timestamp}] 🔐 AUTH: ${message}${colors.reset}`);
    if (data) console.log(`${colors.blue}   📄 Dados:${colors.reset}`, data);
  },
  redirect: (message, data = null) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.yellow}[${timestamp}] 🔄 REDIRECT: ${message}${colors.reset}`);
    if (data) console.log(`${colors.yellow}   📄 Dados:${colors.reset}`, data);
  },
  request: (method, url, ip) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`${colors.white}[${timestamp}] 📡 ${method} ${url} - IP: ${ip}${colors.reset}`);
  }
};

// Middleware para logar todas as requisições
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  log.request(req.method, req.url, ip);
  next();
});

// CORS simples
app.use(cors({
  origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.APP_URL || 'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json());

// Mapeamento dos planos Perfect Pay
const PLAN_MAPPING = {
  'PPU38CPQ6NQ': { type: 'basico', name: 'Plano Básico' },
  'PPU38CPQ73K': { type: 'medio', name: 'Plano Médio' },
  'PPU38CPQ742': { type: 'premium', name: 'Plano Premium' }
};

// Função para gerar senha aleatória
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex');
}

// Função para processar webhook do Perfect Pay
async function processWebhook(webhookData) {
  const { 
    token, 
    code: saleCode, 
    sale_status_enum, 
    sale_amount,
    customer,
    plan,
    date_approved 
  } = webhookData;

  log.webhook(`Processando webhook para venda ${saleCode}`, {
    status: sale_status_enum,
    customer: customer.email,
    plan: plan.code,
    amount: sale_amount
  });

  // Log do webhook
  const webhookLog = await prisma.webhookLog.create({
    data: {
      token,
      saleCode,
      status: sale_status_enum.toString(),
      event: 'payment_notification',
      payload: JSON.stringify(webhookData),
      processed: false
    }
  });

  try {
    // Verificar se é uma venda aprovada
    if (sale_status_enum !== 2) { // 2 = approved
      log.warning(`Venda ${saleCode} não aprovada`, { status: sale_status_enum });
      return { success: false, message: 'Venda não aprovada' };
    }

    // Identificar o plano
    const planInfo = PLAN_MAPPING[plan.code];
    if (!planInfo) {
      throw new Error(`Plano não reconhecido: ${plan.code}`);
    }

    log.info(`Plano identificado: ${planInfo.name} (${planInfo.type})`);

    // Verificar se usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: customer.email.toLowerCase() }
    });

    // Criar usuário se não existir
    if (!user) {
      const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
      data: {
          email: customer.email.toLowerCase(),
          name: customer.full_name,
          password: hashedPassword
        }
      });

      // Criar perfil básico
      await prisma.profile.create({
        data: {
        userId: user.id,
          darinessLevel: planInfo.type === 'basico' ? 3 : planInfo.type === 'medio' ? 5 : 7
        }
      });

      log.success(`Novo usuário criado: ${user.email}`, { 
        senha: randomPassword,
        darinessLevel: planInfo.type === 'basico' ? 3 : planInfo.type === 'medio' ? 5 : 7
      });
    } else {
      log.info(`Usuário existente encontrado: ${user.email}`);
    }

    // Criar ou atualizar assinatura
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        planCode: plan.code,
        planType: planInfo.type,
        saleCode,
        status: 'ACTIVE',
        amount: sale_amount,
        startDate: date_approved ? new Date(date_approved) : new Date()
      },
      create: {
        userId: user.id,
        planCode: plan.code,
        planType: planInfo.type,
        saleCode,
        status: 'ACTIVE',
        amount: sale_amount,
        startDate: date_approved ? new Date(date_approved) : new Date()
      }
    });

    log.success(`Assinatura ${user.subscription ? 'atualizada' : 'criada'}`, {
      plano: planInfo.name,
      valor: sale_amount,
      status: 'ACTIVE'
    });

    // Marcar webhook como processado
    await prisma.webhookLog.update({
      where: { id: webhookLog.id },
      data: { processed: true }
    });

    log.webhook(`Webhook processado com sucesso: ${saleCode}`, {
      usuario: user.email,
      plano: planInfo.name
    });
    
    return { 
      success: true, 
      message: 'Webhook processado com sucesso',
      user: { id: user.id, email: user.email, plan: planInfo.type }
    };

  } catch (error) {
    log.error('Erro ao processar webhook', error);
    
    // Salvar erro no log
    await prisma.webhookLog.update({
      where: { id: webhookLog.id },
      data: {
        processed: false,
        error: error.message 
      }
    });

    throw error;
  }
}

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    log.warning('Tentativa de acesso sem token', { url: req.url });
    return res.status(401).json({ error: 'Token necessário' });
  }
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    log.auth(`Token válido para usuário ${req.user.email}`, { userId: req.user.userId });
    next();
  } catch {
    log.warning('Token inválido fornecido', { url: req.url });
    res.status(403).json({ error: 'Token inválido' });
  }
};

// ========================================
// ROTAS ESSENCIAIS
// ========================================

// Health check
app.get('/health', (req, res) => {
  log.info('Health check solicitado');
  res.json({ status: 'OK', app: 'LovelyApp' });
});

// ========================================
// WEBHOOK PERFECT PAY
// ========================================

app.post('/api/webhook/perfect-pay', async (req, res) => {
  try {
    log.webhook('Webhook Perfect Pay recebido', req.body);
    
    const result = await processWebhook(req.body);
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      data: result
    });

  } catch (error) {
    log.error('Erro no webhook Perfect Pay', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar webhook',
      message: error.message
    });
  }
});

// ========================================
// AUTENTICAÇÃO
// ========================================

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log(`[${new Date().toLocaleString('pt-BR')}] 🔐 Tentativa de login para: ${email}`);
  
  if (!email || !password) {
    console.log(`[${new Date().toLocaleString('pt-BR')}] ❌ Email ou senha não fornecidos`);
    return res.status(400).json({ 
      success: false, 
      message: 'Email e senha são obrigatórios' 
    });
  }

  try {
    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true
      }
    });

    if (!user) {
      console.log(`[${new Date().toLocaleString('pt-BR')}] ❌ Usuário não encontrado: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`[${new Date().toLocaleString('pt-BR')}] ❌ Senha inválida para: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[${new Date().toLocaleString('pt-BR')}] ✅ Login bem-sucedido para: ${email}`);
    console.log(`[${new Date().toLocaleString('pt-BR')}] 🔑 Token gerado: ${token.substring(0, 50)}...`);

    // Dados do usuário para incluir na URL
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.subscription?.planType || 'free',
      hasActiveSubscription: user.subscription?.status === 'ACTIVE',
      darinessLevel: user.darinessLevel || 5,
      partnerName: user.partnerName || 'Meu Amor'
    };

    // Usar callback na página principal do LovelyApp
    const redirectUrl = `${APP_BASE_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    console.log(`[${new Date().toLocaleString('pt-BR')}] 🔄 URL de redirecionamento: ${redirectUrl}`);

    res.json({
      success: true,
      data: {
        user: userData,
        token,
        redirectUrl
      }
    });

  } catch (error) {
    console.error(`[${new Date().toLocaleString('pt-BR')}] ❌ Erro no login:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Validar token
app.get('/api/auth/validate', auth, async (req, res) => {
  try {
    log.auth(`Validando token para usuário: ${req.user.email}`);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { subscription: true }
    });

    if (!user) {
      log.warning(`Usuário não encontrado para ID: ${req.user.userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      plan: user.subscription?.planType || null,
      hasActiveSubscription: user.subscription?.status === 'ACTIVE'
    };

    log.success(`Token validado com sucesso para: ${user.email}`, userData);
    
    res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    log.error('Erro na validação', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ========================================
// PERFIL DO USUÁRIO
// ========================================

// Perfil do usuário
app.get('/api/profile', auth, async (req, res) => {
  try {
    log.info(`Carregando perfil para usuário: ${req.user.email}`);
    
    let profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!profile) {
      log.info(`Criando perfil padrão para usuário: ${req.user.email}`);
      profile = await prisma.profile.create({
        data: { userId: req.user.userId }
      });
    }

    log.success(`Perfil carregado para: ${req.user.email}`, profile);
    res.json({ success: true, data: profile });

  } catch (error) {
    log.error('Erro no perfil', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Atualizar perfil
app.put('/api/profile', auth, async (req, res) => {
  try {
    const { partnerName, moodToday, darinessLevel } = req.body;
    
    log.info(`Atualizando perfil para usuário: ${req.user.email}`, {
      partnerName,
      moodToday,
      darinessLevel
    });

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.userId },
      update: { partnerName, moodToday, darinessLevel },
      create: { userId: req.user.userId, partnerName, moodToday, darinessLevel }
    });

    log.success(`Perfil atualizado para: ${req.user.email}`, profile);
    res.json({ success: true, data: profile });

  } catch (error) {
    log.error('Erro ao atualizar perfil', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ========================================
// ASSINATURA
// ========================================

// Verificar assinatura do usuário
app.get('/api/subscription', auth, async (req, res) => {
  try {
    log.info(`Verificando assinatura para usuário: ${req.user.email}`);
    
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.userId }
    });

    if (!subscription) {
      log.warning(`Assinatura não encontrada para usuário: ${req.user.email}`);
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    log.success(`Assinatura encontrada para: ${req.user.email}`, {
      plano: subscription.planType,
      status: subscription.status,
      valor: subscription.amount
    });

    res.json({ success: true, data: subscription });

  } catch (error) {
    log.error('Erro na assinatura', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ========================================
// ESTATÍSTICAS DO USUÁRIO
// ========================================

// Obter estatísticas do usuário
app.get('/api/user/stats', auth, async (req, res) => {
  try {
    log.info(`Carregando estatísticas para usuário: ${req.user.email}`);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { 
        profile: true,
        subscription: true
      }
    });

    if (!user) {
      log.warning(`Usuário não encontrado para ID: ${req.user.userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Calcular estatísticas baseadas no perfil e tempo de uso
    const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const darinessLevel = user.profile?.darinessLevel || 1;
    
    // Gerar estatísticas baseadas no nível de ousadia e tempo de conta
    const baseGames = Math.max(1, Math.floor(accountAge / 2) + darinessLevel);
    const stats = {
      gamesPlayed: baseGames + Math.floor(Math.random() * 5),
      favoriteGames: Math.max(1, Math.floor(baseGames * 0.6) + Math.floor(Math.random() * 3)),
      totalPlayTime: (baseGames * 25) + Math.floor(Math.random() * 200), // em minutos
      currentLevel: Math.min(10, Math.floor(darinessLevel + (accountAge / 7))),
      achievements: Math.max(1, Math.floor(baseGames * 0.8) + Math.floor(Math.random() * 8)),
      weeklyPlayTime: Math.floor(Math.random() * 180) + 30, // 30-210 minutos
      monthlyGames: Math.max(1, Math.floor(baseGames * 0.3) + Math.floor(Math.random() * 4)),
      consecutiveDays: Math.min(accountAge, Math.floor(Math.random() * 14) + 1),
      lastActivity: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)) // últimas 24h
    };

    log.success(`Estatísticas calculadas para: ${req.user.email}`, stats);
    res.json({ success: true, data: stats });

  } catch (error) {
    log.error('Erro ao carregar estatísticas', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Obter atividades recentes do usuário
app.get('/api/user/activities', auth, async (req, res) => {
  try {
    log.info(`Carregando atividades recentes para usuário: ${req.user.email}`);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { 
        profile: true,
        subscription: true
      }
    });

    if (!user) {
      log.warning(`Usuário não encontrado para ID: ${req.user.userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Gerar atividades baseadas no perfil do usuário
    const darinessLevel = user.profile?.darinessLevel || 1;
    const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    const activities = [];
    
    // Atividade de login recente
    activities.push({
      id: `activity_${Date.now()}_1`,
      action: 'Fez login no aplicativo',
      time: 'Agora mesmo',
      type: 'login',
      createdAt: new Date().toISOString()
    });

    // Atividades baseadas no nível de ousadia
    if (darinessLevel >= 3) {
      activities.push({
        id: `activity_${Date.now()}_2`,
        action: 'Completou um jogo romântico',
        time: `${Math.floor(Math.random() * 6) + 1}h atrás`,
        type: 'game',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 6 * 60 * 60 * 1000)).toISOString()
      });
    }

    if (darinessLevel >= 5) {
      activities.push({
        id: `activity_${Date.now()}_3`,
        action: 'Desbloqueou uma nova conquista',
        time: `${Math.floor(Math.random() * 24) + 1}h atrás`,
        type: 'achievement',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString()
      });
    }

    if (darinessLevel >= 7) {
      activities.push({
        id: `activity_${Date.now()}_4`,
        action: 'Alcançou um novo nível',
        time: `${Math.floor(Math.random() * 48) + 1}h atrás`,
        type: 'level',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000)).toISOString()
      });
    }

    // Atividade de sequência se o usuário tem conta há mais de 3 dias
    if (accountAge >= 3) {
      activities.push({
        id: `activity_${Date.now()}_5`,
        action: `Manteve sequência de ${Math.min(accountAge, 7)} dias`,
        time: `${Math.floor(Math.random() * 12) + 1}h atrás`,
        type: 'streak',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString()
      });
    }

    // Ordenar por data mais recente
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    log.success(`${activities.length} atividades carregadas para: ${req.user.email}`);
    res.json({ success: true, data: activities.slice(0, 5) }); // Retornar apenas as 5 mais recentes

  } catch (error) {
    log.error('Erro ao carregar atividades', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ========================================
// ROTA DE REDIRECIONAMENTO INTELIGENTE
// ========================================

// Rota para redirecionamento inteligente de autenticação
app.get('/auth', async (req, res) => {
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // Sem token, redirecionar para página de login do front
    log.redirect('Sem token -> Redirecionando para login do front');
    return res.redirect(`${FRONTEND_URL}/auth`);
  }

  try {
    // Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar dados completos do usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    });

    if (!user) {
      log.redirect('Usuário não encontrado -> Redirecionando para login do front');
      return res.redirect(`${FRONTEND_URL}/auth`);
    }

    // Dados do usuário para incluir na URL
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.subscription?.planType || 'free',
      hasActiveSubscription: user.subscription?.status === 'ACTIVE',
      darinessLevel: user.darinessLevel || 5,
      partnerName: user.partnerName || 'Meu Amor'
    };

    // Token válido, redirecionar para o LovelyApp COM os parâmetros
    const redirectUrl = `http://localhost:3001/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    log.redirect(`Token válido para ${decoded.email} -> Redirecionando para LovelyApp com parâmetros`);
    console.log(`[${new Date().toLocaleString('pt-BR')}] 🔄 URL de redirecionamento: ${redirectUrl}`);
    
    return res.redirect(redirectUrl);
    
  } catch (error) {
    // Token inválido, redirecionar para página de login do front
    log.redirect('Token inválido -> Redirecionando para login do front');
    return res.redirect(`${FRONTEND_URL}/auth`);
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}${colors.green}🚀 LovelyApp Backend Iniciado com Sucesso!${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`${colors.cyan}📡 Servidor:${colors.reset} http://localhost:${PORT}`);
  console.log(`${colors.magenta}🔔 Webhook:${colors.reset} http://localhost:${PORT}/api/webhook/perfect-pay`);
  console.log(`${colors.blue}🔐 API Auth:${colors.reset} http://localhost:${PORT}/api/auth`);
  console.log(`${colors.yellow}🔄 Redirect:${colors.reset} http://localhost:${PORT}/auth`);
  console.log(`${colors.green}💚 Health:${colors.reset} http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
  console.log(`${colors.bright}${colors.white}📊 Logs em tempo real ativados!${colors.reset}\n`);
}); 