const fetch = require('node-fetch');

async function testResetToken() {
  try {
    console.log('🧪 Testing Reset Password Token...\n');
    
    // Use the token from the previous test
    const token = 'ac2a890e55cc8cf70201a635a80d8a85d3c37b14a7b59a0b28ce55acde5d7fe4';
    
    console.log(`🔑 Testing token verification: ${token.substring(0, 20)}...`);
    
    // Test token verification (GET request)
    const verifyResponse = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`);
    const verifyData = await verifyResponse.json();
    
    console.log('\n📊 Token Verification Response:');
    console.log('Status:', verifyResponse.status);
    console.log('Data:', JSON.stringify(verifyData, null, 2));
    
    if (verifyData.success) {
      console.log('\n✅ Token is valid! Testing password reset...');
      
      // Test password reset (POST request)
      const newPassword = 'newpassword123';
      const resetResponse = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: newPassword
        })
      });
      
      const resetData = await resetResponse.json();
      
      console.log('\n📊 Password Reset Response:');
      console.log('Status:', resetResponse.status);
      console.log('Data:', JSON.stringify(resetData, null, 2));
      
      if (resetData.success) {
        console.log('\n✅ Password reset successful!');
        console.log('🔐 New password:', newPassword);
        
        // Test login with new password
        console.log('\n🧪 Testing login with new password...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/member/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'bagoespancawiratama@gmail.com',
            password: newPassword
          })
        });
        
        const loginData = await loginResponse.json();
        
        console.log('\n📊 Login Test Response:');
        console.log('Status:', loginResponse.status);
        console.log('Data:', JSON.stringify(loginData, null, 2));
        
        if (loginResponse.status === 200) {
          console.log('\n🎉 Complete forgot password flow test SUCCESSFUL!');
        } else {
          console.log('\n❌ Login with new password failed');
        }
        
      } else {
        console.log('\n❌ Password reset failed');
      }
    } else {
      console.log('\n❌ Token verification failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing reset token:', error);
  }
}

testResetToken();