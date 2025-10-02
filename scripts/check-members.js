const { PrismaClient } = require('@prisma/client');

async function checkMembers() {
  const prisma = new PrismaClient();
  
  try {
    const count = await prisma.member.count();
    console.log('Total members in database:', count);
    
    const members = await prisma.member.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        isApproved: true,
        isActive: true
      }
    });
    
    console.log('Sample members:');
    members.forEach(member => {
      console.log(`- ${member.name} (${member.email}) - Approved: ${member.isApproved}, Active: ${member.isActive}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMembers();