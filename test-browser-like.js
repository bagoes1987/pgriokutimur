const fetch = require('node-fetch');

async function testBrowserLike() {
  try {
    console.log("=== Testing Browser-like Request ===\n");
    
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
    
    // 2. Test Settings API with NO credentials (like frontend might be doing)
    console.log("\n2. Testing Settings API WITHOUT credentials...");
    const noCredResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET'
    });
    
    console.log('No credentials status:', noCredResponse.status);
    if (!noCredResponse.ok) {
      const errorText = await noCredResponse.text();
      console.log('No credentials error:', errorText);
    }
    
    // 3. Test Settings API with credentials: 'include' (browser default)
    console.log("\n3. Testing Settings API with credentials include...");
    const credIncludeResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Credentials include status:', credIncludeResponse.status);
    if (credIncludeResponse.ok) {
      const data = await credIncludeResponse.json();
      console.log('✅ With credentials works:', data.success);
    } else {
      const errorText = await credIncludeResponse.text();
      console.log('Credentials include error:', errorText);
    }
    
    // 4. Test with exact browser headers
    console.log("\n4. Testing with exact browser headers...");
    const browserResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': authToken,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'http://localhost:3000/admin/pengaturan',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Browser-like status:', browserResponse.status);
    if (browserResponse.ok) {
      const data = await browserResponse.json();
      console.log('✅ Browser-like works:', data.success);
    } else {
      const errorText = await browserResponse.text();
      console.log('Browser-like error:', errorText);
    }
    
    // 5. Test if there's a CORS issue
    console.log("\n5. Testing CORS headers...");
    const corsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testBrowserLike();