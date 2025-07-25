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
function simpleTest() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            console.log('🧪 Simple Patient API Test...\n');
            // First, login to get auth token
            const loginResponse = yield axios_1.default.post(`${BASE_URL}/auth/login`, {
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
            const api = axios_1.default.create({
                baseURL: BASE_URL,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            // Test getting patient by ID directly
            console.log('\n🔍 Testing GET /patients/1...');
            try {
                const response = yield api.get('/patients/1');
                console.log('✅ Response:', response.data);
            }
            catch (error) {
                console.log('❌ Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                console.log('❌ Status:', (_b = error.response) === null || _b === void 0 ? void 0 : _b.status);
                console.log('❌ URL:', (_c = error.config) === null || _c === void 0 ? void 0 : _c.url);
            }
            // Test the test route
            console.log('\n🔍 Testing GET /patients/test...');
            try {
                const testResponse = yield api.get('/patients/test');
                console.log('✅ Test Response:', testResponse.data);
            }
            catch (error) {
                console.log('❌ Test Error:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
                console.log('❌ Test Status:', (_e = error.response) === null || _e === void 0 ? void 0 : _e.status);
                console.log('❌ Test URL:', (_f = error.config) === null || _f === void 0 ? void 0 : _f.url);
            }
        }
        catch (error) {
            console.error('❌ Test failed:', error.message);
        }
    });
}
simpleTest();
