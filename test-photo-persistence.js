const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function testPhotoPersistence() {
  try {
    console.log('🧪 TESTING PHOTO PERSISTENCE FIX');
    console.log('================================');
    
    // Check current member data
    const member = await prisma.member.findFirst({
      where: { id: 2 }
    });
    
    if (!member) {
      console.log('❌ Member not found');
      return;
    }
    
    console.log('👤 Current Member:', member.name);
    console.log('📸 Current Photo:', member.photo);
    console.log('📅 Last Updated:', member.updatedAt);
    
    // Check if photo file exists
    if (member.photo) {
      const photoPath = path.join(__dirname, 'public', member.photo);
      const exists = fs.existsSync(photoPath);
      console.log('📁 Photo File Exists:', exists);
      
      if (exists) {
        const stats = fs.statSync(photoPath);
        console.log('📊 Photo File Size:', stats.size, 'bytes');
        console.log('📅 Photo File Modified:', stats.mtime);
      }
    }
    
    // Check uploads directory
    const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log('📂 Files in uploads directory:', files.length);
      
      // Show recent files for member 2
      const member2Files = files.filter(f => f.startsWith('2-')).sort().reverse();
      console.log('📸 Recent photos for member 2:');
      member2Files.slice(0, 3).forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.size} bytes, ${stats.mtime})`);
      });
    }
    
    console.log('\n✅ Test completed. Now try uploading a photo in the browser!');
    console.log('📝 Expected behavior after fix:');
    console.log('   1. Upload photo');
    console.log('   2. See success message');
    console.log('   3. Click OK');
    console.log('   4. Photo should REMAIN visible (not disappear)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPhotoPersistence();