const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔄 Criando usuário de teste...');

    // Dados do usuário de teste
    const testEmail = 'gusta@teste.com'; // Substitua pelo seu email
    const testPassword = '123456'; // Senha simples para teste
    const testName = 'Gustavo Teste';

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (existingUser) {
      console.log('⚠️ Usuário já existe, atualizando...');
      
      // Atualizar senha
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      });

      // Atualizar assinatura para premium
      await prisma.subscription.upsert({
        where: { userId: existingUser.id },
        update: {
          planCode: 'PPU38CPQ742',
          planType: 'premium',
          saleCode: 'TEST-PREMIUM-001',
          status: 'ACTIVE',
          amount: 97.00,
          startDate: new Date()
        },
        create: {
          userId: existingUser.id,
          planCode: 'PPU38CPQ742',
          planType: 'premium',
          saleCode: 'TEST-PREMIUM-001',
          status: 'ACTIVE',
          amount: 97.00,
          startDate: new Date()
        }
      });

      console.log('✅ Usuário atualizado com sucesso!');
      console.log(`📧 Email: ${testEmail}`);
      console.log(`🔑 Senha: ${testPassword}`);
      console.log(`💎 Plano: Premium`);
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: testName,
        password: hashedPassword
      }
    });

    console.log('✅ Usuário criado:', user.email);

    // Criar perfil
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        partnerName: 'Amor da Vida',
        darinessLevel: 8,
        moodToday: 'ROMANTIC'
      }
    });

    console.log('✅ Perfil criado');

    // Criar assinatura premium
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planCode: 'PPU38CPQ742', // Código do plano premium
        planType: 'premium',
        saleCode: 'TEST-PREMIUM-001',
        status: 'ACTIVE',
        amount: 97.00,
        currency: 'BRL',
        startDate: new Date()
      }
    });

    console.log('✅ Assinatura premium criada');

    console.log('\n🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!');
    console.log('==========================================');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Senha: ${testPassword}`);
    console.log(`👤 Nome: ${testName}`);
    console.log(`💎 Plano: Premium (todos os jogos liberados)`);
    console.log(`💰 Valor: R$ 97,00`);
    console.log(`📅 Data de início: ${new Date().toLocaleDateString('pt-BR')}`);
    console.log('==========================================');
    console.log('\n🚀 Agora você pode fazer login no LovelyApp!');
    console.log(`🌐 Acesse: http://localhost:3001/login`);

  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 