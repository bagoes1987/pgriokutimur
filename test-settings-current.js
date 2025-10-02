const fetch = require('node-fetch');

async function testCurrentSettings() {
  console.log('🔍 Testing current settings API...');
  
  try {
    // Step 1: Login as admin
    console.log('🔐 Step 1: Logging in as admin...');
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
    
    const loginData = await loginResponse.json();
    console.log('📋 Login response status:', loginResponse.status);
    console.log('📋 Login response:', loginData);
    
    if (!loginResponse.ok) {
      throw new Error('Login failed: ' + loginData.message);
    }
    
    // Extract cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Received cookies:', cookies);
    
    if (!cookies) {
      throw new Error('No cookies received from login');
    }
    
    // Step 2: Test settings API with cookies
    console.log('🔧 Step 2: Testing settings API with cookies...');
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📋 Settings API response status:', settingsResponse.status);
    console.log('📋 Settings API response headers:', Object.fromEntries(settingsResponse.headers.entries()));
    
    const settingsData = await settingsResponse.json();
    console.log('📋 Settings API response data:', JSON.stringify(settingsData, null, 2));
    
    if (settingsResponse.ok) {
      console.log('✅ Settings API working correctly!');
      console.log('📋 Settings loaded:', settingsData.settings ? 'Yes' : 'No');
    } else {
      console.log('❌ Settings API failed with status:', settingsResponse.status);
    }
    
    // Step 3: Test without cookies (should fail)
    console.log('🔧 Step 3: Testing settings API without cookies (should fail)...');
    const noAuthResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📋 No-auth response status:', noAuthResponse.status);
    const noAuthData = await noAuthResponse.json();
    console.log('📋 No-auth response:', noAuthData);
    
    if (noAuthResponse.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('⚠️ API should require authentication but returned:', noAuthResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCurrentSettings();