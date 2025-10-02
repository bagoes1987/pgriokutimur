const fetch = require('node-fetch');

async function testSettingsSimple() {
  try {
    console.log("=== Testing Settings API Simple ===\n");
    
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
    
    console.log('Login status:', loginResponse.status);
    
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
      }
    }
    
    if (!authToken) {
      console.log("❌ No auth token found!");
      return;
    }
    
    // 2. Test Settings API exactly like frontend
    console.log("\n2. Testing Settings API...");
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Settings API Status:', settingsResponse.status);
    console.log('Settings API Headers:', Object.fromEntries(settingsResponse.headers.entries()));
    
    if (settingsResponse.ok) {
      const data = await settingsResponse.json();
      console.log('✅ Settings API Response:');
      console.log('  - Success:', data.success);
      console.log('  - Message:', data.message);
      console.log('  - Has settings:', !!data.settings);
      
      if (data.settings) {
        console.log('  - Settings keys:', Object.keys(data.settings));
        console.log('  - Site name:', data.settings.siteName);
        console.log('  - Contact email:', data.settings.contactEmail);
      }
    } else {
      console.log('❌ Settings API failed');
      const errorText = await settingsResponse.text();
      console.log('Error response:', errorText);
    }
    
    // 3. Test auth/me API
    console.log("\n3. Testing auth/me API...");
    const authResponse = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Auth API Status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth API Response:');
      console.log('  - Success:', authData.success);
      console.log('  - User role:', authData.user?.role);
      console.log('  - User name:', authData.user?.name);
    } else {
      console.log('❌ Auth API failed');
      const errorText = await authResponse.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testSettingsSimple();