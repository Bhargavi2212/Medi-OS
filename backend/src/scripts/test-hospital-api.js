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
let authToken = null;
function testHospitalAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        try {
            console.log('🏥 Testing Hospital Management API...\n');
            // 1. Register a test user
            console.log('1. Registering test user...');
            try {
                yield axios_1.default.post(`${BASE_URL}/auth/register`, testUser);
                console.log('✅ User registered successfully');
            }
            catch (error) {
                if ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes('already exists')) {
                    console.log('ℹ️ User already exists');
                }
                else {
                    console.log('❌ User registration failed:', (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message);
                    return;
                }
            }
            // 2. Login to get auth token
            console.log('\n2. Logging in...');
            try {
                const loginResponse = yield axios_1.default.post(`${BASE_URL}/auth/login`, {
                    username: testUser.username,
                    password: testUser.password
                });
                if (loginResponse.data.success) {
                    authToken = loginResponse.data.token;
                    console.log('✅ Login successful');
                }
                else {
                    console.log('❌ Login failed:', loginResponse.data.message);
                    return;
                }
            }
            catch (error) {
                console.log('❌ Login error:', (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message);
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
            // 3. Create a hospital
            console.log('\n3. Creating hospital...');
            try {
                const hospitalResponse = yield api.post('/hospitals', testHospital);
                console.log('✅ Hospital created:', hospitalResponse.data);
            }
            catch (error) {
                if ((_k = (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.message) === null || _k === void 0 ? void 0 : _k.includes('already exists')) {
                    console.log('ℹ️ Hospital already exists');
                }
                else {
                    console.log('❌ Hospital creation failed:', (_m = (_l = error.response) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.message);
                    return;
                }
            }
            // 4. Get all hospitals
            console.log('\n4. Getting all hospitals...');
            try {
                const hospitalsResponse = yield api.get('/hospitals');
                console.log('✅ Hospitals retrieved:', hospitalsResponse.data);
            }
            catch (error) {
                console.log('❌ Get hospitals failed:', (_p = (_o = error.response) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.message);
            }
            console.log('\n🎉 Hospital management API test completed!');
        }
        catch (error) {
            console.error('❌ Test failed:', ((_q = error.response) === null || _q === void 0 ? void 0 : _q.data) || error.message);
        }
    });
}
testHospitalAPI();
