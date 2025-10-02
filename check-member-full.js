const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMemberFull() {
  try {
    console.log('=== Checking Full Member Data ===\n');
    
    // Check specific member with all fields
    const member = await prisma.member.findUnique({
      where: { email: 'bagoespancawiratama@gmail.com' },
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
      console.log('Member found:');
      console.log('ID:', member.id);
      console.log('Email:', member.email);
      console.log('Name:', member.name);
      console.log('NPA:', member.npa);
      console.log('Old NPA:', member.oldNpa);
      console.log('NIK:', member.nik);
      console.log('Gender:', member.gender);
      console.log('Birth Place:', member.birthPlace);
      console.log('Birth Date:', member.birthDate);
      console.log('Phone:', member.phoneNumber);
      console.log('Photo:', member.photo);
      console.log('Religion:', member.religion?.name);
      console.log('Province:', member.province?.name);
      console.log('Regency:', member.regency?.name);
      console.log('District:', member.district?.name);
      console.log('Job:', member.job?.name);
      console.log('Education:', member.education?.name);
      console.log('Employee Status:', member.employeeStatus?.name);
      console.log('Teaching Levels:', member.teachingLevels?.map(tl => tl.name));
    } else {
      console.log('Member not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMemberFull();