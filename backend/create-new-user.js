require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createNewUser() {
  try {
    console.log('🚀 Criando novo usuário de teste...');

    const email = 'teste@lovelyapp.com';
    const password = '123456';
    const name = 'Teste LovelyApp';

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('⚠️ Usuário já existe, atualizando...');
      
      // Atualizar usuário existente
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name
        }
      });
    } else {
      console.log('✨ Criando novo usuário...');
      
      // Criar novo usuário
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });

      // Criar perfil
      await prisma.profile.create({
        data: {
          userId: user.id,
          partnerName: 'Meu Amor',
          darinessLevel: 7
        }
      });

      // Criar assinatura premium
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planCode: 'PPU38CPQ742',
          planType: 'premium',
          saleCode: 'TEST-' + Date.now(),
          status: 'ACTIVE',
          amount: 77.90,
          startDate: new Date()
        }
      });
    }

    console.log('✅ Usuário criado/atualizado com sucesso!');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('💎 Plano: Premium');
    console.log('👫 Parceiro(a): Meu Amor');
    console.log('💖 Nível de ousadia: 7');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createNewUser(); 