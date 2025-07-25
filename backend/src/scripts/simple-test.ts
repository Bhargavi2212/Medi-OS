import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function simpleTest() {
  try {
    console.log('🧪 Simple Patient API Test...\n');

    // First, login to get auth token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'testuser',
      password: 'testpass123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');

    // Set up axios with auth token
    const api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Test getting patient by ID directly
    console.log('\n🔍 Testing GET /patients/1...');
    try {
      const response = await api.get('/patients/1');
      console.log('✅ Response:', response.data);
    } catch (error: any) {
      console.log('❌ Error:', error.response?.data || error.message);
      console.log('❌ Status:', error.response?.status);
      console.log('❌ URL:', error.config?.url);
    }

    // Test the test route
    console.log('\n🔍 Testing GET /patients/test...');
    try {
      const testResponse = await api.get('/patients/test');
      console.log('✅ Test Response:', testResponse.data);
    } catch (error: any) {
      console.log('❌ Test Error:', error.response?.data || error.message);
      console.log('❌ Test Status:', error.response?.status);
      console.log('❌ Test URL:', error.config?.url);
    }

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest(); 