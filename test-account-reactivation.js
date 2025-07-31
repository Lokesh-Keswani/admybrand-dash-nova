// Test script for account deletion and reactivation
const API_BASE_URL = 'http://localhost:3001/api';

async function testAccountReactivation() {
  console.log('🧪 Testing account deletion and reactivation...\n');

  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  const testName = 'Test User';

  try {
    // Step 1: Create a new account
    console.log('1. Creating new account...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword
      })
    });

    const signupData = await signupResponse.json();
    
    if (!signupResponse.ok) {
      throw new Error(`Signup failed: ${signupData.message}`);
    }

    console.log('✅ Account created successfully');
    const token = signupData.token;

    // Step 2: Delete the account
    console.log('\n2. Deleting the account...');
    const deleteResponse = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const deleteData = await deleteResponse.json();
    
    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteData.message}`);
    }

    console.log('✅ Account deleted successfully');

    // Step 3: Try to create account with same email (should reactivate)
    console.log('\n3. Attempting to create account with same email...');
    const reactivateResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'New Test User',
        email: testEmail,
        password: 'newpassword123'
      })
    });

    const reactivateData = await reactivateResponse.json();
    
    if (!reactivateResponse.ok) {
      throw new Error(`Reactivation failed: ${reactivateData.message}`);
    }

    console.log('✅ Account reactivated successfully');
    console.log(`   Message: ${reactivateData.message}`);

    // Step 4: Try to login with the reactivated account
    console.log('\n4. Testing login with reactivated account...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'newpassword123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    console.log('✅ Login successful with reactivated account');
    console.log(`   User: ${loginData.user.name} (${loginData.user.email})`);

    console.log('\n🎉 All tests passed! Account deletion and reactivation is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAccountReactivation(); 