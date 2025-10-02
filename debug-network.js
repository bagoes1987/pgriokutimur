const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Monitor network requests
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
      console.log(`📤 REQUEST: ${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
      console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
    });
    
    // Monitor console messages
    page.on('console', msg => {
      console.log(`🖥️ CONSOLE: ${msg.type()}: ${msg.text()}`);
    });
    
    // Monitor page errors
    page.on('pageerror', error => {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    });
    
    console.log('🔐 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Click admin tab
    console.log('🔄 Switching to admin login...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminButton = buttons.find(button => button.textContent.includes('Login Admin'));
      if (adminButton) adminButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fill login form
    console.log('📝 Filling login form...');
    await page.type('input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'admin123');
    
    // Submit form
    console.log('🚀 Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Current URL after login:', page.url());
    
    // Navigate to settings
    console.log('🔧 Navigating to settings...');
    await page.goto('http://localhost:3000/admin/pengaturan');
    
    // Wait for page to load and monitor network activity
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for specific API calls
    const settingsRequests = requests.filter(req => req.url.includes('/api/admin/settings'));
    const settingsResponses = responses.filter(res => res.url.includes('/api/admin/settings'));
    
    console.log('\n📊 NETWORK ANALYSIS:');
    console.log('Settings API Requests:', settingsRequests.length);
    settingsRequests.forEach((req, i) => {
      console.log(`  Request ${i + 1}:`, {
        method: req.method,
        url: req.url,
        hasAuthCookie: req.headers.cookie ? req.headers.cookie.includes('auth-token') : false
      });
    });
    
    console.log('Settings API Responses:', settingsResponses.length);
    settingsResponses.forEach((res, i) => {
      console.log(`  Response ${i + 1}:`, {
        status: res.status,
        url: res.url
      });
    });
    
    // Check current page state
    const pageState = await page.evaluate(() => {
      const siteNameInput = document.querySelector('input[name="siteName"]');
      const errorToast = document.querySelector('[role="alert"]');
      const loadingElement = document.querySelector('[data-loading="true"]');
      
      return {
        siteNameExists: !!siteNameInput,
        siteNameValue: siteNameInput ? siteNameInput.value : '',
        hasErrorToast: !!errorToast,
        errorToastText: errorToast ? errorToast.textContent : '',
        hasLoadingElement: !!loadingElement,
        cookies: document.cookie
      };
    });
    
    console.log('\n📋 PAGE STATE:');
    console.log('Site Name Input:', pageState.siteNameExists ? `"${pageState.siteNameValue}"` : 'NOT FOUND');
    console.log('Error Toast:', pageState.hasErrorToast ? pageState.errorToastText : 'NONE');
    console.log('Loading Element:', pageState.hasLoadingElement ? 'PRESENT' : 'NONE');
    console.log('Cookies:', pageState.cookies);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();