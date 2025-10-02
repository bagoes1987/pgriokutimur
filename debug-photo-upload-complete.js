const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔍 DEBUGGING PHOTO UPLOAD ISSUE');
console.log('===============================\n');

async function debugPhotoUpload() {
  try {
    // 1. Check current state
    console.log('1️⃣ CHECKING CURRENT STATE:');
    const member = await prisma.member.findUnique({
      where: { id: 2 },
      select: { id: true, name: true, photo: true, updatedAt: true }
    });
    
    if (member) {
      console.log(`✅ Member: ${member.name} (ID: ${member.id})`);
      console.log(`📸 Current photo: ${member.photo}`);
      console.log(`🕒 Last updated: ${member.updatedAt.toLocaleString()}`);
      
      if (member.photo) {
        const photoPath = path.join(__dirname, 'public', member.photo);
        const exists = fs.existsSync(photoPath);
        console.log(`📁 File exists: ${exists ? '✅' : '❌'}`);
        
        if (exists) {
          const stats = fs.statSync(photoPath);
          console.log(`📏 File size: ${stats.size} bytes`);
          console.log(`🕒 File modified: ${stats.mtime.toLocaleString()}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 2. Check all photos in uploads directory
    console.log('2️⃣ CHECKING UPLOADS DIRECTORY:');
    const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`📁 Found ${files.length} files in uploads/members:`);
      
      files.forEach((file, index) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`${index + 1}. ${file}`);
        console.log(`   Size: ${stats.size} bytes`);
        console.log(`   Modified: ${stats.mtime.toLocaleString()}`);
      });
    } else {
      console.log('❌ Uploads directory not found');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    console.log('✅ Debug complete. Check the results above.');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPhotoUpload();