import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function debugAuth() {
  console.log('🔍 Debugging Authentication API...\n');

  try {
    // Test registration with detailed logging
    console.log('Testing registration with data:');
    const registerData = {
      username: 'testuser',
      email: 'testuser@healthos.com',
      password: 'testpass123',
      full_name: 'Test User'
    };
    console.log('Request data:', JSON.stringify(registerData, null, 2));

    const response = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Response status:', response.status);
    console.log('✅ Response data:', JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    console.log('❌ Error status:', error.response?.status);
    console.log('❌ Error data:', JSON.stringify(error.response?.data, null, 2));
    console.log('❌ Error message:', error.message);
  }
}

debugAuth(); 