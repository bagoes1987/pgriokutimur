const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testAdminDashboard() {
  try {
    console.log("=== Testing Admin Dashboard Data ===\n");

    // 1. Check if admin exists
    const admin = await prisma.admin.findFirst({
      where: { 
        isActive: true
      }
    });
    
    if (!admin) {
      console.log("❌ No active admin found");
      return;
    }
    
    console.log("✅ Admin found:", admin.username, "(" + admin.email + ")");

    // 2. Test member statistics directly from database
    console.log("\n=== Database Statistics ===");
    
    const totalMembers = await prisma.member.count();
    console.log("Total Members:", totalMembers);
    
    const approvedMembers = await prisma.member.count({
      where: { isApproved: true }
    });
    console.log("Approved Members:", approvedMembers);
    
    const pendingMembers = await prisma.member.count({
      where: { isApproved: false }
    });
    console.log("Pending Members:", pendingMembers);

    // 3. Test news statistics
    const totalNews = await prisma.news.count();
    console.log("Total News:", totalNews);
    
    const publishedNews = await prisma.news.count({
      where: { isPublished: true }
    });
    console.log("Published News:", publishedNews);

    // 4. Test officer statistics
    const totalOfficers = await prisma.officer.count({
      where: { isActive: true }
    });
    console.log("Total Officers:", totalOfficers);

    // 5. Generate JWT token for API test
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: 'admin' 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log("\n=== Testing API with Authentication ===");
    
    // 6. Test API call with proper authentication
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3000/api/admin/dashboard', {
      headers: {
        'Cookie': `token=${token}`,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("❌ API Error:", response.status, await response.text());
      return;
    }

    const apiData = await response.json();
    console.log("✅ API Response:");
    console.log(JSON.stringify(apiData, null, 2));

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminDashboard();