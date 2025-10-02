const fetch = require('node-fetch');

async function testSimpleSettings() {
  try {
    console.log("=== Testing Simple Settings Page ===\n");
    
    // 1. Login first
    console.log("1. Logging in as admin...");
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
      console.log("❌ Login failed!");
      return;
    }
    
    // Extract auth token
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
        console.log('✅ Login successful');
      }
    }
    
    // 2. Test simple settings page
    console.log("\n2. Testing simple settings page...");
    const pageResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: {
        'Cookie': authToken,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Page response status:', pageResponse.status);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      console.log('✅ Page loads successfully');
      console.log('  - Page length:', html.length);
      console.log('  - Contains "Test Pengaturan Sederhana":', html.includes('Test Pengaturan Sederhana'));
      console.log('  - Contains "Data Pengaturan":', html.includes('Data Pengaturan'));
      console.log('  - Contains error:', html.includes('error') || html.includes('Error'));
      
      // Check for specific error patterns
      if (html.includes('Application error')) {
        console.log('❌ Application error detected in page');
      } else if (html.includes('500')) {
        console.log('❌ Server error detected in page');
      } else if (html.includes('Test Pengaturan Sederhana')) {
        console.log('✅ Simple settings page rendered correctly');
      } else {
        console.log('⚠️  Page loaded but content unclear');
      }
    } else {
      console.log('❌ Page failed to load');
      const errorText = await pageResponse.text();
      console.log('Error response:', errorText.substring(0, 500));
    }
    
    // 3. Test API directly
    console.log("\n3. Testing settings API directly...");
    const apiResponse = await fetch('http://localhost:3000/api/admin/settings', {
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json'
      }
    });
    
    console.log('API response status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ API works correctly');
      console.log('  - Success:', apiData.success);
      console.log('  - Settings count:', Object.keys(apiData.settings || {}).length);
    } else {
      console.log('❌ API failed');
    }
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testSimpleSettings();