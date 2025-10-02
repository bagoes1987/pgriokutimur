const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing Prisma connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Test finding a user
    const user = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (user) {
      console.log('✅ Found admin user:', {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      });
    } else {
      console.log('❌ No admin user found');
    }
    
  } catch (error) {
    console.error('❌ Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();