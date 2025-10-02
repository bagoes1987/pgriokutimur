const puppeteer = require('puppeteer');

async function debugFrontendIssue() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', (msg) => {
      console.log(`🖥️ BROWSER [${msg.type()}]:`, msg.text());
    });
    
    // Enable error logging
    page.on('pageerror', (error) => {
      console.log(`❌ PAGE ERROR:`, error.message);
    });
    
    // Track network requests
    const requests = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/admin/settings')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          timestamp: Date.now()
        });
        console.log(`🔄 API REQUEST: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/settings')) {
        console.log(`📥 API RESPONSE: ${response.status()} ${response.url()}`);
        try {
          const text = await response.text();
          console.log(`📋 Response body:`, text);
        } catch (e) {
          console.log('❌ Could not read response body');
        }
      }
    });
    
    console.log('🔐 Step 1: Navigate to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Switch to admin login mode
    console.log('🔄 Step 2: Switch to admin login mode...');
    await page.click('button:has-text("Login Admin")');
    await page.waitForTimeout(1000);
    
    // Login
    console.log('📝 Step 3: Fill login form...');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    
    console.log('🚀 Step 4: Submit login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login successful, current URL:', page.url());
    
    // Navigate to settings page
    console.log('🔧 Step 5: Navigate to settings page...');
    await page.goto('http://localhost:3000/admin/pengaturan', { waitUntil: 'networkidle2' });
    
    // Wait for page to load
    console.log('⏳ Step 6: Wait for page to load...');
    await page.waitForTimeout(3000);
    
    // Check for error messages
    console.log('🔍 Step 7: Check for error messages...');
    const errorMessages = await page.evaluate(() => {
      const errors = [];
      
      // Check for toast errors
      const toasts = document.querySelectorAll('.Toastify__toast--error, [class*="error"]');
      toasts.forEach(toast => {
        errors.push({
          type: 'toast',
          text: toast.textContent?.trim()
        });
      });
      
      // Check console errors (if any are displayed)
      const consoleErrors = document.querySelectorAll('[class*="console-error"]');
      consoleErrors.forEach(error => {
        errors.push({
          type: 'console',
          text: error.textContent?.trim()
        });
      });
      
      return errors;
    });
    
    console.log('📋 Error messages found:', errorMessages);
    
    // Check form state
    console.log('🔍 Step 8: Check form state...');
    const formState = await page.evaluate(() => {
      const siteNameInput = document.querySelector('input[name="siteName"]');
      const loadingElements = document.querySelectorAll('[class*="loading"], .loading');
      
      return {
        siteNameValue: siteNameInput?.value || 'NOT_FOUND',
        siteNameExists: !!siteNameInput,
        loadingElements: loadingElements.length,
        hasData: siteNameInput?.value?.length > 0
      };
    });
    
    console.log('📋 Form state:', formState);
    
    // Check cookies
    console.log('🔍 Step 9: Check cookies...');
    const cookies = await page.cookies();
    const authCookie = cookies.find(c => c.name === 'auth-token');
    console.log('🍪 Auth cookie exists:', !!authCookie);
    if (authCookie) {
      console.log('🍪 Auth cookie value:', authCookie.value.substring(0, 20) + '...');
    }
    
    // Manual API test from browser
    console.log('🔍 Step 10: Manual API test from browser...');
    const apiTestResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        return {
          status: response.status,
          ok: response.ok,
          data: data,
          success: data.success,
          hasSettings: !!data.settings
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    });
    
    console.log('📋 Manual API test result:', apiTestResult);
    
    console.log('✅ Debug completed. Summary:');
    console.log('- API requests made:', requests.length);
    console.log('- Error messages:', errorMessages.length);
    console.log('- Form has data:', formState.hasData);
    console.log('- Manual API test successful:', apiTestResult.ok);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('🔍 Browser kept open for manual inspection. Close manually when done.');
    // await browser.close();
  }
}

debugFrontendIssue().catch(console.error);