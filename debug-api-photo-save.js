const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔍 DEBUGGING API PHOTO SAVE PROCESS');
console.log('===================================\n');

async function checkPhotoSaveProcess() {
  try {
    // 1. Check current member data in database
    console.log('📊 1. CHECKING CURRENT MEMBER DATA IN DATABASE:');
    const member = await prisma.member.findUnique({
      where: { id: 2 }, // Bagus Panca Wiratama
      select: {
        id: true,
        name: true,
        photo: true,
        updatedAt: true
      }
    });
    
    if (member) {
      console.log('✅ Member found in database:');
      console.log(`   ID: ${member.id}`);
      console.log(`   Name: ${member.name}`);
      console.log(`   Photo: ${member.photo}`);
      console.log(`   Updated: ${member.updatedAt.toLocaleString()}`);
      
      // Check if photo file exists
      if (member.photo) {
        const photoPath = path.join(__dirname, 'public', member.photo);
        const exists = fs.existsSync(photoPath);
        console.log(`   Photo file exists: ${exists ? '✅' : '❌'}`);
        
        if (exists) {
          const stats = fs.statSync(photoPath);
          console.log(`   File size: ${stats.size} bytes`);
          console.log(`   File modified: ${stats.mtime.toLocaleString()}`);
        }
      } else {
        console.log('   No photo path in database');
      }
    } else {
      console.log('❌ Member not found in database');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 2. Check recent uploads directory
    console.log('📁 2. CHECKING RECENT UPLOADS:');
    const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const recentFiles = files
        .map(file => ({
          name: file,
          stats: fs.statSync(path.join(uploadsDir, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime)
        .slice(0, 5);
      
      console.log('📋 5 most recent files:');
      recentFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}`);
        console.log(`   Size: ${file.stats.size} bytes`);
        console.log(`   Modified: ${file.stats.mtime.toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('❌ Uploads directory not found');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 3. Test API endpoint directly
    console.log('🌐 3. TESTING API ENDPOINT RESPONSE:');
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/members/2', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`API Status: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        console.log('✅ API Response:');
        console.log(`   Success: ${data.success}`);
        if (data.member) {
          console.log(`   Member ID: ${data.member.id}`);
          console.log(`   Member Name: ${data.member.name}`);
          console.log(`   Member Photo: ${data.member.photo}`);
          console.log(`   Updated At: ${data.member.updatedAt}`);
        }
      } else if (response.status === 401) {
        console.log('🔐 API requires authentication (expected for GET)');
      } else {
        console.log('❌ Unexpected API response');
        const errorText = await response.text();
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.log('❌ API test error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 4. Instructions for manual testing
    console.log('📝 4. MANUAL TESTING INSTRUCTIONS:');
    console.log(`
🎯 STEP-BY-STEP DEBUGGING:

1. 🌐 Open browser and go to: http://localhost:3000/admin/anggota
2. 🔐 Login with: admin@pgri.com / admin123
3. 🛠️  Open Developer Tools (F12) → Console tab
4. ✏️  Click "Edit" on member "Bagus Panca Wiratama"
5. 📸 Upload a NEW photo (different from current)
6. 💾 Click "Simpan"

🔍 WHAT TO CHECK IN CONSOLE:

✅ EXPECTED LOGS (in order):
1. "Photo file was uploaded, setting new timestamp: [number] for member: 2"
2. "Updated photoTimestamps state: {2: [timestamp]}"
3. "Preloading new image with cache-busting URL: [url]"
4. "Updating members state with new data for member ID: 2"
5. "New member data to be set: {photo: '[new-path]', ...}"
6. "Updated member object: {photo: '[new-path]', ...}"

❌ PROBLEM INDICATORS:
- No timestamp logs appear
- Photo path in logs is still the old path
- Console errors during upload
- Network tab shows failed PUT request

🐛 AFTER TESTING:
1. Run this script again to see if database was updated
2. Check if new file appears in uploads directory
3. Compare timestamps between file system and database
`);
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkPhotoSaveProcess();