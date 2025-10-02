const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function approveBagus() {
  try {
    console.log('=== APPROVING BAGUS MEMBER ===\n');
    
    // Find Bagus member
    const bagusMembers = await prisma.member.findMany({
      where: {
        name: { contains: 'Bagus' }
      }
    });
    
    if (bagusMembers.length === 0) {
      console.log('No Bagus member found');
      return;
    }
    
    console.log('Found Bagus members:');
    bagusMembers.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} - Approved: ${m.isApproved}`);
    });
    
    // Approve the first Bagus member
    const bagusToApprove = bagusMembers[0];
    
    const updatedMember = await prisma.member.update({
      where: { id: bagusToApprove.id },
      data: { isApproved: true }
    });
    
    console.log(`\nApproved member: ${updatedMember.name}`);
    console.log(`New approval status: ${updatedMember.isApproved}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

approveBagus();