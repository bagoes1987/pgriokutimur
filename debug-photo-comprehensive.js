const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE PHOTO DEBUG ANALYSIS');
console.log('=====================================\n');

// 1. Check uploads directory
console.log('📁 1. CHECKING UPLOADS DIRECTORY:');
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
try {
  if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists:', uploadsDir);
    const files = fs.readdirSync(uploadsDir);
    console.log(`📊 Total files: ${files.length}`);
    
    if (files.length > 0) {
      console.log('\n📋 Recent files (last 10):');
      files
        .map(file => ({
          name: file,
          stats: fs.statSync(path.join(uploadsDir, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime)
        .slice(0, 10)
        .forEach((file, index) => {
          console.log(`${index + 1}. ${file.name} (${file.stats.size} bytes, ${file.stats.mtime.toLocaleString()})`);
        });
    } else {
      console.log('⚠️  No files found in uploads directory');
    }
  } else {
    console.log('❌ Uploads directory does not exist');
  }
} catch (error) {
  console.log('❌ Error checking uploads directory:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 2. Check database for recent photo updates
console.log('🗄️  2. CHECKING DATABASE FOR RECENT PHOTO UPDATES:');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Get members with photos
    const membersWithPhotos = await prisma.member.findMany({
      where: {
        photo: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        photo: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });

    console.log(`✅ Found ${membersWithPhotos.length} members with photos`);
    
    if (membersWithPhotos.length > 0) {
      console.log('\n📋 Recent photo updates:');
      membersWithPhotos.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name} (ID: ${member.id})`);
        console.log(`   Photo: ${member.photo}`);
        console.log(`   Updated: ${member.updatedAt.toLocaleString()}`);
        
        // Check if file exists
        if (member.photo) {
          const photoPath = path.join(__dirname, 'public', member.photo);
          const exists = fs.existsSync(photoPath);
          console.log(`   File exists: ${exists ? '✅' : '❌'}`);
          if (exists) {
            const stats = fs.statSync(photoPath);
            console.log(`   File size: ${stats.size} bytes`);
            console.log(`   File modified: ${stats.mtime.toLocaleString()}`);
          }
        }
        console.log('');
      });
    }

  } catch (error) {
    console.log('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

console.log('\n' + '='.repeat(50) + '\n');

// 3. Test API endpoint
console.log('🌐 3. TESTING API ENDPOINT:');
async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/members', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ API Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(`📊 Members returned: ${data.members ? data.members.length : 'N/A'}`);
      
      if (data.members && data.members.length > 0) {
        const membersWithPhotos = data.members.filter(m => m.photo);
        console.log(`📸 Members with photos: ${membersWithPhotos.length}`);
        
        if (membersWithPhotos.length > 0) {
          console.log('\n📋 Sample photo URLs:');
          membersWithPhotos.slice(0, 3).forEach((member, index) => {
            console.log(`${index + 1}. ${member.name}: ${member.photo}`);
          });
        }
      }
    } else if (response.status === 401) {
      console.log('🔐 API requires authentication (expected)');
    } else {
      console.log('❌ Unexpected API response');
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
}

console.log('\n' + '='.repeat(50) + '\n');

// 4. Check frontend files for cache-busting
console.log('🔧 4. CHECKING FRONTEND CACHE-BUSTING IMPLEMENTATION:');
const frontendFile = path.join(__dirname, 'app', 'admin', 'anggota', 'page.tsx');

try {
  if (fs.existsSync(frontendFile)) {
    const content = fs.readFileSync(frontendFile, 'utf8');
    
    // Check for photoTimestamps state
    const hasPhotoTimestamps = content.includes('photoTimestamps');
    console.log(`✅ photoTimestamps state: ${hasPhotoTimestamps ? 'Found' : 'Missing'}`);
    
    // Check for timestamp usage in image src
    const hasTimestampUsage = content.includes('photoTimestamps[') && content.includes('Date.now()');
    console.log(`✅ Timestamp usage in image src: ${hasTimestampUsage ? 'Found' : 'Missing'}`);
    
    // Check for timestamp update in updateMember
    const hasTimestampUpdate = content.includes('setPhotoTimestamps') && content.includes('updatedMemberData.photo');
    console.log(`✅ Timestamp update in updateMember: ${hasTimestampUpdate ? 'Found' : 'Missing'}`);
    
    // Check for console.log statements
    const hasLogging = content.includes('console.log') && content.includes('photo timestamp');
    console.log(`✅ Debug logging: ${hasLogging ? 'Found' : 'Missing'}`);
    
  } else {
    console.log('❌ Frontend file not found');
  }
} catch (error) {
  console.log('❌ Error checking frontend file:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 5. Generate test instructions
console.log('📝 5. MANUAL TEST INSTRUCTIONS:');
console.log(`
🎯 STEP-BY-STEP TEST GUIDE:

1. 🌐 Open browser and go to: http://localhost:3000/admin/anggota
2. 🔐 Login with: admin@pgri.com / admin123
3. 🛠️  Open Developer Tools (F12) → Console tab
4. ✏️  Click "Edit" button on any member
5. 📸 Upload a new photo
6. 💾 Click "Simpan"

🔍 WHAT TO LOOK FOR:

✅ SUCCESS INDICATORS:
- Alert "Data anggota berhasil diperbarui" appears
- Photo in table changes immediately
- Console shows: "Setting new photo timestamp: [number] for member: [id]"
- Console shows: "Updated member photo path: [path]"

❌ FAILURE INDICATORS:
- Photo doesn't change in table
- No timestamp logs in console
- Error messages in console
- Network errors in Network tab

🐛 IF STILL NOT WORKING:
1. Check console for JavaScript errors
2. Check Network tab for failed requests
3. Verify file was uploaded to public/uploads/members/
4. Try hard refresh (Ctrl+F5)
5. Clear browser cache completely
`);

// Run async functions
(async () => {
  await checkDatabase();
  await testAPI();
  
  console.log('\n🎉 DEBUG ANALYSIS COMPLETE!');
  console.log('📖 Please follow the manual test instructions above.');
})();