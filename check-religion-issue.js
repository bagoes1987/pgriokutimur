const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkReligionIssue() {
  try {
    console.log('=== Checking Religion Issue ===\n');
    
    // Get member data with religionId
    const member = await prisma.member.findUnique({
      where: { email: 'bagoespancawiratama@gmail.com' },
      select: {
        id: true,
        name: true,
        religionId: true
      }
    });
    
    console.log('Member data:');
    console.log('ID:', member.id);
    console.log('Name:', member.name);
    console.log('Religion ID:', member.religionId);
    console.log('');
    
    // Check if religion with that ID exists
    if (member.religionId) {
      const religion = await prisma.religion.findUnique({
        where: { id: member.religionId }
      });
      
      console.log('Religion lookup result:');
      if (religion) {
        console.log('✅ Religion found:', religion);
      } else {
        console.log('❌ Religion NOT found for ID:', member.religionId);
      }
    } else {
      console.log('❌ Member has no religionId set!');
    }
    
    console.log('\n=== All available religions ===');
    const allReligions = await prisma.religion.findMany();
    allReligions.forEach(religion => {
      console.log(`ID: ${religion.id}, Name: ${religion.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkReligionIssue();