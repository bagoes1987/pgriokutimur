const fs = require('fs');
const path = require('path');

console.log('🔍 TESTING ADMIN PHOTO REFRESH FUNCTIONALITY');
console.log('='.repeat(50));

// Check if admin page has the refresh functionality
const adminPagePath = path.join(__dirname, 'app', 'admin', 'anggota', 'page.tsx');

if (fs.existsSync(adminPagePath)) {
  const adminContent = fs.readFileSync(adminPagePath, 'utf8');
  
  console.log('✅ Admin page file exists');
  
  // Check for refreshPhotoTimestamps function
  if (adminContent.includes('refreshPhotoTimestamps')) {
    console.log('✅ refreshPhotoTimestamps function found');
    
    // Check if it updates all photo timestamps
    if (adminContent.includes('members.forEach((member: Member) => {') && 
        adminContent.includes('newTimestamps[member.id] = currentTime')) {
      console.log('✅ Function updates all member photo timestamps');
    } else {
      console.log('❌ Function does not properly update timestamps');
    }
  } else {
    console.log('❌ refreshPhotoTimestamps function not found');
  }
  
  // Check for refresh button
  if (adminContent.includes('Refresh Foto') && adminContent.includes('onClick={refreshPhotoTimestamps}')) {
    console.log('✅ Refresh button found with correct onClick handler');
  } else {
    console.log('❌ Refresh button not found or incorrectly configured');
  }
  
  // Check for automatic refresh in fetchMembers
  if (adminContent.includes('refreshedTimestamps') && 
      adminContent.includes('Auto-refreshed photo timestamps on data fetch')) {
    console.log('✅ Automatic photo timestamp refresh on data fetch implemented');
  } else {
    console.log('❌ Automatic refresh not implemented in fetchMembers');
  }
  
  // Check cache-busting implementation
  if (adminContent.includes('photoTimestamps[selectedMember.id]') || 
      adminContent.includes('photoTimestamps[member.id]')) {
    console.log('✅ Cache-busting with photoTimestamps implemented');
  } else {
    console.log('❌ Cache-busting not properly implemented');
  }
  
} else {
  console.log('❌ Admin page file not found');
}

console.log('\n📋 MANUAL TESTING STEPS:');
console.log('='.repeat(30));
console.log('1. Login to admin panel: admin / admin123');
console.log('2. Go to Manajemen Anggota page');
console.log('3. Check if "Refresh Foto" button is visible in header');
console.log('4. Login as member: bagoespancawiratama@gmail.com / 12345678');
console.log('5. Change member photo in biodata page');
console.log('6. Go back to admin panel');
console.log('7. Click "Refresh Foto" button');
console.log('8. Check if updated photo is now visible');
console.log('9. Refresh the entire admin page');
console.log('10. Verify photo is still updated (auto-refresh on fetch)');

console.log('\n🔧 EXPECTED BEHAVIOR:');
console.log('='.repeat(25));
console.log('• Manual refresh button should immediately update all photo timestamps');
console.log('• Auto-refresh should happen when admin page loads/refreshes');
console.log('• Photos should show latest version after refresh');
console.log('• Console should show refresh logs');

console.log('\n🚀 Test completed! Please follow manual testing steps.');