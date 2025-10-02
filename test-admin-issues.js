const fetch = require('node-fetch');

async function testAdminIssues() {
  try {
    console.log("=== Testing Admin Issues ===\n");
    
    // 1. Login as admin
    console.log("1. Logging in as admin...");
    const loginResponse = await fetch('http://localhost:3000/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    
    // 2. Extract auth-token cookie
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
      console.log("❌ No auth token found!");
      return;
    }
    
    // 3. Test Settings API
    console.log("\n2. Testing Settings API...");
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Settings API Status:', settingsResponse.status);
    console.log('Content-Type:', settingsResponse.headers.get('content-type'));
    
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings API working correctly');
      console.log('Settings data keys:', Object.keys(settingsData.settings || {}));
    } else {
      console.log('❌ Settings API Error:', await settingsResponse.text());
    }
    
    // 4. Test Officers API
    console.log("\n3. Testing Officers API...");
    const officersResponse = await fetch('http://localhost:3000/api/admin/officers', {
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Officers API Status:', officersResponse.status);
    console.log('Content-Type:', officersResponse.headers.get('content-type'));
    
    if (officersResponse.ok) {
      const officersData = await officersResponse.json();
      console.log('✅ Officers API working correctly');
      console.log('Officers count:', officersData.officers?.length || 0);
    } else {
      console.log('❌ Officers API Error:', await officersResponse.text());
    }
    
    // 5. Test page accessibility
    console.log("\n4. Testing page accessibility...");
    
    // Test pengurus page
    const pengurusPageResponse = await fetch('http://localhost:3000/admin/pengurus', {
      headers: {
        'Cookie': authToken
      }
    });
    console.log('Pengurus page status:', pengurusPageResponse.status);
    
    // Test pengaturan page
    const pengaturanPageResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: {
        'Cookie': authToken
      }
    });
    console.log('Pengaturan page status:', pengaturanPageResponse.status);
    
    if (pengurusPageResponse.status === 200 && pengaturanPageResponse.status === 200) {
      console.log('✅ Both pages are accessible');
    } else {
      console.log('❌ Some pages are not accessible');
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAdminIssues();