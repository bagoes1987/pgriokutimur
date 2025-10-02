const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentPhoto() {
  try {
    const member = await prisma.member.findUnique({
      where: { id: 2 }
    });
    
    if (member) {
      console.log('=== CURRENT PHOTO STATUS ===');
      console.log('Member name:', member.name);
      console.log('Photo path in DB:', member.photo);
      console.log('Updated at:', member.updatedAt);
    } else {
      console.log('Member not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentPhoto();