const puppeteer = require('puppeteer');

async function testPhotoUpdate() {
  console.log('🧪 Testing Photo Update Fix...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' && (
        msg.text().includes('Update response:') || 
        msg.text().includes('Updated member photo path:')
      )) {
        console.log('📝 Console:', msg.text());
      }
    });
    
    // Go to admin login
    console.log('🔐 Logging in as admin...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', 'admin@pgri.com');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForNavigation();
    
    // Go to members page
    console.log('👥 Navigating to members page...');
    await page.goto('http://localhost:3000/admin/anggota');
    await page.waitForSelector('table');
    
    // Wait for members to load
    await page.waitForTimeout(2000);
    
    // Find first member with photo and click edit
    console.log('✏️ Looking for member to edit...');
    const editButtons = await page.$$('button[title="Edit"]');
    
    if (editButtons.length > 0) {
      await editButtons[0].click();
      await page.waitForSelector('.modal', { visible: true });
      
      console.log('📷 Testing photo update...');
      
      // Check if photo input exists
      const photoInput = await page.$('input[type="file"][accept*="image"]');
      if (photoInput) {
        console.log('✅ Photo input found');
        
        // Get current photo src before update
        const currentPhotoSrc = await page.evaluate(() => {
          const img = document.querySelector('.modal img[alt*="name"]');
          return img ? img.src : null;
        });
        
        console.log('📸 Current photo src:', currentPhotoSrc);
        
        // Create a test image file (1x1 pixel PNG)
        const testImagePath = 'd:\\SPID Versi 2\\test-image.png';
        const fs = require('fs');
        
        // Create a minimal PNG file
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
        
        // Upload the test image
        await photoInput.uploadFile(testImagePath);
        
        console.log('📤 Test image uploaded');
        
        // Wait for preview to update
        await page.waitForTimeout(1000);
        
        // Click save button
        const saveButton = await page.$('button:has-text("Simpan")');
        if (saveButton) {
          await saveButton.click();
          console.log('💾 Save button clicked');
          
          // Wait for success message
          await page.waitForTimeout(3000);
          
          // Check if photo src changed
          const newPhotoSrc = await page.evaluate(() => {
            const img = document.querySelector('table img[alt*="name"]');
            return img ? img.src : null;
          });
          
          console.log('📸 New photo src:', newPhotoSrc);
          
          if (newPhotoSrc && newPhotoSrc !== currentPhotoSrc) {
            console.log('✅ Photo updated successfully!');
            console.log('🔄 Cache-busting working:', newPhotoSrc.includes('?t='));
          } else {
            console.log('❌ Photo may not have updated properly');
          }
        }
        
        // Clean up test file
        fs.unlinkSync(testImagePath);
        
      } else {
        console.log('❌ Photo input not found');
      }
    } else {
      console.log('❌ No edit buttons found');
    }
    
    console.log('✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testPhotoUpdate().catch(console.error);