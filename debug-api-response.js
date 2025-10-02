const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture API responses with body
    const apiResponses = [];
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/settings')) {
        try {
          const responseBody = await response.text();
          apiResponses.push({
            url: response.url(),
            status: response.status(),
            headers: response.headers(),
            body: responseBody
          });
          console.log(`📥 SETTINGS API RESPONSE: ${response.status()}`);
          console.log(`📄 Response Body:`, responseBody);
        } catch (error) {
          console.log(`❌ Error reading response body:`, error.message);
        }
      }
    });
    
    // Monitor console for fetch-related logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('fetchSettings') || text.includes('settings') || text.includes('API')) {
        console.log(`🖥️ CONSOLE: ${msg.type()}: ${text}`);
      }
    });
    
    console.log('🔐 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Login as admin
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminButton = buttons.find(button => button.textContent.includes('Login Admin'));
      if (adminButton) adminButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.type('input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔧 Navigating to settings...');
    await page.goto('http://localhost:3000/admin/pengaturan');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if we captured any API responses
    console.log('\n📊 API RESPONSE ANALYSIS:');
    console.log(`Total settings API calls: ${apiResponses.length}`);
    
    apiResponses.forEach((response, index) => {
      console.log(`\n--- Response ${index + 1} ---`);
      console.log(`Status: ${response.status}`);
      console.log(`URL: ${response.url}`);
      console.log(`Body: ${response.body}`);
      
      try {
        const parsedBody = JSON.parse(response.body);
        console.log(`Parsed JSON:`, JSON.stringify(parsedBody, null, 2));
      } catch (e) {
        console.log(`❌ Failed to parse JSON: ${e.message}`);
      }
    });
    
    // Check current page state and component state
    const componentState = await page.evaluate(() => {
      // Try to access React component state through dev tools
      const reactFiberKey = Object.keys(document.querySelector('#__next')).find(key => key.startsWith('__reactFiber'));
      
      return {
        hasReactFiber: !!reactFiberKey,
        inputElements: Array.from(document.querySelectorAll('input')).map(input => ({
          name: input.name,
          value: input.value,
          placeholder: input.placeholder
        })),
        formElements: Array.from(document.querySelectorAll('form')).length,
        pageTitle: document.title,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('\n📋 COMPONENT STATE:');
    console.log('Input Elements:', componentState.inputElements);
    console.log('Form Elements Count:', componentState.formElements);
    console.log('Page Title:', componentState.pageTitle);
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();