const fs = require('fs');

async function testMinimalPage() {
  console.log('=== Testing Minimal Page ===\n');

  try {
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (loginResponse.status !== 200) {
      console.log('❌ Login failed');
      return;
    }

    const cookies = loginResponse.headers.get('set-cookie');
    const authToken = cookies.split(',').find(cookie => cookie.trim().startsWith('auth-token='));
    
    if (!authToken) {
      console.log('❌ No auth token received');
      return;
    }

    console.log('✅ Admin login successful');

    // 2. Test minimal page
    console.log('\n2. Testing minimal page...');
    const pageResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: {
        'Cookie': authToken.trim(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log(`Page status: ${pageResponse.status}`);
    const content = await pageResponse.text();
    console.log(`Page length: ${content.length}`);

    // Save page content
    fs.writeFileSync('minimal-page-content.html', content);
    console.log('Page content saved to minimal-page-content.html');

    // Check for specific content
    const hasMinimalText = content.includes('Test Minimal Page');
    const hasSuccessText = content.includes('Komponen berhasil di-render');
    const hasError = content.includes('404') || content.includes('This page could not be found');
    const hasNextError = content.includes('next-error');

    console.log(`  - Contains "Test Minimal Page": ${hasMinimalText}`);
    console.log(`  - Contains success text: ${hasSuccessText}`);
    console.log(`  - Contains 404 error: ${hasError}`);
    console.log(`  - Contains Next.js error: ${hasNextError}`);

    if (hasMinimalText && hasSuccessText) {
      console.log('✅ Minimal page working correctly');
    } else if (hasError || hasNextError) {
      console.log('❌ Page shows error');
    } else {
      console.log('⚠️  Page loaded but content unclear');
    }

  } catch (error) {
    console.error('Error testing minimal page:', error.message);
  }
}

testMinimalPage();