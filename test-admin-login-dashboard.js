const fetch = require('node-fetch');

async function testAdminLoginAndDashboard() {
  try {
    console.log("=== Testing Admin Login and Dashboard ===\n");
    
    // 1. Login as admin
    console.log("1. Logging in as admin...");
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
    
    console.log('Login Status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.status !== 200) {
      console.log("❌ Login failed!");
      return;
    }
    
    // 2. Extract auth-token cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('\nSet-Cookie header:', setCookieHeader);
    
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
        console.log('✅ Extracted auth token:', authToken.substring(0, 50) + '...');
      }
    }
    
    if (!authToken) {
      console.log("❌ No auth token found in response!");
      return;
    }
    
    // 3. Test dashboard API with auth token
    console.log("\n2. Testing dashboard API with auth token...");
    const dashboardResponse = await fetch('http://localhost:3000/api/admin/dashboard', {
      headers: {
        'Cookie': authToken
      }
    });
    
    console.log('Dashboard API Status:', dashboardResponse.status);
    
    if (!dashboardResponse.ok) {
      console.log('Dashboard API Error:', await dashboardResponse.text());
      return;
    }
    
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard API Response:');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    // 4. Summary
    console.log("\n=== Summary ===");
    console.log(`Total Members: ${dashboardData.totalMembers}`);
    console.log(`Approved Members: ${dashboardData.approvedMembers}`);
    console.log(`Pending Members: ${dashboardData.pendingMembers}`);
    console.log(`Total Officers: ${dashboardData.totalOfficers}`);
    console.log(`Total News: ${dashboardData.totalNews}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAdminLoginAndDashboard();