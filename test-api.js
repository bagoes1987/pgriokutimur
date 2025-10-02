const fetch = require('node-fetch');

async function testWithAuth() {
  try {
    console.log('1. Testing admin login...');
    
    // First, login as admin
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
    const loginData = await loginResponse.text();
    console.log('Login response:', loginData);
    
    if (loginResponse.status !== 200) {
      console.error('Login failed!');
      return;
    }
    
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
    
    if (!authToken) {
      console.error('No auth token found in response!');
      return;
    }
    
    console.log('\n2. Testing member update with auth token...');
    
    // Now test the member update API with auth token
    const memberId = 3;
    const testData = {
      name: "Bagus Panca Wiratama, S.Pd., M.Pd.",
      email: "bagoespancawiratama@gmail.com",
      phone: "081234567890",
      gender: "Laki-laki",
      bloodType: "A",
      institutionName: "SMAN 1 Belitang",
      workAddress: "Jl.M.P Bangsa Raja No.1001",
      rank: "Guru",
      hasEducatorCert: true,
      subjects: "EKONOMI"
    };
    
    const updateResponse = await fetch(`http://localhost:3000/api/admin/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authToken
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Update status:', updateResponse.status);
    const updateData = await updateResponse.text();
    console.log('Update response:', updateData);
    
    if (updateResponse.status === 200) {
      console.log('\n✅ Member update successful!');
    } else {
      console.log('\n❌ Member update failed!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testWithAuth();