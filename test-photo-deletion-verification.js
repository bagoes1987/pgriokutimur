const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function testPhotoDeletionVerification() {
  console.log('🔍 Testing Photo Deletion Verification...\n');
  
  const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
  
  try {
    // 1. Count files before upload
    console.log('1️⃣ Counting files before upload...');
    const filesBefore = fs.readdirSync(uploadsDir);
    console.log(`📁 Files before: ${filesBefore.length}`);
    console.log('📋 Files:', filesBefore.join(', '));
    
    // 2. Login as member
    console.log('\n2️⃣ Logging in as member...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/member/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bagoespancawiratama@gmail.com',
        password: '12345678'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }
    
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
        console.log('✅ Login successful');
      }
    }
    
    if (!authToken) {
      console.log('❌ No auth token found');
      return;
    }
    
    // 3. Get current member data
    console.log('\n3️⃣ Getting current member data...');
    const memberResponse = await fetch('http://localhost:3000/api/member/biodata', {
      headers: { 'Cookie': authToken }
    });
    
    if (!memberResponse.ok) {
      console.log('❌ Failed to get member data:', memberResponse.status);
      return;
    }
    
    const memberData = await memberResponse.json();
    console.log('👤 Current photo:', memberData.member?.photo || 'No photo');
    
    // 4. Create a test image
    console.log('\n4️⃣ Creating test image...');
    const testImagePath = path.join(__dirname, 'test-upload-verification.jpg');
    const jpegBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xB2, 0xC0,
      0x07, 0xFF, 0xD9
    ]);
    fs.writeFileSync(testImagePath, jpegBuffer);
    
    // 5. Upload new photo
    console.log('\n5️⃣ Uploading new photo...');
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(testImagePath));
    formData.append('name', memberData.member?.name || 'Test User');
    formData.append('email', memberData.member?.email || 'test@test.com');
    formData.append('phoneNumber', memberData.member?.phoneNumber || '081234567890');
    formData.append('address', memberData.member?.address || 'Test Address');
    formData.append('institutionName', memberData.member?.institutionName || 'Test Institution');
    formData.append('workAddress', memberData.member?.workAddress || 'Test Work Address');
    formData.append('postalCode', memberData.member?.postalCode || '12345');
    
    const uploadResponse = await fetch('http://localhost:3000/api/member/biodata', {
      method: 'PUT',
      headers: { 'Cookie': authToken },
      body: formData
    });
    
    console.log('📤 Upload status:', uploadResponse.status);
    
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log('✅ Upload successful');
      console.log('📸 New photo path:', uploadResult.member?.photo);
    } else {
      const errorText = await uploadResponse.text();
      console.log('❌ Upload failed:', errorText);
    }
    
    // 6. Count files after upload
    console.log('\n6️⃣ Counting files after upload...');
    const filesAfter = fs.readdirSync(uploadsDir);
    console.log(`📁 Files after: ${filesAfter.length}`);
    console.log('📋 Files:', filesAfter.join(', '));
    
    // 7. Analysis
    console.log('\n📊 ANALYSIS:');
    console.log(`Files before: ${filesBefore.length}`);
    console.log(`Files after: ${filesAfter.length}`);
    console.log(`Difference: ${filesAfter.length - filesBefore.length}`);
    
    if (filesAfter.length > filesBefore.length) {
      console.log('❌ PROBLEM: Old photos are NOT being deleted!');
      console.log('🔧 New files added:', filesAfter.filter(f => !filesBefore.includes(f)));
    } else if (filesAfter.length === filesBefore.length) {
      console.log('✅ GOOD: File count unchanged (old photo deleted, new photo added)');
    } else {
      console.log('🤔 UNEXPECTED: File count decreased');
    }
    
    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPhotoDeletionVerification().catch(console.error);