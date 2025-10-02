const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Monitor all console messages
    page.on('console', msg => {
      console.log(`🖥️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    });
    
    // Monitor page errors
    page.on('pageerror', error => {
      console.log(`❌ PAGE ERROR: ${error.message}`);
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
    
    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Inject debugging code into the page
    await page.evaluate(() => {
      console.log('🔍 DEBUGGING: Injecting state monitoring...');
      
      // Override fetch to log API calls
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        console.log('🌐 FETCH CALL:', args[0], args[1]);
        return originalFetch.apply(this, args).then(response => {
          console.log('🌐 FETCH RESPONSE:', response.status, response.url);
          return response;
        });
      };
      
      // Try to find React component and monitor state
      const checkReactState = () => {
        try {
          // Look for React fiber nodes
          const reactRoot = document.querySelector('#__next');
          if (reactRoot) {
            const fiberKey = Object.keys(reactRoot).find(key => key.startsWith('__reactFiber'));
            if (fiberKey) {
              console.log('🔍 REACT FIBER FOUND:', fiberKey);
              
              // Try to traverse the fiber tree to find our component
              let fiber = reactRoot[fiberKey];
              let depth = 0;
              const maxDepth = 20;
              
              const traverseFiber = (node, currentDepth) => {
                if (!node || currentDepth > maxDepth) return;
                
                if (node.memoizedState) {
                  console.log(`🔍 COMPONENT STATE (depth ${currentDepth}):`, node.memoizedState);
                }
                
                if (node.child) traverseFiber(node.child, currentDepth + 1);
                if (node.sibling) traverseFiber(node.sibling, currentDepth);
              };
              
              traverseFiber(fiber, 0);
            }
          }
        } catch (error) {
          console.log('❌ Error accessing React state:', error.message);
        }
      };
      
      // Check state immediately and after a delay
      checkReactState();
      setTimeout(checkReactState, 2000);
      setTimeout(checkReactState, 5000);
      
      // Monitor DOM changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.tagName === 'INPUT') {
                console.log('🔍 NEW INPUT ADDED:', {
                  name: node.name,
                  value: node.value,
                  placeholder: node.placeholder
                });
              }
            });
          }
          if (mutation.type === 'attributes' && mutation.target.tagName === 'INPUT') {
            console.log('🔍 INPUT CHANGED:', {
              name: mutation.target.name,
              value: mutation.target.value,
              attribute: mutation.attributeName
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value']
      });
    });
    
    // Wait and check the current state
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalState = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(input => ({
        name: input.name,
        value: input.value,
        placeholder: input.placeholder,
        type: input.type
      }));
      
      return {
        inputs,
        url: window.location.href,
        title: document.title
      };
    });
    
    console.log('\n📋 FINAL STATE:');
    console.log('Current URL:', finalState.url);
    console.log('Page Title:', finalState.title);
    console.log('Input Fields:');
    finalState.inputs.forEach((input, index) => {
      console.log(`  ${index + 1}. ${input.name || 'unnamed'}: "${input.value}" (${input.type})`);
    });
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();