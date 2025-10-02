const fetch = require('node-fetch');

async function testMemberAuth() {
  try {
    console.log('=== Testing Member Authentication ===\n');
    
    // Test 1: Try to access biodata without login
    console.log('1. Testing biodata API without authentication...');
    const biodataResponse1 = await fetch('http://localhost:3000/api/member/biodata');
    console.log('Status:', biodataResponse1.status);
    const biodataData1 = await biodataResponse1.text();
    console.log('Response:', biodataData1);
    console.log('');
    
    // Test 2: Login with member credentials (correct password)
    console.log('2. Testing member login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/member/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'bagoespancawiratama@gmail.com',
        password: '12345678'
      })
    });
    
    console.log('Login Status:', loginResponse.status);
    const loginData = await loginResponse.text();
    console.log('Login Response:', loginData);
    
    // Extract auth-token cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
        console.log('Extracted auth token:', authToken);
      }
    }
    console.log('');
    
    if (loginResponse.status === 200 && authToken) {
      // Test 3: Try to access biodata with auth token
      console.log('3. Testing biodata API with authentication...');
      const biodataResponse2 = await fetch('http://localhost:3000/api/member/biodata', {
        headers: {
          'Cookie': authToken
        }
      });
      
      console.log('Status:', biodataResponse2.status);
      const biodataData2 = await biodataResponse2.text();
      console.log('Response:', biodataData2);
      
      if (biodataResponse2.status === 200) {
        console.log('\n✅ Member authentication working correctly!');
        console.log('✅ Dashboard should show real data, not demo data!');
      } else {
        console.log('\n❌ Member authentication failed after login!');
      }
    } else {
      console.log('\n❌ Member login failed!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testMemberAuth();