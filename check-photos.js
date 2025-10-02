const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPhotos() {
  try {
    const members = await prisma.member.findMany({
      where: { photo: { not: null } },
      select: { id: true, name: true, photo: true }
    });
    
    console.log('Members with photos:');
    members.forEach(member => {
      console.log(`ID: ${member.id}, Name: ${member.name}, Photo: ${member.photo}`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkPhotos();