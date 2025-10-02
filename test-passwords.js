const fetch = require('node-fetch');

async function testPasswords() {
  try {
    console.log('=== Testing Different Passwords ===\n');
    
    const email = 'bagoespancawiratama@gmail.com';
    const passwords = [
      'password123',
      '123456',
      'admin123',
      'bagus123',
      'pgri123',
      'Password123',
      'password',
      '12345678'
    ];
    
    for (let i = 0; i < passwords.length; i++) {
      const password = passwords[i];
      console.log(`${i + 1}. Testing password: "${password}"`);
      
      const loginResponse = await fetch('http://localhost:3000/api/auth/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      console.log(`   Status: ${loginResponse.status}`);
      const loginData = await loginResponse.text();
      console.log(`   Response: ${loginData}`);
      
      if (loginResponse.status === 200) {
        console.log(`   ✅ SUCCESS! Password "${password}" works!`);
        break;
      } else {
        console.log(`   ❌ Failed`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPasswords();