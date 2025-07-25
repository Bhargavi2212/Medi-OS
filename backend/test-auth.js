const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing User Registration...');
    const timestamp = Date.now();
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@healthos.com`,
      password: 'test123',
      fullName: 'Test User'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    const token = registerResponse.data.token;
    console.log('🔑 Token received:', token ? 'Yes' : 'No');

    // Test 2: Login with the registered user
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: `testuser${timestamp}`,
      password: 'test123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    const loginToken = loginResponse.data.token;
    console.log('🔑 Login token received:', loginToken ? 'Yes' : 'No');
    console.log('🔍 Token preview:', loginToken ? loginToken.substring(0, 50) + '...' : 'None');

    // Test 3: Get current user (protected route)
    console.log('\n3️⃣ Testing Protected Route...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    console.log('✅ Protected route successful:', meResponse.data.user.username);

    // Test 4: Test with admin credentials
    console.log('\n4️⃣ Testing Admin Login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin login successful:', adminResponse.data.message);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Available Test Users:');
    console.log('- Admin: admin / admin123');
    console.log('- Doctor: doctor / doctor123');
    console.log(`- Test User: testuser${timestamp} / test123`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth(); 