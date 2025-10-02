// Script untuk dijalankan di browser console
// Buka halaman admin pengaturan, lalu paste script ini di console

console.log('🔍 Testing settings API from browser console...');

// Test 1: Fetch settings dengan credentials
async function testFetchSettings() {
  console.log('📋 Test 1: Fetching settings with credentials...');
  
  try {
    const response = await fetch('/api/admin/settings', {
      credentials: 'include'
    });
    
    console.log('📋 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📋 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Settings fetch successful!');
      return data;
    } else {
      console.log('❌ Settings fetch failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    return null;
  }
}

// Test 2: Fetch settings tanpa credentials
async function testFetchSettingsNoCredentials() {
  console.log('📋 Test 2: Fetching settings without credentials...');
  
  try {
    const response = await fetch('/api/admin/settings');
    
    console.log('📋 Response status:', response.status);
    const data = await response.json();
    console.log('📋 Response data:', data);
    
    if (response.status === 401) {
      console.log('✅ Correctly requires credentials');
    } else {
      console.log('⚠️ Should require credentials but got:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test 3: Check cookies
function checkCookies() {
  console.log('📋 Test 3: Checking cookies...');
  console.log('🍪 All cookies:', document.cookie);
  
  const authToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='));
    
  if (authToken) {
    console.log('✅ Auth token found:', authToken.substring(0, 30) + '...');
  } else {
    console.log('❌ No auth token found');
  }
}

// Test 4: Check current page state
function checkPageState() {
  console.log('📋 Test 4: Checking page state...');
  
  // Check for error toasts
  const errorToasts = document.querySelectorAll('.Toastify__toast--error, [class*="error"]');
  console.log('❌ Error toasts found:', errorToasts.length);
  errorToasts.forEach((toast, index) => {
    console.log(`Error ${index + 1}:`, toast.textContent);
  });
  
  // Check form fields
  const siteNameInput = document.querySelector('input[name="siteName"]');
  if (siteNameInput) {
    console.log('📋 Site name field value:', siteNameInput.value);
  } else {
    console.log('❌ Site name field not found');
  }
  
  // Check loading state
  const loadingElements = document.querySelectorAll('[class*="loading"], .loading');
  console.log('⏳ Loading elements found:', loadingElements.length);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all tests...');
  
  checkCookies();
  checkPageState();
  
  await testFetchSettings();
  await testFetchSettingsNoCredentials();
  
  console.log('✅ All tests completed. Check the logs above for results.');
}

// Auto-run tests
runAllTests();