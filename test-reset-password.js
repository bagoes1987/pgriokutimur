const fetch = require('node-fetch');

async function testResetPassword() {
  try {
    console.log('🧪 Testing Reset Password Email...\n');
    
    const email = 'bagoespancawiratama@gmail.com';
    
    console.log(`📧 Sending reset password email to: ${email}`);
    
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Reset password email sent successfully!');
      console.log('📬 Please check the email inbox for reset link');
    } else {
      console.log('\n❌ Failed to send reset password email');
      console.log('Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing reset password:', error);
  }
}

testResetPassword();