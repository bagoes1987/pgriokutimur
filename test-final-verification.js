const puppeteer = require('puppeteer');

async function testFinalVerification() {
  let browser;
  try {
    console.log("=== Final Verification Test ===\n");
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Listen for console logs
    page.on('console', msg => {
      console.log('BROWSER LOG:', msg.text());
    });
    
    // Listen for errors
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });
    
    // Listen for network responses
    page.on('response', response => {
      if (response.url().includes('/api/admin/settings')) {
        console.log(`API RESPONSE: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    console.log("1. Navigating to login page...");
    await page.goto('http://localhost:3000/login');
    
    // Wait for login form
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    
    // Switch to admin tab
    await page.click('button:has-text("Login Admin")');
    await page.waitForTimeout(1000);
    
    // Login
    console.log("2. Logging in as admin...");
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    console.log("✅ Login successful");
    
    // Navigate to settings
    console.log("3. Navigating to settings page...");
    await page.goto('http://localhost:3000/admin/pengaturan');
    
    // Wait for settings page to load
    await page.waitForSelector('h1:has-text("Pengaturan Akun")', { timeout: 10000 });
    console.log("✅ Settings page loaded");
    
    // Wait for data to load (no loading spinner)
    await page.waitForFunction(() => {
      const spinner = document.querySelector('.animate-spin');
      return !spinner;
    }, { timeout: 10000 });
    
    console.log("✅ Data loaded (no loading spinner)");
    
    // Check if form fields are populated
    const siteNameValue = await page.inputValue('input[placeholder*="nama situs"]');
    console.log("Site name value:", siteNameValue);
    
    if (siteNameValue && siteNameValue.includes('PGRI')) {
      console.log("✅ Settings data loaded successfully!");
    } else {
      console.log("❌ Settings data not loaded properly");
    }
    
    // Check for error notifications
    const errorNotification = await page.locator('div:has-text("Gagal memuat pengaturan")').count();
    if (errorNotification === 0) {
      console.log("✅ No error notifications found");
    } else {
      console.log("❌ Error notification still present");
    }
    
    console.log("\n=== Test Complete ===");
    
    // Keep browser open for 5 seconds to see the result
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testFinalVerification();