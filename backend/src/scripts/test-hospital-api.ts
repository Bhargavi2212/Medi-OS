import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Test user credentials
const testUser = {
  username: 'admin',
  email: 'admin@healthos.com',
  password: 'admin123',
  fullName: 'Admin User'
};

// Test hospital data
const testHospital = {
  name: 'City General Hospital',
  address: '123 Main Street, City Center',
  branch_code: 'CGH001',
  contact_info: '+91-9876543210'
};

let authToken: string | null = null;

async function testHospitalAPI() {
  try {
    console.log('🏥 Testing Hospital Management API...\n');

    // 1. Register a test user
    console.log('1. Registering test user...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User registered successfully');
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists');
      } else {
        console.log('❌ User registration failed:', error.response?.data?.message);
        return;
      }
    }

    // 2. Login to get auth token
    console.log('\n2. Logging in...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        username: testUser.username,
        password: testUser.password
      });
      
      if (loginResponse.data.success) {
        authToken = loginResponse.data.token;
        console.log('✅ Login successful');
      } else {
        console.log('❌ Login failed:', loginResponse.data.message);
        return;
      }
    } catch (error: any) {
      console.log('❌ Login error:', error.response?.data?.message);
      return;
    }

    // Set up axios with auth token
    const api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    // 3. Create a hospital
    console.log('\n3. Creating hospital...');
    try {
      const hospitalResponse = await api.post('/hospitals', testHospital);
      console.log('✅ Hospital created:', hospitalResponse.data);
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Hospital already exists');
      } else {
        console.log('❌ Hospital creation failed:', error.response?.data?.message);
        return;
      }
    }

    // 4. Get all hospitals
    console.log('\n4. Getting all hospitals...');
    try {
      const hospitalsResponse = await api.get('/hospitals');
      console.log('✅ Hospitals retrieved:', hospitalsResponse.data);
    } catch (error: any) {
      console.log('❌ Get hospitals failed:', error.response?.data?.message);
    }

    console.log('\n🎉 Hospital management API test completed!');
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testHospitalAPI(); 