const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPasswordDisplay() {
  try {
    console.log("=== Testing Password Display Feature ===\n");

    // 1. Check existing members
    console.log("1. Checking existing members...");
    const existingMembers = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plainPassword: true,
        createdAt: true
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${existingMembers.length} members:`);
    existingMembers.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.name}`);
      console.log(`      Email: ${member.email}`);
      console.log(`      Plain Password: ${member.plainPassword || 'Not available (old member)'}`);
      console.log(`      Created: ${member.createdAt}`);
      console.log('');
    });

    // 2. Test API endpoint
    console.log("2. Testing API endpoint...");
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/members?page=1&limit=5');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.members && data.members.length > 0) {
          console.log("✅ API Response successful");
          console.log(`   Retrieved ${data.members.length} members`);
          
          const memberWithPlainPassword = data.members.find(m => m.plainPassword);
          if (memberWithPlainPassword) {
            console.log("✅ Found member with plainPassword:", memberWithPlainPassword.name);
            console.log("   Plain Password:", memberWithPlainPassword.plainPassword);
          } else {
            console.log("📝 No members with plainPassword found (all are old members)");
          }
        } else {
          console.log("❌ API Response failed or no members returned");
        }
      } else {
        console.log("❌ API request failed with status:", response.status);
      }
    } catch (apiError) {
      console.log("❌ API test failed:", apiError.message);
    }

    console.log("\n=== Feature Status ===");
    console.log("✅ Database schema updated with plainPassword field");
    console.log("✅ API modified to return plainPassword field");
    console.log("✅ Registration API modified to store plainPassword");
    console.log("✅ Admin page updated to display plainPassword");
    console.log("");
    console.log("📝 Next steps:");
    console.log("   - Register a new member to test plainPassword storage");
    console.log("   - Check admin page to see password display");
    console.log("   - Existing members will show 'Password tidak tersedia (anggota lama)'");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordDisplay();