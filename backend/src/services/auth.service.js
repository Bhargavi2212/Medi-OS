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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const User_1 = require("../entity/User");
const account_lockout_middleware_1 = require("../middleware/account-lockout.middleware");
class AuthService {
    constructor() {
        // private roleRepository: Repository<Role>; // Commented out since Role is disabled
        // Store reset tokens in memory (in production, use Redis or database)
        this.resetTokens = new Map();
        this.userRepository = ormconfig_1.default.getRepository(User_1.User);
        // this.roleRepository = AppDataSource.getRepository(Role); // Commented out since Role is disabled
    }
    // Register a new user
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user already exists
                const existingUser = yield this.userRepository.findOne({
                    where: [
                        { username: userData.username },
                        { email: userData.email }
                    ]
                });
                if (existingUser) {
                    return {
                        success: false,
                        message: 'User with this username or email already exists'
                    };
                }
                // Hash password
                const saltRounds = 10;
                const hashedPassword = yield bcryptjs_1.default.hash(userData.password, saltRounds);
                // Create user without role for now
                const user = this.userRepository.create({
                    username: userData.username,
                    email: userData.email,
                    password_hash: hashedPassword,
                    full_name: userData.fullName,
                    // role: roleId ? { id: roleId } : undefined, // Commented out since Role is disabled
                    created_at: new Date(),
                    updated_at: new Date()
                });
                const savedUser = yield this.userRepository.save(user);
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    userId: savedUser.id,
                    username: savedUser.username,
                    email: savedUser.email,
                    // role: savedUser.role // Commented out since Role is disabled
                }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                return {
                    success: true,
                    message: 'User registered successfully',
                    token,
                    user: {
                        id: savedUser.id,
                        username: savedUser.username,
                        email: savedUser.email,
                        fullName: savedUser.full_name,
                        // role: savedUser.role // Commented out since Role is disabled
                    }
                };
            }
            catch (error) {
                console.error('Register error:', error);
                return {
                    success: false,
                    message: 'Failed to register user'
                };
            }
        });
    }
    // Login user
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if account is locked
                if ((0, account_lockout_middleware_1.isAccountLocked)(credentials.username)) {
                    return {
                        success: false,
                        message: 'Account is temporarily locked due to too many failed attempts'
                    };
                }
                const user = yield this.userRepository.findOne({
                    where: { username: credentials.username }
                    // relations: ['role'] // Commented out since Role is disabled
                });
                if (!user) {
                    (0, account_lockout_middleware_1.recordFailedAttempt)(credentials.username);
                    return {
                        success: false,
                        message: 'Invalid credentials'
                    };
                }
                // Check if user is active
                if (!user.is_active) {
                    (0, account_lockout_middleware_1.recordFailedAttempt)(credentials.username);
                    return {
                        success: false,
                        message: 'Account is deactivated'
                    };
                }
                // Check password
                const isPasswordValid = yield bcryptjs_1.default.compare(credentials.password, user.password_hash);
                if (!isPasswordValid) {
                    (0, account_lockout_middleware_1.recordFailedAttempt)(credentials.username);
                    return {
                        success: false,
                        message: 'Invalid credentials'
                    };
                }
                // Record successful login
                (0, account_lockout_middleware_1.recordSuccessfulAttempt)(credentials.username);
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    // role: user.role // Commented out since Role is disabled
                }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                return {
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.full_name,
                        // roleId: user.role?.id || 0, // Commented out since Role is disabled
                        // roleName: user.role?.name || 'unknown' // Commented out since Role is disabled
                    }
                };
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Failed to login'
                };
            }
        });
    }
    // Change password
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findOne({
                    where: { id: userId }
                });
                if (!user) {
                    return {
                        success: false,
                        message: 'User not found'
                    };
                }
                // Verify current password
                const isCurrentPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password_hash);
                if (!isCurrentPasswordValid) {
                    return {
                        success: false,
                        message: 'Current password is incorrect'
                    };
                }
                // Hash new password
                const saltRounds = 10;
                const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, saltRounds);
                // Update password
                user.password_hash = hashedNewPassword;
                user.updated_at = new Date();
                yield this.userRepository.save(user);
                return {
                    success: true,
                    message: 'Password changed successfully'
                };
            }
            catch (error) {
                console.error('Change password error:', error);
                return {
                    success: false,
                    message: 'Failed to change password'
                };
            }
        });
    }
    // Request password reset
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findOne({
                    where: { email }
                });
                if (!user) {
                    // Don't reveal if email exists or not for security
                    return {
                        success: true,
                        message: 'If the email exists, a reset link has been sent'
                    };
                }
                // Generate reset token
                const resetToken = crypto_1.default.randomBytes(32).toString('hex');
                const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
                // Store reset token
                this.resetTokens.set(resetToken, {
                    userId: user.id,
                    expiresAt
                });
                // In production, send email here
                console.log(`Password reset token for ${email}: ${resetToken}`);
                console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
                return {
                    success: true,
                    message: 'Password reset link sent to your email',
                    resetToken // Remove this in production
                };
            }
            catch (error) {
                console.error('Password reset request error:', error);
                return {
                    success: false,
                    message: 'Failed to process password reset request'
                };
            }
        });
    }
    // Reset password
    resetPassword(resetToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetData = this.resetTokens.get(resetToken);
                if (!resetData) {
                    return {
                        success: false,
                        message: 'Invalid or expired reset token'
                    };
                }
                if (new Date() > resetData.expiresAt) {
                    this.resetTokens.delete(resetToken);
                    return {
                        success: false,
                        message: 'Reset token has expired'
                    };
                }
                const user = yield this.userRepository.findOne({
                    where: { id: resetData.userId }
                });
                if (!user) {
                    return {
                        success: false,
                        message: 'User not found'
                    };
                }
                // Hash new password
                const saltRounds = 10;
                const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, saltRounds);
                // Update password
                user.password_hash = hashedNewPassword;
                user.updated_at = new Date();
                yield this.userRepository.save(user);
                // Remove used token
                this.resetTokens.delete(resetToken);
                return {
                    success: true,
                    message: 'Password reset successfully'
                };
            }
            catch (error) {
                console.error('Password reset error:', error);
                return {
                    success: false,
                    message: 'Failed to reset password'
                };
            }
        });
    }
    // Clean up expired tokens (call this periodically)
    cleanupExpiredTokens() {
        const now = new Date();
        for (const [token, data] of this.resetTokens.entries()) {
            if (now > data.expiresAt) {
                this.resetTokens.delete(token);
            }
        }
    }
}
exports.AuthService = AuthService;
