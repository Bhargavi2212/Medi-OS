import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppDataSource from '../config/ormconfig';
import { User } from '../entity/User';
// import { Role } from '../entity/Role'; // Commented out since Role is disabled
import { JWTPayload } from '../middleware/auth.middleware';
import { recordFailedAttempt, recordSuccessfulAttempt, isAccountLocked } from '../middleware/account-lockout.middleware';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleId?: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export class AuthService {
  private userRepository: Repository<User>;
  // private roleRepository: Repository<Role>; // Commented out since Role is disabled

  // Store reset tokens in memory (in production, use Redis or database)
  private resetTokens = new Map<string, { userId: number; expiresAt: Date }>();

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    // this.roleRepository = AppDataSource.getRepository(Role); // Commented out since Role is disabled
  }

  // Register a new user
  async register(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    roleId?: number;
  }) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
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
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

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

      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          // role: savedUser.role // Commented out since Role is disabled
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

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
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Failed to register user'
      };
    }
  }

  // Login user
  async login(credentials: { username: string; password: string }) {
    try {
      // Check if account is locked
      if (isAccountLocked(credentials.username)) {
        return {
          success: false,
          message: 'Account is temporarily locked due to too many failed attempts'
        };
      }

      const user = await this.userRepository.findOne({
        where: { username: credentials.username }
        // relations: ['role'] // Commented out since Role is disabled
      });

      if (!user) {
        recordFailedAttempt(credentials.username);
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Check if user is active
      if (!user.is_active) {
        recordFailedAttempt(credentials.username);
        return {
          success: false,
          message: 'Account is deactivated'
        };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

      if (!isPasswordValid) {
        recordFailedAttempt(credentials.username);
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Record successful login
      recordSuccessfulAttempt(credentials.username);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          username: user.username,
          email: user.email,
          // role: user.role // Commented out since Role is disabled
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

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
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Failed to login'
      };
    }
  }

  // Change password
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password_hash = hashedNewPassword;
      user.updated_at = new Date();

      await this.userRepository.save(user);

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Failed to change password'
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email: string) {
    try {
      const user = await this.userRepository.findOne({
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
      const resetToken = crypto.randomBytes(32).toString('hex');
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
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Failed to process password reset request'
      };
    }
  }

  // Reset password
  async resetPassword(resetToken: string, newPassword: string) {
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

      const user = await this.userRepository.findOne({
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
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password_hash = hashedNewPassword;
      user.updated_at = new Date();

      await this.userRepository.save(user);

      // Remove used token
      this.resetTokens.delete(resetToken);

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to reset password'
      };
    }
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