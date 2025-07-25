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
exports.changePassword = exports.getProfile = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const User_1 = require("../entity/User");
const UserHospital_1 = require("../entity/UserHospital");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }
        const user = yield ormconfig_1.default.getRepository(User_1.User).findOne({
            where: { username, is_active: true }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Get user's hospital assignments
        const userHospitals = yield ormconfig_1.default.getRepository(UserHospital_1.UserHospital).find({
            where: { user: { id: user.id } },
            relations: ['hospital', 'role']
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    is_active: user.is_active
                },
                hospitals: userHospitals.map(uh => ({
                    id: uh.hospital.id,
                    name: uh.hospital.name,
                    branch_code: uh.hospital.branch_code,
                    role: {
                        id: uh.role.id,
                        name: uh.role.name,
                        description: uh.role.description
                    },
                    is_primary: uh.is_primary
                }))
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('DEBUG: register controller hit', req.body);
    try {
        const { username, email, password, full_name } = req.body;
        if (!username || !email || !password || !full_name) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        // Check if user already exists
        const existingUser = yield ormconfig_1.default.getRepository(User_1.User).findOne({
            where: [{ username }, { email }]
        });
        if (existingUser) {
            res.status(400).json({ error: 'Username or email already exists' });
            return;
        }
        // Hash password
        const password_hash = yield bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = ormconfig_1.default.getRepository(User_1.User).create({
            username,
            email,
            password_hash,
            full_name,
            is_active: true
        });
        yield ormconfig_1.default.getRepository(User_1.User).save(user);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        // Get user's hospital assignments
        const userHospitals = yield ormconfig_1.default.getRepository(UserHospital_1.UserHospital).find({
            where: { user: { id: user.id } },
            relations: ['hospital', 'role']
        });
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    is_active: user.is_active
                },
                hospitals: userHospitals.map(uh => ({
                    id: uh.hospital.id,
                    name: uh.hospital.name,
                    branch_code: uh.hospital.branch_code,
                    role: {
                        id: uh.role.id,
                        name: uh.role.name,
                        description: uh.role.description
                    },
                    is_primary: uh.is_primary
                }))
            }
        });
        return;
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.getProfile = getProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        if (!user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current and new password are required' });
            return;
        }
        // Verify current password
        const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            res.status(400).json({ error: 'Current password is incorrect' });
            return;
        }
        // Hash new password
        const newPasswordHash = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update password
        yield ormconfig_1.default.getRepository(User_1.User).update(user.id, {
            password_hash: newPasswordHash
        });
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
        return;
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.changePassword = changePassword;
