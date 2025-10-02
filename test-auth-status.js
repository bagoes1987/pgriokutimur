const fetch = require('node-fetch');

async function testAuthStatus() {
  console.log('=== Testing Authentication Status ===\n');
  
  try {
    // 1. Test login
    console.log('1. Testing login...');
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
    
    console.log('Login status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    
    // Extract cookies
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let cookies = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        cookies = `auth-token=${match[1]}`;
      }
    }
    console.log('Cookies received:', cookies ? 'Yes' : 'No');
    
    // 2. Test auth check endpoint
    console.log('\n2. Testing auth check...');
    const authResponse = await fetch('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Auth check status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth check successful');
      console.log('User data:', authData);
    } else {
      console.error('❌ Auth check failed');
      const errorText = await authResponse.text();
      console.log('Error:', errorText);
    }
    
    // 3. Test settings API with auth
    console.log('\n3. Testing settings API with auth...');
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Settings API status:', settingsResponse.status);
    
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings API successful');
      console.log('Settings structure:', {
        success: settingsData.success,
        hasSettings: !!settingsData.settings,
        settingsCount: settingsData.settings ? Object.keys(settingsData.settings).length : 0
      });
    } else {
      console.error('❌ Settings API failed');
      const errorText = await settingsResponse.text();
      console.log('Error:', errorText);
    }
    
    // 4. Test without auth
    console.log('\n4. Testing settings API without auth...');
    const noAuthResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('No auth status:', noAuthResponse.status);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthStatus();