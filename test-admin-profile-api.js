const fetch = require('node-fetch');

async function testAdminProfileAPI() {
  try {
    console.log('🔍 Testing /api/admin/profile endpoint...');
    
    // Test without authentication
    console.log('\n1. Testing without authentication:');
    const response1 = await fetch('http://localhost:3000/api/admin/profile');
    console.log('Status:', response1.status);
    const data1 = await response1.text();
    console.log('Response:', data1);
    
    // Test with dummy token
    console.log('\n2. Testing with dummy token:');
    const response2 = await fetch('http://localhost:3000/api/admin/profile', {
      headers: {
        'Cookie': 'auth-token=dummy-token'
      }
    });
    console.log('Status:', response2.status);
    const data2 = await response2.text();
    console.log('Response:', data2);
    
    // Test with admin credentials (login first)
    console.log('\n3. Testing with proper authentication:');
    
    // First, login to get a valid token
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
    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.ok) {
      // Extract cookie from response headers
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      console.log('Set-Cookie header:', setCookieHeader);
      
      let authToken = null;
      if (setCookieHeader) {
        const tokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
        if (tokenMatch) {
          authToken = tokenMatch[1];
          console.log('Extracted auth token:', authToken);
        }
      }
      
      if (authToken) {
        // Now test the profile API with the valid token
        const response3 = await fetch('http://localhost:3000/api/admin/profile', {
          headers: {
            'Cookie': `auth-token=${authToken}`
          }
        });
        
        console.log('Profile API status:', response3.status);
        const data3 = await response3.text();
        console.log('Profile API response:', data3);
      } else {
        console.log('❌ Could not extract auth token from cookies');
      }
    } else {
      console.log('❌ Login failed, cannot test with valid token');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAdminProfileAPI();