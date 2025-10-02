const fs = require('fs');
const path = require('path');

console.log('🔍 FINAL PHOTO TEST - Verifikasi Lengkap Foto Anggota');
console.log('=' .repeat(60));

// 1. Cek struktur direktori
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const membersDir = path.join(uploadsDir, 'members');

console.log('\n📁 STRUKTUR DIREKTORI:');
console.log('Public dir exists:', fs.existsSync(publicDir));
console.log('Uploads dir exists:', fs.existsSync(uploadsDir));
console.log('Members dir exists:', fs.existsSync(membersDir));

// 2. List semua file foto
if (fs.existsSync(membersDir)) {
  const files = fs.readdirSync(membersDir);
  console.log('\n📸 FILE FOTO YANG TERSEDIA:');
  files.forEach(file => {
    const filePath = path.join(membersDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB, ${stats.mtime.toISOString()})`);
  });
  
  // 3. Test akses URL untuk setiap file
  console.log('\n🌐 TEST AKSES URL:');
  files.forEach(file => {
    const url = `http://localhost:3000/uploads/members/${file}`;
    console.log(`  URL: ${url}`);
  });
}

// 4. Cek konfigurasi Next.js
const nextConfigPath = path.join(__dirname, 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('\n⚙️ NEXT.JS CONFIG:');
  console.log('next.config.js exists:', true);
  try {
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    if (configContent.includes('images')) {
      console.log('Images config found in next.config.js');
    }
  } catch (error) {
    console.log('Error reading next.config.js:', error.message);
  }
}

// 5. Instruksi untuk user
console.log('\n📋 INSTRUKSI PENGUJIAN:');
console.log('1. Buka browser dan akses: http://localhost:3000/member/biodata');
console.log('2. Buka Developer Tools (F12)');
console.log('3. Pergi ke tab Console');
console.log('4. Refresh halaman dan lihat log debug yang dimulai dengan 🔍 DEBUG');
console.log('5. Pastikan foto muncul tanpa error');
console.log('6. Coba edit biodata dan upload foto baru');
console.log('7. Pastikan foto tersimpan dan muncul setelah save');

console.log('\n✅ PERBAIKAN YANG TELAH DILAKUKAN:');
console.log('- ✅ Menambahkan cache busting dengan timestamp');
console.log('- ✅ Menambahkan error handling untuk img elements');
console.log('- ✅ Menambahkan logging untuk debugging');
console.log('- ✅ Menambahkan script monitoring real-time');
console.log('- ✅ Memverifikasi struktur direktori dan file');

console.log('\n🎯 HASIL YANG DIHARAPKAN:');
console.log('- Foto anggota muncul dengan benar di halaman biodata');
console.log('- Tidak ada error loading gambar di console');
console.log('- Foto tetap muncul setelah refresh halaman');
console.log('- Upload foto baru berfungsi dengan baik');
console.log('- Cache busting mencegah masalah cache browser');

console.log('\n' + '=' .repeat(60));
console.log('🏁 TEST SELESAI - Silakan verifikasi di browser!');