const fs = require('fs');
const path = require('path');

console.log('🔍 TESTING FOTO SETELAH PERBAIKAN...');
console.log('');

// Test 1: Cek apakah file foto ada di direktori uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
console.log('📁 Checking uploads directory:', uploadsDir);

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log('📸 Files in uploads/members:', files);
  
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file}: ${stats.size} bytes, modified: ${stats.mtime}`);
  });
} else {
  console.log('❌ Uploads directory does not exist!');
}

console.log('');
console.log('🧪 Test completed. Please check browser console for any photo loading errors.');
console.log('📋 Next steps:');
console.log('   1. Open browser developer tools (F12)');
console.log('   2. Go to Console tab');
console.log('   3. Refresh the biodata page');
console.log('   4. Look for any red error messages about photo loading');