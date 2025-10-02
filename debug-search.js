const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSearch() {
  try {
    console.log('=== DEBUG SEARCH FUNCTIONALITY ===\n');
    
    // 1. Check all members
    const allMembers = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        oldNpa: true,
        nik: true,
        email: true,
        isApproved: true,
        isActive: true
      }
    });
    
    console.log('1. ALL MEMBERS:');
    allMembers.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} (NPA: ${m.oldNpa || 'N/A'}) - Approved: ${m.isApproved}, Active: ${m.isActive}`);
    });
    
    // 2. Search for 'bagus' (case sensitive)
    console.log('\n2. SEARCH FOR "bagus" (case sensitive):');
    const bagusMembers = await prisma.member.findMany({
      where: {
        name: {
          contains: "bagus"
        }
      },
      select: {
        id: true,
        name: true,
        oldNpa: true,
        isApproved: true,
        isActive: true
      }
    });
    
    if (bagusMembers.length > 0) {
      bagusMembers.forEach((m, i) => {
        console.log(`   ${i+1}. ${m.name} (NPA: ${m.oldNpa || 'N/A'}) - Approved: ${m.isApproved}, Active: ${m.isActive}`);
      });
    } else {
      console.log('   No members found with name containing "bagus"');
    }
    
    // 3. Test API-like query
    console.log('\n3. TEST API-LIKE QUERY (searchNama=bagus):');
    const apiLikeQuery = await prisma.member.findMany({
      where: {
        AND: [
          {
            name: {
              contains: "bagus"
            }
          }
        ]
      },
      include: {
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (apiLikeQuery.length > 0) {
      apiLikeQuery.forEach((m, i) => {
        console.log(`   ${i+1}. ${m.name} - District: ${m.district?.name || 'N/A'}`);
      });
    } else {
      console.log('   No results from API-like query');
    }
    
    // 4. Check for partial matches
    console.log('\n4. PARTIAL MATCHES TEST:');
    const partialMatches = await prisma.member.findMany({
      where: {
        name: {
          contains: "a"
        }
      },
      select: {
        name: true,
        oldNpa: true
      }
    });
    
    if (partialMatches.length > 0) {
      partialMatches.forEach((m, i) => {
        console.log(`   ${i+1}. "${m.name}" (NPA: ${m.oldNpa || 'N/A'})`);
      });
    } else {
      console.log('   No partial matches found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSearch();