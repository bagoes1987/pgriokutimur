const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRawMember() {
  try {
    console.log('=== Checking Raw Member Data ===\n');
    
    // Get raw member data
    const member = await prisma.member.findUnique({
      where: { email: 'bagoespancawiratama@gmail.com' }
    });
    
    console.log('Raw member data:');
    console.log(JSON.stringify(member, null, 2));
    
    // Try to include religion specifically
    console.log('\n=== Testing Religion Include ===');
    const memberWithReligion = await prisma.member.findUnique({
      where: { email: 'bagoespancawiratama@gmail.com' },
      include: {
        religion: true
      }
    });
    
    console.log('Member with religion:');
    console.log('Religion:', memberWithReligion.religion);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRawMember();