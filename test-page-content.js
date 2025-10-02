const fetch = require('node-fetch');
const fs = require('fs');

async function testPageContent() {
  try {
    console.log("=== Testing Page Content ===\n");
    
    // 1. Login as admin
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
    
    // 2. Get page content
    console.log("\n2. Getting page content...");
    const pageResponse = await fetch('http://localhost:3000/admin/pengaturan', {
      headers: {
        'Cookie': authToken,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Page status:', pageResponse.status);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      
      // Save to file for inspection
      fs.writeFileSync('page-content.html', html);
      console.log('✅ Page content saved to page-content.html');
      
      // Analyze content
      console.log('\n3. Analyzing content...');
      console.log('  - Total length:', html.length);
      console.log('  - Contains <html>:', html.includes('<html>'));
      console.log('  - Contains <body>:', html.includes('<body>'));
      console.log('  - Contains "Test Pengaturan Sederhana":', html.includes('Test Pengaturan Sederhana'));
      console.log('  - Contains "Application error":', html.includes('Application error'));
      console.log('  - Contains "500":', html.includes('500'));
      console.log('  - Contains "Error":', html.includes('Error'));
      console.log('  - Contains "AdminLayout":', html.includes('AdminLayout'));
      
      // Extract error messages
      const errorMatches = html.match(/error[^<>]*|Error[^<>]*/gi);
      if (errorMatches) {
        console.log('\n4. Found error patterns:');
        errorMatches.slice(0, 5).forEach((match, i) => {
          console.log(`  ${i + 1}. ${match}`);
        });
      }
      
      // Look for specific error indicators
      if (html.includes('Internal Server Error')) {
        console.log('\n❌ Internal Server Error detected');
      } else if (html.includes('Application error')) {
        console.log('\n❌ Application error detected');
      } else if (html.includes('Test Pengaturan Sederhana')) {
        console.log('\n✅ Page rendered correctly');
      } else {
        console.log('\n⚠️  Page content unclear - check page-content.html');
      }
      
    } else {
      console.log('❌ Failed to get page content');
      const errorText = await pageResponse.text();
      console.log('Error:', errorText.substring(0, 500));
    }
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

testPageContent();