const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMemberRelations() {
  try {
    console.log('=== Checking Member Relations ===\n');
    
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
      console.log('Member found with relations:');
      console.log('ID:', member.id);
      console.log('Name:', member.name);
      console.log('Email:', member.email);
      console.log('');
      
      console.log('Relations:');
      console.log('Religion:', member.religion);
      console.log('Province:', member.province);
      console.log('Regency:', member.regency);
      console.log('District:', member.district);
      console.log('Village (scalar):', member.village);
      console.log('Job:', member.job);
      console.log('Education:', member.education);
      console.log('Employee Status:', member.employeeStatus);
      console.log('Teaching Levels:', member.teachingLevels);
      
      // Check for null relations
      const nullRelations = [];
      if (!member.religion) nullRelations.push('religion');
      if (!member.province) nullRelations.push('province');
      if (!member.regency) nullRelations.push('regency');
      if (!member.district) nullRelations.push('district');
      if (!member.job) nullRelations.push('job');
      if (!member.education) nullRelations.push('education');
      if (!member.employeeStatus) nullRelations.push('employeeStatus');
      
      if (nullRelations.length > 0) {
        console.log('\n❌ NULL RELATIONS FOUND:');
        nullRelations.forEach(rel => console.log(`   - ${rel}`));
        console.log('\nThis might be causing the 500 error!');
      } else {
        console.log('\n✅ All relations are properly set');
      }
      
    } else {
      console.log('Member not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMemberRelations();