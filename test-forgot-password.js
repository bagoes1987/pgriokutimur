const fetch = require('node-fetch');

async function testForgotPassword() {
  try {
    console.log('🧪 Testing Forgot Password Functionality...\n');
    
    const email = 'bagoespancawiratama@gmail.com';
    
    console.log(`📧 Testing forgot password for email: ${email}`);
    
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ Forgot password request sent successfully!');
      console.log('📬 Check the console for reset URL (since SMTP is not configured)');
    } else {
      console.log('\n❌ Failed to send forgot password request');
      console.log('Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing forgot password:', error);
  }
}

testForgotPassword();