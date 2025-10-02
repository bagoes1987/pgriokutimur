const fetch = require('node-fetch');

async function testCleanAuth() {
  try {
    console.log("=== Testing Clean Authentication ===\n");
    
    // 1. Clear any existing sessions by calling logout
    console.log("1. Clearing existing sessions...");
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Logout attempt completed');
    } catch (e) {
      console.log('⚠️  Logout attempt failed (expected if no session)');
    }
    
    // 2. Login fresh as admin
    console.log("\n2. Fresh admin login...");
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
    
    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.status !== 200) {
      console.log("❌ Login failed!");
      const errorText = await loginResponse.text();
      console.log("Error:", errorText);
      return;
    }
    
    // Extract ONLY the new auth token
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
        console.log('✅ Fresh admin login successful');
        console.log('New token (first 50 chars):', authToken.substring(0, 50) + '...');
      }
    }
    
    if (!authToken) {
      console.log("❌ No auth token received!");
      return;
    }
    
    // 3. Test auth check with new token
    console.log("\n3. Testing auth check with fresh token...");
    const authResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Cookie': authToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Auth check status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth check successful');
      console.log('User role:', authData.user?.role);
      console.log('User name:', authData.user?.name);
    } else {
      console.log('❌ Auth check failed');
      const errorText = await authResponse.text();
      console.log('Error:', errorText);
      return;
    }
    
    // 4. Test settings page with clean auth
    console.log("\n4. Testing settings page with clean auth...");
    const pageResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: {
        'Cookie': authToken,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Settings page status:', pageResponse.status);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      console.log('✅ Settings page loads successfully');
      console.log('  - Page length:', html.length);
      console.log('  - Contains "Test Pengaturan Sederhana":', html.includes('Test Pengaturan Sederhana'));
      console.log('  - Contains error:', html.includes('error') || html.includes('Error'));
      
      if (html.includes('Test Pengaturan Sederhana')) {
        console.log('🎉 SUCCESS: Settings page working correctly!');
      } else if (html.includes('error') || html.includes('Error')) {
        console.log('❌ Settings page still has errors');
      } else {
        console.log('⚠️  Settings page content unclear');
      }
    } else {
      console.log('❌ Settings page failed to load');
      console.log('Status:', pageResponse.status);
    }
    
    // 5. Test settings API
    console.log("\n5. Testing settings API...");
    const apiResponse = await fetch('http://localhost:3000/api/admin/settings', {
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json'
      }
    });
    
    console.log('Settings API status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ Settings API working');
      console.log('  - Success:', apiData.success);
      console.log('  - Settings count:', Object.keys(apiData.settings || {}).length);
    } else {
      console.log('❌ Settings API failed');
    }
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testCleanAuth();