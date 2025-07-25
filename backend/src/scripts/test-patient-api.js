"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
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
let authToken = null;
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            console.log('🔐 Authenticating...');
            // First, try to register a test user
            try {
                yield axios_1.default.post(`${BASE_URL}/auth/register`, testUser);
                console.log('✅ Test user registered');
            }
            catch (error) {
                if ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes('already exists')) {
                    console.log('ℹ️ Test user already exists');
                }
                else {
                    console.log('⚠️ Could not register test user:', (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message);
                }
            }
            // Login to get auth token
            const loginResponse = yield axios_1.default.post(`${BASE_URL}/auth/login`, {
                username: testUser.username,
                password: testUser.password
            });
            if (loginResponse.data.success) {
                authToken = loginResponse.data.token;
                console.log('✅ Authentication successful');
                return true;
            }
            else {
                console.log('❌ Authentication failed:', loginResponse.data.message);
                return false;
            }
        }
        catch (error) {
            console.error('❌ Authentication error:', ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
            return false;
        }
    });
}
function testPatientAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            console.log('🧪 Testing Patient API...\n');
            // First authenticate
            const authSuccess = yield authenticate();
            if (!authSuccess) {
                console.log('❌ Cannot proceed without authentication');
                return;
            }
            // Set up axios with auth token
            const api = axios_1.default.create({
                baseURL: BASE_URL,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            // First, let's create a hospital
            console.log('1. Creating test hospital...');
            let hospitalId;
            try {
                const hospitalResponse = yield api.post('/hospitals', testHospital);
                console.log('✅ Hospital created:', hospitalResponse.data);
                hospitalId = hospitalResponse.data.hospital.id;
            }
            catch (error) {
                if ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes('already exists')) {
                    console.log('ℹ️ Hospital already exists, using existing hospital');
                    // Try to get the existing hospital
                    const hospitalsResponse = yield api.get('/hospitals');
                    const existingHospital = hospitalsResponse.data.hospitals.find((h) => h.branch_code === testHospital.branch_code);
                    if (existingHospital) {
                        hospitalId = existingHospital.id;
                    }
                    else {
                        console.log('❌ Could not find existing hospital');
                        return;
                    }
                }
                else {
                    console.log('❌ Hospital creation failed:', (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message);
                    return;
                }
            }
            testPatient.hospital_id = hospitalId;
            // Now test patient creation
            console.log('\n2. Creating test patient...');
            let patientId;
            try {
                const createResponse = yield api.post('/patients', testPatient);
                console.log('✅ Patient created:', createResponse.data);
                patientId = createResponse.data.patient.id;
            }
            catch (error) {
                if ((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.includes('already exists')) {
                    console.log('ℹ️ Patient already exists, using existing patient');
                    // Try to get the existing patient
                    const patientsResponse = yield api.get(`/patients/hospital/${hospitalId}`);
                    const existingPatient = patientsResponse.data.patients.find((p) => p.contact_number === testPatient.contact_number);
                    if (existingPatient) {
                        patientId = existingPatient.id;
                    }
                    else {
                        console.log('❌ Could not find existing patient');
                        return;
                    }
                }
                else {
                    console.log('❌ Patient creation failed:', (_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.message);
                    return;
                }
            }
            // Test getting patients by hospital
            console.log('\n3. Getting patients by hospital...');
            const patientsResponse = yield api.get(`/patients/hospital/${hospitalId}`);
            console.log('✅ Patients by hospital:', patientsResponse.data);
            // Test getting patient by ID
            console.log('\n4. Getting patient by ID...');
            const patientResponse = yield api.get(`/patients/${patientId}`);
            console.log('✅ Patient by ID:', patientResponse.data);
            // Test searching patients
            console.log('\n5. Searching patients...');
            const searchResponse = yield api.get(`/patients/search/${hospitalId}?query=John`);
            console.log('✅ Search results:', searchResponse.data);
            // Test patient statistics
            console.log('\n6. Getting patient statistics...');
            const statsResponse = yield api.get(`/patients/stats/${hospitalId}`);
            console.log('✅ Patient statistics:', statsResponse.data);
            // Test updating patient
            console.log('\n7. Updating patient...');
            const updateData = {
                blood_group: 'A+',
                emergency_contact_phone: '9876543212'
            };
            const updateResponse = yield api.put(`/patients/${patientId}`, updateData);
            console.log('✅ Patient updated:', updateResponse.data);
            // Test linking ABHA ID
            console.log('\n8. Linking ABHA ID...');
            const abhaResponse = yield api.post(`/patients/${patientId}/link-abha`, {
                abha_id: 'TEST123456789'
            });
            console.log('✅ ABHA ID linked:', abhaResponse.data);
            // Test getting patient by ABHA ID
            console.log('\n9. Getting patient by ABHA ID...');
            const abhaPatientResponse = yield api.get('/patients/abha/TEST123456789');
            console.log('✅ Patient by ABHA ID:', abhaPatientResponse.data);
            console.log('\n🎉 All tests passed successfully!');
        }
        catch (error) {
            console.error('❌ Test failed:', ((_l = error.response) === null || _l === void 0 ? void 0 : _l.data) || error.message);
        }
    });
}
// Run the test
testPatientAPI();
