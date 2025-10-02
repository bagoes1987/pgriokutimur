// Script untuk debug halaman pengaturan
// Jalankan di browser console pada halaman http://localhost:3000/admin/pengaturan

console.log('=== Debug Halaman Pengaturan ===');

// 1. Cek apakah halaman ter-load dengan benar
console.log('1. Cek elemen halaman:');
console.log('- Title:', document.title);
console.log('- URL:', window.location.href);
console.log('- Body content length:', document.body.innerHTML.length);

// 2. Cek apakah React components ter-render
console.log('\n2. Cek React components:');
const pengaturanElements = document.querySelectorAll('[class*="pengaturan"], [class*="settings"]');
console.log('- Pengaturan elements found:', pengaturanElements.length);

const adminLayoutElements = document.querySelectorAll('[class*="admin"], [class*="layout"]');
console.log('- Admin layout elements found:', adminLayoutElements.length);

// 3. Cek error di console
console.log('\n3. Cek JavaScript errors:');
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
});

// 4. Test fetch settings secara manual
console.log('\n4. Test fetch settings manual:');
async function testFetchSettings() {
  try {
    console.log('Fetching settings...');
    const response = await fetch('/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      console.log('✅ Settings loaded successfully');
      console.log('Settings count:', Object.keys(data.settings).length);
    } else {
      console.error('❌ Settings response indicates failure');
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

testFetchSettings();

// 5. Cek authentication
console.log('\n5. Cek authentication:');
console.log('- Cookies:', document.cookie);

// 6. Cek toast notifications
console.log('\n6. Cek toast system:');
if (typeof toast !== 'undefined') {
  console.log('✅ Toast system available');
  // Test toast
  setTimeout(() => {
    toast.success('Test toast berhasil!');
  }, 1000);
} else {
  console.log('❌ Toast system not available');
}

// 7. Cek React state (jika ada)
console.log('\n7. Cek React DevTools:');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('✅ React DevTools available');
} else {
  console.log('❌ React DevTools not available');
}

console.log('\n=== Debug selesai ===');
console.log('Silakan cek output di atas untuk diagnosis masalah.');