// Script untuk debugging browser issues
// Jalankan di browser console setelah login sebagai admin

console.log("=== Debug Browser Issues ===");

// 1. Check if we're logged in
console.log("1. Checking authentication...");
const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth-token='));
console.log("Auth token found:", !!authToken);

// 2. Test Settings API directly
console.log("\n2. Testing Settings API...");
fetch('/api/admin/settings', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  }
})
.then(response => {
  console.log("Settings API Status:", response.status);
  return response.json();
})
.then(data => {
  console.log("Settings API Response:", data);
  console.log("Settings keys:", Object.keys(data.settings || {}));
})
.catch(error => {
  console.error("Settings API Error:", error);
});

// 3. Test Officers API directly  
console.log("\n3. Testing Officers API...");
fetch('/api/admin/officers', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  }
})
.then(response => {
  console.log("Officers API Status:", response.status);
  return response.json();
})
.then(data => {
  console.log("Officers API Response:", data);
  console.log("Officers count:", data.officers?.length || 0);
})
.catch(error => {
  console.error("Officers API Error:", error);
});

// 4. Check for JavaScript errors
console.log("\n4. Checking for JavaScript errors...");
window.addEventListener('error', function(e) {
  console.error("JavaScript Error:", e.error);
});

// 5. Check React components
console.log("\n5. Checking React components...");
setTimeout(() => {
  // Check if pengurus page elements exist
  const pengurusElements = document.querySelectorAll('[data-testid*="pengurus"], .pengurus, [class*="pengurus"]');
  console.log("Pengurus elements found:", pengurusElements.length);
  
  // Check if settings page elements exist
  const settingsElements = document.querySelectorAll('[data-testid*="settings"], .settings, [class*="pengaturan"]');
  console.log("Settings elements found:", settingsElements.length);
  
  // Check for error messages
  const errorElements = document.querySelectorAll('[class*="error"], .toast-error, [data-testid*="error"]');
  console.log("Error elements found:", errorElements.length);
  
  if (errorElements.length > 0) {
    console.log("Error messages:");
    errorElements.forEach((el, i) => {
      console.log(`  ${i + 1}:`, el.textContent);
    });
  }
}, 2000);

console.log("\n=== Instructions ===");
console.log("1. Copy this script");
console.log("2. Open browser and go to http://localhost:3000/admin");
console.log("3. Login as admin");
console.log("4. Open browser console (F12)");
console.log("5. Paste and run this script");
console.log("6. Try clicking 'Kelola Pengurus' and 'Pengaturan'");
console.log("7. Check console for any errors");