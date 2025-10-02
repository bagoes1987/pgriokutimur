const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function testPhotoFixFinal() {
  try {
    console.log('🔍 TESTING PHOTO PERSISTENCE FIX');
    console.log('================================');
    
    // Check current member data
    const member = await prisma.member.findFirst({
      where: { id: 2 },
      select: {
        id: true,
        name: true,
        photo: true,
        updatedAt: true
      }
    });
    
    if (member) {
      console.log(`👤 Current Member: ${member.name} (ID: ${member.id})`);
      console.log(`📸 Current Photo: ${member.photo || 'No photo'}`);
      console.log(`🕒 Last Updated: ${member.updatedAt.toLocaleString('id-ID')}`);
      
      if (member.photo) {
        const photoPath = path.join(__dirname, 'public', member.photo);
        if (fs.existsSync(photoPath)) {
          const stats = fs.statSync(photoPath);
          console.log(`✅ Photo File Exists: ${stats.size} bytes`);
        } else {
          console.log(`❌ Photo File Missing: ${photoPath}`);
        }
      }
    }
    
    console.log('\n📋 MANUAL TEST INSTRUCTIONS:');
    console.log('1. Go to http://localhost:3000/member/biodata');
    console.log('2. Click "Edit Biodata"');
    console.log('3. Select a new photo');
    console.log('4. Click "Simpan"');
    console.log('5. When "Biodata berhasil diperbarui" appears, click "OK"');
    console.log('6. ✅ VERIFY: Photo should remain visible (not disappear)');
    console.log('7. ✅ VERIFY: Photo should have cache-busting timestamp');
    
    console.log('\n🔧 FIX APPLIED:');
    console.log('- Moved photo clearing to setTimeout after alert');
    console.log('- This prevents React re-render issues during alert display');
    console.log('- Photo preview is cleared 100ms after alert is dismissed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPhotoFixFinal();