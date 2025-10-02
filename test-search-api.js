const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSearchAPI() {
  try {
    console.log('=== TESTING SEARCH API FUNCTIONALITY ===\n');
    
    // Test 1: Search by name "bagus"
    console.log('1. Testing searchNama=bagus:');
    const searchNama = 'bagus';
    const andConditions = [];
    
    if (searchNama) {
      andConditions.push({
        name: { contains: searchNama }
      });
    }
    
    const where = {};
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }
    
    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } }
      }
    });
    
    console.log(`   Found ${members.length} members:`);
    members.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} - District: ${m.district?.name || 'N/A'} - Approved: ${m.isApproved}`);
    });
    
    // Test 2: Search by name "Bagus" (case sensitive)
    console.log('\n2. Testing searchNama=Bagus (case sensitive):');
    const searchNama2 = 'Bagus';
    const andConditions2 = [];
    
    if (searchNama2) {
      andConditions2.push({
        name: { contains: searchNama2 }
      });
    }
    
    const where2 = {};
    if (andConditions2.length > 0) {
      where2.AND = andConditions2;
    }
    
    const members2 = await prisma.member.findMany({
      where: where2,
      orderBy: { createdAt: 'desc' },
      include: {
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } }
      }
    });
    
    console.log(`   Found ${members2.length} members:`);
    members2.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} - District: ${m.district?.name || 'N/A'} - Approved: ${m.isApproved}`);
    });
    
    // Test 3: Check if member is approved
    console.log('\n3. Checking approval status of Bagus member:');
    const bagusMembers = await prisma.member.findMany({
      where: {
        name: { contains: 'Bagus' }
      },
      select: {
        id: true,
        name: true,
        isApproved: true,
        isActive: true
      }
    });
    
    bagusMembers.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} - Approved: ${m.isApproved}, Active: ${m.isActive}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSearchAPI();