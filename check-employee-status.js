const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEmployeeStatus() {
  try {
    console.log('=== Checking Employee Status Data ===\n');
    
    // Check existing employee statuses
    const existingStatuses = await prisma.employeeStatus.findMany();
    console.log('Existing Employee Statuses:');
    console.log(existingStatuses);
    console.log(`Total: ${existingStatuses.length}\n`);
    
    // If no data exists, create default employee statuses
    if (existingStatuses.length === 0) {
      console.log('No employee status data found. Creating default data...\n');
      
      const defaultStatuses = [
        'PNS',
        'PPPK',
        'GTT (Guru Tidak Tetap)',
        'GTY (Guru Tetap Yayasan)',
        'Honorer',
        'Swasta',
        'Pensiunan'
      ];
      
      for (const statusName of defaultStatuses) {
        await prisma.employeeStatus.create({
          data: { name: statusName }
        });
        console.log(`✓ Created: ${statusName}`);
      }
      
      console.log('\n✅ Default employee status data created successfully!');
    } else {
      console.log('✅ Employee status data already exists.');
    }
    
    // Check a sample member to see if employeeStatus is linked
    console.log('\n=== Checking Sample Member Data ===');
    const sampleMember = await prisma.member.findFirst({
      include: {
        employeeStatus: true,
        job: true,
        education: true
      }
    });
    
    if (sampleMember) {
      console.log('Sample Member:');
      console.log(`Name: ${sampleMember.name}`);
      console.log(`Employee Status: ${sampleMember.employeeStatus?.name || 'NULL'}`);
      console.log(`Job: ${sampleMember.job?.name || 'NULL'}`);
      console.log(`Education: ${sampleMember.education?.name || 'NULL'}`);
      console.log(`Employee Status ID: ${sampleMember.employeeStatusId}`);
    } else {
      console.log('No members found in database.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmployeeStatus();