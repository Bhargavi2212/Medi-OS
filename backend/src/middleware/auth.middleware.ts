import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../config/ormconfig';
import { User } from '../entity/User';
import { UserHospital } from '../entity/UserHospital';
// import { Role } from '../entity/Role'; // Commented out since Role is disabled

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userHospital?: UserHospital;
    }
  }
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  // roleId: number; // Commented out since Role is disabled
  // roleName: string; // Commented out since Role is disabled
}

export interface AuthRequest extends Request {
  user?: User;
  userHospital?: UserHospital;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: decoded.userId, is_active: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  })();
};

export const requireHospitalAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hospitalId = req.params.hospitalId || req.body.hospitalId;
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID required' });
    }

    const userHospital = await AppDataSource.getRepository(UserHospital).findOne({
      where: { 
        user: { id: req.user.id }, 
        hospital: { id: parseInt(hospitalId) }
      },
      relations: ['hospital', 'role']
    });

    if (!userHospital) {
      return res.status(403).json({ error: 'Access denied to this hospital' });
    }

    req.userHospital = userHospital;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const requirePermission = (permission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userHospital) {
        return res.status(403).json({ error: 'Hospital access required' });
      }

      const hasPermission = await AppDataSource.getRepository(UserHospital)
        .createQueryBuilder('uh')
        .innerJoin('uh.role', 'role')
        .innerJoin('role.rolePermissions', 'rp')
        .innerJoin('rp.permission', 'permission')
        .where('uh.id = :userHospitalId', { userHospitalId: req.userHospital.id })
        .andWhere('permission.name = :permission', { permission })
        .getOne();

      if (!hasPermission) {
        return res.status(403).json({ error: `Permission '${permission}' required` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export const requireRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Role checking is disabled since Role entity is commented out
      // For now, allow all authenticated users
      const hasRequiredRole = true;

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}; 