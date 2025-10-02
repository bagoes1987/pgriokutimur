const { PrismaClient } = require('@prisma/client');

async function checkMembers() {
  const prisma = new PrismaClient();
  
  try {
    const members = await prisma.member.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    console.log('Members:', JSON.stringify(members, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMembers();