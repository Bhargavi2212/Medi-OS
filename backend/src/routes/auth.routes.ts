import { Router } from 'express';
import { login, register, getProfile, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', authMiddleware, (req, res) => getProfile(req, res));
router.post('/change-password', authMiddleware, (req, res) => changePassword(req, res));

export default router; 