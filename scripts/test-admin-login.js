const http = require('http');

// Function to make HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testAdminLogin() {
  try {
    console.log('1. Testing admin login...');
    
    // Login as admin
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const loginResponse = await makeRequest(loginOptions, loginData);
    console.log('Login Status:', loginResponse.statusCode);
    console.log('Login Response:', loginResponse.data);

    if (loginResponse.statusCode === 200) {
      // Extract cookie from response
      const setCookieHeader = loginResponse.headers['set-cookie'];
      let authToken = '';
      
      if (setCookieHeader) {
        const cookieString = setCookieHeader.find(cookie => cookie.includes('auth-token'));
        if (cookieString) {
          authToken = cookieString.split(';')[0];
          console.log('Auth Token:', authToken);
        }
      }

      console.log('\n2. Testing member API with auth token...');
      
      // Test member API with auth token
      const memberOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/members?page=1&limit=10',
        method: 'GET',
        headers: {
          'Cookie': authToken
        }
      };

      const memberResponse = await makeRequest(memberOptions);
      console.log('Member API Status:', memberResponse.statusCode);
      console.log('Member API Response:', memberResponse.data);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminLogin();