import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testHospital = {
  name: 'Test Hospital',
  address: '123 Test Street, Test City',
  branch_code: 'TEST001',
  contact_info: '+91-9876543210'
};

const testPatient = {
  first_name: 'John',
  last_name: 'Doe',
  dob: '1990-01-01',
  gender: 'male',
  contact_number: '9876543210',
  email: 'john.doe@example.com',
  address: '456 Patient Street, Test City',
  blood_group: 'O+',
  emergency_contact_name: 'Jane Doe',
  emergency_contact_relationship: 'Spouse',
  emergency_contact_phone: '9876543211',
  allergies: ['Penicillin'],
  existing_conditions: ['Hypertension'],
  hospital_id: 1
};

// Test user credentials
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpass123',
  fullName: 'Test User'
};

let authToken: string | null = null;

async function authenticate() {
  try {
    console.log('🔐 Authenticating...');
    
    // First, try to register a test user
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Test user registered');
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Test user already exists');
      } else {
        console.log('⚠️ Could not register test user:', error.response?.data?.message);
      }
    }

    // Login to get auth token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });

    if (loginResponse.data.success) {
      authToken = loginResponse.data.token;
      console.log('✅ Authentication successful');
      return true;
    } else {
      console.log('❌ Authentication failed:', loginResponse.data.message);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Authentication error:', error.response?.data || error.message);
    return false;
  }
}

async function testPatientAPI() {
  try {
    console.log('🧪 Testing Patient API...\n');

    // First authenticate
    const authSuccess = await authenticate();
    if (!authSuccess) {
      console.log('❌ Cannot proceed without authentication');
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

    // First, let's create a hospital
    console.log('1. Creating test hospital...');
    let hospitalId: number;
    try {
      const hospitalResponse = await api.post('/hospitals', testHospital);
      console.log('✅ Hospital created:', hospitalResponse.data);
      hospitalId = hospitalResponse.data.hospital.id;
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Hospital already exists, using existing hospital');
        // Try to get the existing hospital
        const hospitalsResponse = await api.get('/hospitals');
        const existingHospital = hospitalsResponse.data.hospitals.find((h: any) => h.branch_code === testHospital.branch_code);
        if (existingHospital) {
          hospitalId = existingHospital.id;
        } else {
          console.log('❌ Could not find existing hospital');
          return;
        }
      } else {
        console.log('❌ Hospital creation failed:', error.response?.data?.message);
        return;
      }
    }
    
    testPatient.hospital_id = hospitalId;

    // Now test patient creation
    console.log('\n2. Creating test patient...');
    let patientId: number;
    try {
      const createResponse = await api.post('/patients', testPatient);
      console.log('✅ Patient created:', createResponse.data);
      patientId = createResponse.data.patient.id;
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Patient already exists, using existing patient');
        // Try to get the existing patient
        const patientsResponse = await api.get(`/patients/hospital/${hospitalId}`);
        const existingPatient = patientsResponse.data.patients.find((p: any) => p.contact_number === testPatient.contact_number);
        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          console.log('❌ Could not find existing patient');
          return;
        }
      } else {
        console.log('❌ Patient creation failed:', error.response?.data?.message);
        return;
      }
    }

    // Test getting patients by hospital
    console.log('\n3. Getting patients by hospital...');
    const patientsResponse = await api.get(`/patients/hospital/${hospitalId}`);
    console.log('✅ Patients by hospital:', patientsResponse.data);

    // Test getting patient by ID
    console.log('\n4. Getting patient by ID...');
    const patientResponse = await api.get(`/patients/${patientId}`);
    console.log('✅ Patient by ID:', patientResponse.data);

    // Test searching patients
    console.log('\n5. Searching patients...');
    const searchResponse = await api.get(`/patients/search/${hospitalId}?query=John`);
    console.log('✅ Search results:', searchResponse.data);

    // Test patient statistics
    console.log('\n6. Getting patient statistics...');
    const statsResponse = await api.get(`/patients/stats/${hospitalId}`);
    console.log('✅ Patient statistics:', statsResponse.data);

    // Test updating patient
    console.log('\n7. Updating patient...');
    const updateData = {
      blood_group: 'A+',
      emergency_contact_phone: '9876543212'
    };
    const updateResponse = await api.put(`/patients/${patientId}`, updateData);
    console.log('✅ Patient updated:', updateResponse.data);

    // Test linking ABHA ID
    console.log('\n8. Linking ABHA ID...');
    const abhaResponse = await api.post(`/patients/${patientId}/link-abha`, {
      abha_id: 'TEST123456789'
    });
    console.log('✅ ABHA ID linked:', abhaResponse.data);

    // Test getting patient by ABHA ID
    console.log('\n9. Getting patient by ABHA ID...');
    const abhaPatientResponse = await api.get('/patients/abha/TEST123456789');
    console.log('✅ Patient by ABHA ID:', abhaPatientResponse.data);

    console.log('\n🎉 All tests passed successfully!');
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPatientAPI(); 