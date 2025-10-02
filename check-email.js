const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEmail() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'vidoeshorts.bogoes@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    if (user) {
      console.log('✅ Email ditemukan di sistem:');
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Nama:', user.name);
      console.log('Role:', user.role);
      console.log('Terdaftar:', user.createdAt);
    } else {
      console.log('❌ Email tidak ditemukan di sistem');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmail();