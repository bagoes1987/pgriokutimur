const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🧪 TESTING PHOTO UPLOAD FIX');
console.log('===========================\n');

async function testPhotoFix() {
  try {
    // 1. Check current state
    console.log('1️⃣ CHECKING CURRENT STATE:');
    const member = await prisma.member.findUnique({
      where: { id: 2 },
      select: { id: true, name: true, photo: true, updatedAt: true }
    });
    
    console.log(`✅ Member: ${member.name} (ID: ${member.id})`);
    console.log(`📸 Current photo: ${member.photo}`);
    console.log(`🕒 Last updated: ${member.updatedAt.toLocaleString()}\n`);
    
    // 2. Check uploads directory
    console.log('2️⃣ CHECKING UPLOADS DIRECTORY:');
    const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`📁 Found ${files.length} files in uploads directory:`);
      
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   - ${file} (${stats.size} bytes)`);
      });
    } else {
      console.log('❌ Uploads directory not found');
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPhotoFix();