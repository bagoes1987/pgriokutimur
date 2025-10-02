const puppeteer = require('puppeteer');

async function testSimpleBrowser() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: false
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🔐 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Click admin tab
    console.log('🔄 Switching to admin login...');
    const adminTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent.includes('Login Admin'));
    });
    if (adminTab) {
      await adminTab.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Fill login form
    console.log('📝 Filling login form...');
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'admin123');
    
    // Submit
    console.log('🚀 Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Current URL after login:', page.url());
    
    // Navigate to settings
    console.log('🔧 Navigating to settings...');
    await page.goto('http://localhost:3000/admin/pengaturan');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for errors
    const hasErrors = await page.evaluate(() => {
      const errorToasts = document.querySelectorAll('.Toastify__toast--error');
      return errorToasts.length > 0;
    });
    
    // Check if form is populated
    const formData = await page.evaluate(() => {
      const siteNameInput = document.querySelector('input[name="siteName"]');
      return {
        siteNameExists: !!siteNameInput,
        siteNameValue: siteNameInput?.value || '',
        hasData: (siteNameInput?.value || '').length > 0
      };
    });
    
    console.log('📋 Results:');
    console.log('- Has errors:', hasErrors);
    console.log('- Form data:', formData);
    
    if (!hasErrors && formData.hasData) {
      console.log('✅ SUCCESS: Settings page is working correctly!');
    } else {
      console.log('❌ ISSUE: Settings page still has problems');
    }
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser kept open for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testSimpleBrowser().catch(console.error);