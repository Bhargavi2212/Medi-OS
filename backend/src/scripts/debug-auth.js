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
function debugAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
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
            const response = yield axios_1.default.post(`${BASE_URL}/auth/register`, registerData);
            console.log('✅ Response status:', response.status);
            console.log('✅ Response data:', JSON.stringify(response.data, null, 2));
        }
        catch (error) {
            console.log('❌ Error status:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.status);
            console.log('❌ Error data:', JSON.stringify((_b = error.response) === null || _b === void 0 ? void 0 : _b.data, null, 2));
            console.log('❌ Error message:', error.message);
        }
    });
}
debugAuth();
