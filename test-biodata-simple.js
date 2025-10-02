const puppeteer = require('puppeteer');

async function testBiodataSimple() {
  console.log('🚀 Starting simple biodata test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🖥️ BROWSER:', msg.text());
    });
    
    console.log('1️⃣ Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    
    console.log('2️⃣ Logging in as member...');
    await page.type('input[type="email"]', 'bagoespancawiratama@gmail.com');
    await page.type('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForNavigation();
    console.log('✅ Login successful');
    
    console.log('3️⃣ Navigating to biodata page...');
    await page.goto('http://localhost:3000/member/biodata');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('4️⃣ Inspecting page structure...');
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasForm: !!document.querySelector('form'),
        hasFileInput: !!document.querySelector('input[type="file"]'),
        hasEditButton: !!document.querySelector('button:contains("Edit")') || !!document.querySelector('button[title*="Edit"]'),
        hasImage: !!document.querySelector('img'),
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent.trim(),
          type: btn.type,
          className: btn.className
        })),
        allImages: Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          className: img.className
        })),
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('📊 Page Info:', JSON.stringify(pageInfo, null, 2));
    
    console.log('5️⃣ Looking for current photo...');
    const currentPhoto = await page.evaluate(() => {
      const img = document.querySelector('img[src*="member"]') || 
                  document.querySelector('img[src*="upload"]') ||
                  document.querySelector('img[alt*="Photo"]') ||
                  document.querySelector('img[alt*="photo"]');
      return img ? {
        src: img.src,
        alt: img.alt,
        className: img.className
      } : null;
    });
    
    console.log('📸 Current Photo:', currentPhoto);
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser will stay open for 30 seconds for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testBiodataSimple().catch(console.error);