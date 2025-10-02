const fetch = require('node-fetch');

async function testFrontendSettings() {
  try {
    console.log("=== Testing Frontend Settings Behavior ===\n");
    
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
    
    // 2. Test settings page HTML
    console.log("\n2. Testing settings page HTML...");
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
      console.log('  - Contains "Pengaturan":', html.includes('Pengaturan'));
      console.log('  - Contains "fetchSettings":', html.includes('fetchSettings'));
      console.log('  - Contains error handling:', html.includes('toast.error'));
    } else {
      console.log('❌ Page failed to load');
    }
    
    // 3. Simulate frontend API call exactly as browser would
    console.log("\n3. Simulating frontend API call...");
    const frontendApiResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Referer': 'http://localhost:3000/admin/pengaturan',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Frontend API response status:', frontendApiResponse.status);
    console.log('Frontend API response headers:', Object.fromEntries(frontendApiResponse.headers.entries()));
    
    if (frontendApiResponse.ok) {
      const data = await frontendApiResponse.json();
      console.log('✅ Frontend API call successful');
      console.log('  - Response structure:', Object.keys(data));
      console.log('  - Success field:', data.success);
      console.log('  - Has settings:', !!data.settings);
      console.log('  - Settings keys count:', Object.keys(data.settings || {}).length);
      
      // Check if response matches expected structure
      if (data.success && data.settings) {
        console.log('✅ Response structure is correct');
        console.log('  - Sample settings:');
        console.log('    - siteName:', data.settings.siteName);
        console.log('    - contactEmail:', data.settings.contactEmail);
      } else {
        console.log('❌ Response structure is incorrect');
        console.log('  - Expected: { success: true, settings: {...} }');
        console.log('  - Received:', data);
      }
    } else {
      console.log('❌ Frontend API call failed');
      const errorText = await frontendApiResponse.text();
      console.log('Error response:', errorText);
    }
    
    // 4. Test with different scenarios
    console.log("\n4. Testing edge cases...");
    
    // Test without auth
    const noAuthResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('No auth response status:', noAuthResponse.status);
    
    // Test with invalid auth
    const invalidAuthResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': 'auth-token=invalid',
        'Accept': 'application/json'
      }
    });
    console.log('Invalid auth response status:', invalidAuthResponse.status);
    
    console.log("\n=== Diagnosis ===");
    console.log("If the API works but frontend shows error:");
    console.log("1. Check browser console for JavaScript errors");
    console.log("2. Verify authentication state in browser");
    console.log("3. Check if toast notifications are working");
    console.log("4. Clear browser cache and cookies");
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testFrontendSettings();