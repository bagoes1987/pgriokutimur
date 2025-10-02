// Script untuk test foto di browser
console.log('🔍 TESTING FOTO DI BROWSER...');

// Test 1: Cek apakah elemen foto ada
const photoElements = document.querySelectorAll('img[src*="/uploads/members/"]');
console.log(`📸 Found ${photoElements.length} photo elements with uploads path`);

photoElements.forEach((img, index) => {
  console.log(`   Photo ${index + 1}:`);
  console.log(`   - src: ${img.src}`);
  console.log(`   - naturalWidth: ${img.naturalWidth}`);
  console.log(`   - naturalHeight: ${img.naturalHeight}`);
  console.log(`   - complete: ${img.complete}`);
  console.log(`   - loading error: ${img.onerror ? 'Has error handler' : 'No error handler'}`);
});

// Test 2: Cek semua img elements
const allImages = document.querySelectorAll('img');
console.log(`🖼️ Total images on page: ${allImages.length}`);

allImages.forEach((img, index) => {
  if (img.src.includes('uploads') || img.src.includes('placeholder')) {
    console.log(`   Image ${index + 1}: ${img.src} (${img.complete ? 'loaded' : 'loading'})`);
  }
});

// Test 3: Cek localStorage untuk foto
const memberData = localStorage.getItem('memberData');
if (memberData) {
  const data = JSON.parse(memberData);
  console.log('💾 Member data from localStorage:');
  console.log(`   - photo: ${data.photo || 'No photo'}`);
}

console.log('✅ Browser test completed!');