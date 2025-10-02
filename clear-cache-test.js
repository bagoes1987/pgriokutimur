const fetch = require('node-fetch');

async function clearCacheAndTest() {
  try {
    console.log("=== Clear Cache and Test ===\n");
    
    // 1. Login as admin
    console.log("1. Fresh login as admin...");
    const loginResponse = await fetch('http://localhost:3000/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (loginResponse.status !== 200) {
      console.log("❌ Login failed!");
      const errorText = await loginResponse.text();
      console.log("Error:", errorText);
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
    
    // 3. Test direct API calls with fresh headers
    console.log("\n2. Testing APIs with fresh headers...");
    
    const headers = {
      'Cookie': authToken,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Accept': 'application/json'
    };
    
    // Test Settings API
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      headers: headers
    });
    
    console.log('Settings API Status:', settingsResponse.status);
    if (settingsResponse.ok) {
      const data = await settingsResponse.json();
      console.log('✅ Settings API: OK');
      console.log('   - Success:', data.success);
      console.log('   - Settings keys count:', Object.keys(data.settings || {}).length);
    } else {
      console.log('❌ Settings API failed');
      console.log('   - Error:', await settingsResponse.text());
    }
    
    // Test Officers API
    const officersResponse = await fetch('http://localhost:3000/api/admin/officers', {
      headers: headers
    });
    
    console.log('\nOfficers API Status:', officersResponse.status);
    if (officersResponse.ok) {
      const data = await officersResponse.json();
      console.log('✅ Officers API: OK');
      console.log('   - Success:', data.success);
      console.log('   - Officers count:', data.officers?.length || 0);
    } else {
      console.log('❌ Officers API failed');
      console.log('   - Error:', await officersResponse.text());
    }
    
    // 4. Test page rendering
    console.log("\n3. Testing page rendering...");
    
    const pageHeaders = {
      'Cookie': authToken,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };
    
    // Test pengurus page
    const pengurusResponse = await fetch('http://localhost:3000/admin/pengurus', {
      headers: pageHeaders
    });
    
    console.log('Pengurus page status:', pengurusResponse.status);
    if (pengurusResponse.ok) {
      const html = await pengurusResponse.text();
      const hasContent = html.includes('Kelola Pengurus') || html.includes('pengurus');
      console.log('✅ Pengurus page loads, has content:', hasContent);
    } else {
      console.log('❌ Pengurus page failed to load');
    }
    
    // Test pengaturan page
    const pengaturanResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: pageHeaders
    });
    
    console.log('Pengaturan page status:', pengaturanResponse.status);
    if (pengaturanResponse.ok) {
      const html = await pengaturanResponse.text();
      const hasContent = html.includes('Pengaturan') || html.includes('settings');
      console.log('✅ Pengaturan page loads, has content:', hasContent);
    } else {
      console.log('❌ Pengaturan page failed to load');
    }
    
    console.log("\n=== Test Complete ===");
    console.log("If you're still experiencing issues:");
    console.log("1. Clear your browser cache completely");
    console.log("2. Try incognito/private browsing mode");
    console.log("3. Check browser console for JavaScript errors");
    console.log("4. Ensure you're logged in as admin");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

clearCacheAndTest();