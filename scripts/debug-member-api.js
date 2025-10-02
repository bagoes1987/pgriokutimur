const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugMemberAPI() {
  try {
    console.log('1. Testing basic member count...');
    const count = await prisma.member.count();
    console.log('Total members:', count);

    console.log('\n2. Testing basic member query...');
    const members = await prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Members found:', members.length);
    console.log('First member:', members[0]);

    console.log('\n3. Testing member query with relations...');
    try {
      const membersWithRelations = await prisma.member.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          province: { select: { name: true } },
          regency: { select: { name: true } },
          district: { select: { name: true } },
          village: { select: { name: true } },
          job: { select: { name: true } },
          education: { select: { name: true } }
        }
      });
      console.log('Members with relations:', membersWithRelations.length);
      console.log('First member with relations:', JSON.stringify(membersWithRelations[0], null, 2));
    } catch (relationError) {
      console.error('Error with relations:', relationError.message);
      
      // Test each relation individually
      console.log('\n4. Testing individual relations...');
      const member = members[0];
      if (member) {
        try {
          const province = await prisma.province.findUnique({ where: { id: member.provinceId } });
          console.log('Province:', province);
        } catch (e) {
          console.error('Province error:', e.message);
        }

        try {
          const regency = await prisma.regency.findUnique({ where: { id: member.regencyId } });
          console.log('Regency:', regency);
        } catch (e) {
          console.error('Regency error:', e.message);
        }

        try {
          const district = await prisma.district.findUnique({ where: { id: member.districtId } });
          console.log('District:', district);
        } catch (e) {
          console.error('District error:', e.message);
        }

        try {
          const village = await prisma.village.findUnique({ where: { id: member.villageId } });
          console.log('Village:', village);
        } catch (e) {
          console.error('Village error:', e.message);
        }

        try {
          const job = await prisma.job.findUnique({ where: { id: member.jobId } });
          console.log('Job:', job);
        } catch (e) {
          console.error('Job error:', e.message);
        }

        try {
          const education = await prisma.education.findUnique({ where: { id: member.educationId } });
          console.log('Education:', education);
        } catch (e) {
          console.error('Education error:', e.message);
        }
      }
    }

  } catch (error) {
    console.error('Main error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMemberAPI();