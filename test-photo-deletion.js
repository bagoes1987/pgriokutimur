const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPhotoDeletion() {
  console.log('🧪 Testing Photo Deletion Logic...\n');
  
  // Check current state
  console.log('📁 Current files in uploads/members:');
  const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
  const files = fs.readdirSync(uploadsDir);
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} (${stats.size} bytes, ${stats.mtime})`);
  });
  
  console.log('\n🔍 Current member photo in database:');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const member = await prisma.member.findUnique({
    where: { id: 2 },
    select: { id: true, name: true, photo: true }
  });
  
  if (member) {
    console.log(`   Member: ${member.name}`);
    console.log(`   Current photo: ${member.photo}`);
    
    if (member.photo) {
      const currentPhotoPath = path.join(__dirname, 'public', member.photo);
      console.log(`   Full path: ${currentPhotoPath}`);
      console.log(`   File exists: ${fs.existsSync(currentPhotoPath)}`);
    }
  }
  
  console.log('\n🚀 Testing API call with new photo...');
  
  // Create a simple test image
  const testImagePath = path.join(__dirname, 'test-image.jpg');
  const testImageContent = Buffer.from('fake-image-content-for-testing');
  fs.writeFileSync(testImagePath, testImageContent);
  
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('name', member.name);
    formData.append('phoneNumber', '081234567890');
    formData.append('address', 'Test Address');
    formData.append('institutionName', 'Test Institution');
    formData.append('workAddress', 'Test Work Address');
    formData.append('photo', fs.createReadStream(testImagePath), 'test-photo.jpg');
    
    // Make API call
    const response = await fetch('http://localhost:3000/api/admin/members/2', {
      method: 'PUT',
      body: formData
    });
    
    const result = await response.json();
    console.log('📝 API Response:', result);
    
    // Check files after API call
    console.log('\n📁 Files after API call:');
    const filesAfter = fs.readdirSync(uploadsDir);
    filesAfter.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file} (${stats.size} bytes, ${stats.mtime})`);
    });
    
    // Check database after
    const memberAfter = await prisma.member.findUnique({
      where: { id: 2 },
      select: { photo: true }
    });
    console.log(`\n📊 New photo in database: ${memberAfter.photo}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    await prisma.$disconnect();
  }
}

testPhotoDeletion();