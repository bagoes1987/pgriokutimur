const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testBiodataAPI() {
  try {
    console.log('=== Testing Biodata API Response ===\n');
    
    // Simulate the API logic
    const member = await prisma.member.findUnique({
      where: { id: 2 }, // Bagus's ID
      include: {
        religion: true,
        province: true,
        regency: true,
        district: true,
        job: true,
        education: true,
        employeeStatus: true,
        teachingLevels: true
      }
    });
    
    if (member) {
      console.log('API Response would be:');
      console.log(JSON.stringify({
        success: true,
        member: {
          id: member.id,
          name: member.name,
          npa: member.npa,
          oldNpa: member.oldNpa,
          gender: member.gender,
          photoPath: member.photoPath,
          // ... other fields
        }
      }, null, 2));
      
      console.log('\n=== Key Fields Check ===');
      console.log('NPA:', member.npa);
      console.log('Old NPA:', member.oldNpa);
      console.log('Gender:', member.gender);
      console.log('Photo Path:', member.photoPath);
    } else {
      console.log('Member not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBiodataAPI();