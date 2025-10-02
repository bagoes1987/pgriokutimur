const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugPhotoIssue() {
    console.log('🔍 Starting comprehensive photo update debugging...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        console.log(`🖥️  BROWSER: ${msg.text()}`);
    });
    
    // Enable network monitoring
    page.on('response', response => {
        if (response.url().includes('/api/admin/members/')) {
            console.log(`🌐 API Response: ${response.status()} - ${response.url()}`);
        }
    });
    
    try {
        console.log('1️⃣ Navigating to admin login...');
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
        
        console.log('2️⃣ Logging in as admin...');
        await page.type('input[name="email"]', 'admin@pgri.com');
        await page.type('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        console.log('3️⃣ Navigating to members page...');
        await page.goto('http://localhost:3000/admin/anggota', { waitUntil: 'networkidle2' });
        
        console.log('4️⃣ Waiting for members table to load...');
        await page.waitForSelector('table tbody tr', { timeout: 10000 });
        
        console.log('5️⃣ Finding first member to edit...');
        const firstEditButton = await page.$('button[title="Edit"]');
        if (!firstEditButton) {
            throw new Error('No edit button found');
        }
        
        await firstEditButton.click();
        await page.waitForSelector('input[type="file"]', { timeout: 5000 });
        
        console.log('6️⃣ Creating test image...');
        const testImagePath = path.join(__dirname, 'test-image.png');
        
        // Create a simple test image (1x1 pixel PNG)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
            0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
            0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
            0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
            0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        fs.writeFileSync(testImagePath, pngBuffer);
        
        console.log('7️⃣ Uploading test image...');
        const fileInput = await page.$('input[type="file"]');
        await fileInput.uploadFile(testImagePath);
        
        console.log('8️⃣ Getting current photo src before update...');
        const beforePhotoSrc = await page.evaluate(() => {
            const img = document.querySelector('img[alt*="foto"]') || document.querySelector('img[src*="member"]');
            return img ? img.src : 'No image found';
        });
        console.log(`📸 Before update: ${beforePhotoSrc}`);
        
        console.log('9️⃣ Clicking save button...');
        await page.click('button:has-text("Simpan")');
        
        console.log('🔟 Waiting for API response...');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣1️⃣ Getting photo src after update...');
        const afterPhotoSrc = await page.evaluate(() => {
            const img = document.querySelector('img[alt*="foto"]') || document.querySelector('img[src*="member"]');
            return img ? img.src : 'No image found';
        });
        console.log(`📸 After update: ${afterPhotoSrc}`);
        
        console.log('1️⃣2️⃣ Checking if photo src changed...');
        if (beforePhotoSrc !== afterPhotoSrc) {
            console.log('✅ Photo src changed successfully!');
        } else {
            console.log('❌ Photo src did NOT change!');
        }
        
        console.log('1️⃣3️⃣ Checking network requests...');
        const responses = await page.evaluate(() => {
            return window.performance.getEntriesByType('resource')
                .filter(entry => entry.name.includes('/api/admin/members/'))
                .map(entry => ({
                    url: entry.name,
                    status: entry.responseStatus,
                    duration: entry.duration
                }));
        });
        
        console.log('🌐 Recent API calls:', responses);
        
        console.log('1️⃣4️⃣ Checking uploads directory...');
        const uploadsDir = path.join(__dirname, 'public', 'uploads', 'members');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.log('📁 Files in uploads/members:', files);
        } else {
            console.log('❌ Uploads directory not found');
        }
        
        // Clean up
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    } finally {
        await browser.close();
    }
}

debugPhotoIssue().catch(console.error);