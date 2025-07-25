import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function testAuthAPI() {
  console.log('🧪 Testing Authentication API...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerData = {
      username: 'testuser',
      email: 'testuser@healthos.com',
      password: 'testpass123',
      full_name: 'Test User'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);

    // Test 2: Login with the new user
    console.log('\n2. Testing login...');
    const loginData = {
      username: 'testuser',
      password: 'testpass123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful');
    console.log('   Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
    console.log('   User data:', loginResponse.data.data.user.username);
    console.log('   Hospitals assigned:', loginResponse.data.data.hospitals.length);

    authToken = loginResponse.data.data.token;

    // Test 3: Get profile with token
    console.log('\n3. Testing get profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('   User:', profileResponse.data.data.user.username);
    console.log('   Hospitals:', profileResponse.data.data.hospitals.length);

    // Test 4: Change password
    console.log('\n4. Testing password change...');
    const changePasswordData = {
      currentPassword: 'testpass123',
      newPassword: 'newpass123'
    };

    const changePasswordResponse = await axios.post(`${BASE_URL}/auth/change-password`, changePasswordData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Password changed successfully');

    // Test 5: Login with new password
    console.log('\n5. Testing login with new password...');
    const newLoginData = {
      username: 'testuser',
      password: 'newpass123'
    };

    const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, newLoginData);
    console.log('✅ Login with new password successful');

    // Test 6: Try to access profile without token
    console.log('\n6. Testing unauthorized access...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ Should have failed - unauthorized access allowed');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 7: Try to login with wrong password
    console.log('\n7. Testing wrong password...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'testuser',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed - wrong password accepted');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Wrong password properly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('\n🎉 All authentication tests completed successfully!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuthAPI(); 