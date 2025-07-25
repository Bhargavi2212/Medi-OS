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
let authToken = '';
function testAuthAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
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
            const registerResponse = yield axios_1.default.post(`${BASE_URL}/auth/register`, registerData);
            console.log('✅ Registration successful:', registerResponse.data.message);
            // Test 2: Login with the new user
            console.log('\n2. Testing login...');
            const loginData = {
                username: 'testuser',
                password: 'testpass123'
            };
            const loginResponse = yield axios_1.default.post(`${BASE_URL}/auth/login`, loginData);
            console.log('✅ Login successful');
            console.log('   Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
            console.log('   User data:', loginResponse.data.data.user.username);
            console.log('   Hospitals assigned:', loginResponse.data.data.hospitals.length);
            authToken = loginResponse.data.data.token;
            // Test 3: Get profile with token
            console.log('\n3. Testing get profile...');
            const profileResponse = yield axios_1.default.get(`${BASE_URL}/auth/profile`, {
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
            const changePasswordResponse = yield axios_1.default.post(`${BASE_URL}/auth/change-password`, changePasswordData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Password changed successfully');
            // Test 5: Login with new password
            console.log('\n5. Testing login with new password...');
            const newLoginData = {
                username: 'testuser',
                password: 'newpass123'
            };
            const newLoginResponse = yield axios_1.default.post(`${BASE_URL}/auth/login`, newLoginData);
            console.log('✅ Login with new password successful');
            // Test 6: Try to access profile without token
            console.log('\n6. Testing unauthorized access...');
            try {
                yield axios_1.default.get(`${BASE_URL}/auth/profile`);
                console.log('❌ Should have failed - unauthorized access allowed');
            }
            catch (error) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    console.log('✅ Unauthorized access properly blocked');
                }
                else {
                    console.log('❌ Unexpected error:', (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
                }
            }
            // Test 7: Try to login with wrong password
            console.log('\n7. Testing wrong password...');
            try {
                yield axios_1.default.post(`${BASE_URL}/auth/login`, {
                    username: 'testuser',
                    password: 'wrongpassword'
                });
                console.log('❌ Should have failed - wrong password accepted');
            }
            catch (error) {
                if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 401) {
                    console.log('✅ Wrong password properly rejected');
                }
                else {
                    console.log('❌ Unexpected error:', (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
                }
            }
            console.log('\n🎉 All authentication tests completed successfully!');
        }
        catch (error) {
            console.error('❌ Test failed:', ((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message);
        }
    });
}
// Run the tests
testAuthAPI();
