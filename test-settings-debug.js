const fetch = require('node-fetch');

async function testSettingsAPI() {
  try {
    console.log("=== Testing Settings API ===\n");
    
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
      const errorText = await loginResponse.text();
      console.log("Error:", errorText);
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
        console.log('Token:', authToken.substring(0, 50) + '...');
      }
    }
    
    if (!authToken) {
      console.log("❌ No auth token found!");
      return;
    }
    
    // 2. Test Settings API
    console.log("\n2. Testing Settings API...");
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json',
        'User-Agent': 'Node.js Test Script'
      }
    });
    
    console.log('Settings API Status:', settingsResponse.status);
    console.log('Settings API Headers:', Object.fromEntries(settingsResponse.headers.entries()));
    
    if (settingsResponse.ok) {
      const data = await settingsResponse.json();
      console.log('✅ Settings API Response:');
      console.log('  - Success:', data.success);
      console.log('  - Message:', data.message);
      console.log('  - Settings keys:', Object.keys(data.settings || {}));
      console.log('  - Sample settings:');
      if (data.settings) {
        console.log('    - siteName:', data.settings.siteName);
        console.log('    - siteDescription:', data.settings.siteDescription);
        console.log('    - contactEmail:', data.settings.contactEmail);
      }
    } else {
      console.log('❌ Settings API failed');
      const errorText = await settingsResponse.text();
      console.log('Error response:', errorText);
    }
    
    // 3. Test with different headers
    console.log("\n3. Testing with browser-like headers...");
    const browserResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Browser-like request status:', browserResponse.status);
    if (browserResponse.ok) {
      const data = await browserResponse.json();
      console.log('✅ Browser-like request successful');
      console.log('  - Response structure:', Object.keys(data));
    } else {
      console.log('❌ Browser-like request failed');
      const errorText = await browserResponse.text();
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testSettingsAPI();