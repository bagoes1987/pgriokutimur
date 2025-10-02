const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testFrontendPhotoUpload() {
  console.log('🚀 Starting frontend photo upload test...');
  
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
    
    // Enable error logging
    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });
    
    console.log('1️⃣ Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    
    console.log('2️⃣ Logging in as member...');
    await page.type('input[type="email"]', 'bagoespancawiratama@gmail.com');
    await page.type('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to member dashboard
    await page.waitForNavigation();
    console.log('✅ Login successful');
    
    console.log('3️⃣ Navigating to biodata page...');
    await page.goto('http://localhost:3000/member/biodata');
    await page.waitForSelector('form');
    
    console.log('4️⃣ Looking for edit button...');
    await page.waitForTimeout(2000);
    
    // Find edit button on biodata page
    const editButton = await page.$('button:has-text("Edit")') || await page.$('button[type="button"]:not([type="submit"])');
    if (!editButton) {
      console.log('❌ No edit button found, checking if already in edit mode...');
      // Check if we're already in edit mode by looking for file input
      const photoInput = await page.$('input[type="file"][accept*="image"]');
      if (!photoInput) {
        console.log('❌ Not in edit mode and no edit button found');
        return;
      }
      console.log('✅ Already in edit mode');
    } else {
      console.log('5️⃣ Clicking edit button...');
      await editButton.click();
      await page.waitForTimeout(1000);
    }
    
    console.log('6️⃣ Looking for photo input...');
    const photoInput = await page.$('input[type="file"][accept*="image"]');
    if (!photoInput) {
      console.log('❌ Photo input not found');
      return;
    }
    
    console.log('7️⃣ Creating test image...');
    // Create a simple test image
    const testImagePath = path.join(__dirname, 'test-upload.png');
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // IDAT data
      0xE2, 0x21, 0xBC, 0x33, // CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    fs.writeFileSync(testImagePath, pngBuffer);
    
    console.log('8️⃣ Getting current photo src before upload...');
    const beforePhotoSrc = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="Photo"]') || 
                  document.querySelector('img[src*="member"]') ||
                  document.querySelector('img[src*="avatar"]');
      return img ? img.src : 'No image found';
    });
    console.log('📸 Before upload:', beforePhotoSrc);
    
    console.log('9️⃣ Uploading test image...');
    await photoInput.uploadFile(testImagePath);
    await page.waitForTimeout(1000);
    
    console.log('🔟 Clicking save button...');
    const saveButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Simpan")') || await page.$('button:has-text("Update")');
    if (saveButton) {
      await saveButton.click();
      console.log('💾 Save button clicked');
      
      // Wait for API response
      await page.waitForTimeout(5000);
      
      console.log('1️⃣1️⃣ Checking for success message...');
      const alertText = await page.evaluate(() => {
        return document.body.innerText.includes('berhasil') || document.body.innerText.includes('success') ? 'Success message found' : 'No success message';
      });
      console.log('📢 Alert status:', alertText);
      
      console.log('1️⃣2️⃣ Getting photo src after upload...');
      const afterPhotoSrc = await page.evaluate(() => {
        const img = document.querySelector('img[alt*="Photo"]') || 
                    document.querySelector('img[src*="member"]') ||
                    document.querySelector('img[src*="avatar"]');
        return img ? img.src : 'No image found';
      });
      console.log('📸 After upload:', afterPhotoSrc);
      
      console.log('1️⃣3️⃣ Comparing photo sources...');
      if (beforePhotoSrc !== afterPhotoSrc) {
        console.log('✅ Photo src changed successfully!');
        console.log('🔄 Cache-busting working:', afterPhotoSrc.includes('?t='));
      } else {
        console.log('❌ Photo src did NOT change!');
      }
      
      console.log('1️⃣4️⃣ Checking server logs for deletion...');
      // The server logs should show deletion activity
      
    } else {
      console.log('❌ Save button not found');
    }
    
    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    console.log('✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is installed
try {
  require('puppeteer');
  testFrontendPhotoUpload().catch(console.error);
} catch (error) {
  console.log('❌ Puppeteer not installed. Installing...');
  console.log('Run: npm install puppeteer');
  console.log('Then run this script again.');
}