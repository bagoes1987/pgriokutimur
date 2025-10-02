const fs = require('fs');
const path = require('path');

async function testPhotoUpload() {
    console.log('🔍 Testing photo upload functionality...\n');
    
    // Check uploads directory
    const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
    console.log('📁 Checking uploads directory:', uploadsDir);
    
    if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log('✅ Uploads directory exists');
        console.log('📄 Files in directory:', files.length);
        
        if (files.length > 0) {
            console.log('📋 Recent files:');
            files.slice(-5).forEach(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${stats.size} bytes, ${stats.mtime.toISOString()})`);
            });
        } else {
            console.log('⚠️  No files found in uploads directory');
        }
    } else {
        console.log('❌ Uploads directory does not exist');
        console.log('🔧 Creating uploads directory...');
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('✅ Uploads directory created');
    }
    
    // Test API endpoint availability
    console.log('\n🌐 Testing API endpoint...');
    try {
        const response = await fetch('http://localhost:3000/api/admin/members');
        console.log(`📡 API Status: ${response.status}`);
        
        if (response.status === 401) {
            console.log('🔐 API requires authentication (expected)');
        } else if (response.ok) {
            console.log('✅ API is accessible');
        } else {
            console.log('⚠️  API returned unexpected status');
        }
    } catch (error) {
        console.log('❌ API endpoint not accessible:', error.message);
    }
    
    // Check if server is running
    console.log('\n🖥️  Checking if development server is running...');
    try {
        const response = await fetch('http://localhost:3000');
        if (response.ok) {
            console.log('✅ Development server is running');
        } else {
            console.log('⚠️  Server responded with status:', response.status);
        }
    } catch (error) {
        console.log('❌ Development server is not accessible');
        console.log('💡 Make sure to run: npm run dev');
    }
    
    console.log('\n📋 Summary:');
    console.log('1. Check if uploads directory exists and is writable');
    console.log('2. Verify API endpoints are accessible');
    console.log('3. Ensure development server is running');
    console.log('4. Test photo upload through browser manually');
    console.log('\n🎯 Next steps:');
    console.log('1. Open http://localhost:3000/admin/anggota');
    console.log('2. Login as admin');
    console.log('3. Edit a member and upload a photo');
    console.log('4. Check console for timestamp logs');
    console.log('5. Verify photo changes immediately');
}

testPhotoUpload().catch(console.error);