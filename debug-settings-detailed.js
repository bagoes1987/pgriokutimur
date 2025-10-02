const puppeteer = require('puppeteer');

async function debugSettingsDetailed() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable request interception to log all network requests
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      console.log(`🔄 REQUEST: ${request.method()} ${request.url()}`);
      if (request.url().includes('/api/admin/settings')) {
        console.log('📋 Headers:', request.headers());
        console.log('📋 Post Data:', request.postData());
      }
      request.continue();
    });
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/settings')) {
        console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
        console.log('📋 Response Headers:', response.headers());
        try {
          const text = await response.text();
          console.log('📋 Response Body:', text);
        } catch (e) {
          console.log('❌ Could not read response body');
        }
      }
    });
    
    // Listen for console messages from the page
    page.on('console', (msg) => {
      console.log(`🖥️ BROWSER CONSOLE [${msg.type()}]:`, msg.text());
    });
    
    // Listen for page errors
    page.on('pageerror', (error) => {
      console.log(`❌ PAGE ERROR:`, error.message);
    });
    
    console.log('🔐 Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Login
    console.log('📝 Filling login form...');
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'admin123');
    
    console.log('🚀 Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login successful, current URL:', page.url());
    
    // Navigate to settings page
    console.log('🔧 Navigating to settings page...');
    await page.goto('http://localhost:3000/admin/pengaturan', { waitUntil: 'networkidle2' });
    
    // Wait a bit for the page to load and make API calls
    console.log('⏳ Waiting for page to load and API calls...');
    await page.waitForTimeout(5000);
    
    // Check for error messages
    const errorElements = await page.$$eval('.Toastify__toast--error, [class*="error"], [class*="toast"]', 
      elements => elements.map(el => el.textContent)
    );
    
    if (errorElements.length > 0) {
      console.log('❌ Found error messages:', errorElements);
    } else {
      console.log('✅ No error messages found');
    }
    
    // Check if form fields are populated
    const siteNameValue = await page.$eval('input[name="siteName"]', el => el.value).catch(() => '');
    console.log('📋 Site name field value:', siteNameValue);
    
    // Check loading state
    const isLoading = await page.$('.loading, [class*="loading"]') !== null;
    console.log('⏳ Page loading state:', isLoading);
    
    // Get all cookies
    const cookies = await page.cookies();
    console.log('🍪 Current cookies:', cookies.map(c => `${c.name}=${c.value}`));
    
    console.log('🔍 Debug completed. Check the logs above for details.');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugSettingsDetailed().catch(console.error);