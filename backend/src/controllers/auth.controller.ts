import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppDataSource from '../config/ormconfig';
import { User } from '../entity/User';
import { UserHospital } from '../entity/UserHospital';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { username, is_active: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Get user's hospital assignments
    const userHospitals = await AppDataSource.getRepository(UserHospital).find({
      where: { user: { id: user.id } },
      relations: ['hospital', 'role']
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  console.log('DEBUG: register controller hit', req.body);
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password || !full_name) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: [{ username }, { email }]
    });

    if (existingUser) {
      res.status(400).json({ error: 'Username or email already exists' });
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = AppDataSource.getRepository(User).create({
      username,
      email,
      password_hash,
      full_name,
      is_active: true
    });

    await AppDataSource.getRepository(User).save(user);

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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get user's hospital assignments
    const userHospitals = await AppDataSource.getRepository(UserHospital).find({
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
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await AppDataSource.getRepository(User).update(user.id, {
      password_hash: newPasswordHash
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    return;
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}; 