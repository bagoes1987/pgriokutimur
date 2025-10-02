const puppeteer = require('puppeteer');

async function testAdminPage() {
  let browser;
  try {
    console.log('Starting browser...');
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('BROWSER CONSOLE:', msg.type(), msg.text());
    });
    
    // Enable error logging
    page.on('pageerror', error => {
      console.log('BROWSER ERROR:', error.message);
    });
    
    // Enable request/response logging
    page.on('response', response => {
      if (response.url().includes('/api/') || response.status() >= 400) {
        console.log('RESPONSE:', response.url(), response.status());
      }
    });
    
    // Set a cookie to simulate being logged in as admin
    await page.setCookie({
      name: 'auth-token',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBwZ3JpLW9rdXRpbXVyLmlkIiwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbmlzdHJhdG9yIFBHUkkgT0tVIFRpbXVyIiwicm9sZSI6ImFkbWluIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc1OTI5NDk0MywiZXhwIjoxNzU5ODk5NzQzfQ.2UOIb1foDLdAgXPl0vg-5-X03xz1eG1zcNzxOANhc2k',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });
    
    console.log('Navigating to admin settings...');
    await page.goto('http://localhost:3000/admin/pengaturan', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for any async operations
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Current URL:', page.url());
    
    // Check page content
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Page contains "404":', bodyText.includes('404'));
    console.log('Page contains "Pengaturan":', bodyText.includes('Pengaturan'));
    console.log('Page contains "Admin PGRI":', bodyText.includes('Admin PGRI'));
    console.log('Page contains "loading":', bodyText.toLowerCase().includes('loading'));
    
    // Check if AdminLayout is rendered
    const hasAdminLayout = await page.evaluate(() => {
      return document.querySelector('[class*="min-h-screen"]') !== null;
    });
    console.log('Has AdminLayout structure:', hasAdminLayout);
    
    // Check for loading state
    const hasLoadingSpinner = await page.evaluate(() => {
      return document.querySelector('.animate-spin') !== null;
    });
    console.log('Has loading spinner:', hasLoadingSpinner);
    
    // Check for specific elements
    const hasSidebar = await page.evaluate(() => {
      return document.querySelector('nav') !== null;
    });
    console.log('Has sidebar navigation:', hasSidebar);
    
    // Get page HTML for debugging
    const html = await page.content();
    console.log('Page HTML length:', html.length);
    console.log('HTML contains AdminLayout:', html.includes('AdminLayout'));
    console.log('HTML contains 404:', html.includes('404'));
    
    // Take a screenshot
    await page.screenshot({ path: 'admin-page-test.png', fullPage: true });
    console.log('Screenshot saved as admin-page-test.png');
    
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testAdminPage();