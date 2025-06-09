require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('👥 Listando usuários cadastrados...\n');
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado!');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. 📧 ${user.email}`);
        console.log(`   👤 ${user.name}`);
        console.log(`   📅 ${user.createdAt.toLocaleString('pt-BR')}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 