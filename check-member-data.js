const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMemberData() {
  try {
    console.log('=== Checking Member Data ===\n');
    
    // Get all members
    const members = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        isApproved: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Total members found: ${members.length}\n`);
    
    members.forEach((member, index) => {
      console.log(`${index + 1}. Member ID: ${member.id}`);
      console.log(`   Email: ${member.email}`);
      console.log(`   Name: ${member.name}`);
      console.log(`   Active: ${member.isActive}`);
      console.log(`   Approved: ${member.isApproved}`);
      console.log(`   Created: ${member.createdAt}`);
      console.log('');
    });
    
    // Check specific member
    const specificMember = await prisma.member.findUnique({
      where: { email: 'bagoespancawiratama@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        isApproved: true,
        password: true,
        createdAt: true
      }
    });
    
    if (specificMember) {
      console.log('=== Specific Member Check ===');
      console.log('Email: bagoespancawiratama@gmail.com');
      console.log('Found:', specificMember);
    } else {
      console.log('=== Specific Member Check ===');
      console.log('Email: bagoespancawiratama@gmail.com');
      console.log('Member not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMemberData();