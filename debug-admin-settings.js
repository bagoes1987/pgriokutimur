const puppeteer = require('puppeteer');

async function debugAdminSettings() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a cookie to simulate being logged in
    await page.setCookie({
      name: 'auth-token',
      value: 'dummy-token-for-testing',
      domain: 'localhost',
      path: '/'
    });
    
    // Monitor network requests
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('/api/admin/profile')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
        console.log('🔄 API Request:', request.method(), request.url());
        console.log('🍪 Request Headers:', JSON.stringify(request.headers(), null, 2));
      }
    });

    // Monitor network responses
    page.on('response', async response => {
      if (response.url().includes('/api/admin/profile')) {
        console.log('📡 API Response:', response.status(), response.url());
        try {
          const responseBody = await response.text();
          console.log('📄 Response Body:', responseBody);
        } catch (error) {
          console.log('❌ Error reading response body:', error.message);
        }
      }
    });

    // Monitor console messages
    page.on('console', msg => {
      if (msg.text().includes('Error') || msg.text().includes('error') || msg.text().includes('Failed')) {
        console.log('🖥️ Console Error:', msg.text());
      }
    });

    // Monitor page errors
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    console.log('🔧 Navigating directly to admin settings page...');
    await page.goto('http://localhost:3000/admin/settings');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if we're redirected to login
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('🔐 Redirected to login page - authentication required');
      
      // Try to login
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.type('input[type="email"]', 'admin@pgriokutimur.org');
      await page.type('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Wait for redirect
       await new Promise(resolve => setTimeout(resolve, 3000));
       
       // Navigate to settings again
       await page.goto('http://localhost:3000/admin/settings');
       await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Check page content
    try {
      const pageTitle = await page.$eval('h1', el => el.textContent);
      console.log('📄 Page Title:', pageTitle);
    } catch (error) {
      console.log('❌ Could not find h1 element');
    }

    // Check if loading state is visible
    const loadingElements = await page.$$('[data-testid="loading"], .loading, .spinner');
    console.log('⏳ Loading elements found:', loadingElements.length);

    // Check for error messages or toasts
    const errorElements = await page.$$('.error, [role="alert"], .toast-error, .Toastify__toast--error');
    console.log('❌ Error elements found:', errorElements.length);

    // Check all input fields and their values
    const allInputs = await page.$$('input');
    console.log('📝 Total input fields found:', allInputs.length);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const value = await input.evaluate(el => el.value);
      const placeholder = await input.evaluate(el => el.placeholder);
      const type = await input.evaluate(el => el.type);
      const name = await input.evaluate(el => el.name);
      
      console.log(`📝 Input ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}", value="${value}"`);
    }

    // Check for specific profile fields
    const profileFields = [
      'input[name="name"]',
      'input[name="email"]', 
      'input[name="phone"]',
      'input[placeholder*="nama"]',
      'input[placeholder*="email"]',
      'input[placeholder*="telepon"]'
    ];

    for (const selector of profileFields) {
      try {
        const element = await page.$(selector);
        if (element) {
          const value = await element.evaluate(el => el.value);
          console.log(`✅ Found field ${selector}: "${value}"`);
        }
      } catch (error) {
        // Field not found, continue
      }
    }

    console.log('\n📊 Summary:');
    console.log('- API Requests made:', requests.length);
    console.log('- Current URL:', page.url());
    console.log('- Page analysis complete');

    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await browser.close();
  }
}

debugAdminSettings().catch(console.error);