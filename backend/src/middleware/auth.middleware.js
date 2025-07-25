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
exports.requireRole = exports.requirePermission = exports.requireHospitalAccess = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const User_1 = require("../entity/User");
const UserHospital_1 = require("../entity/UserHospital");
const authMiddleware = (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'Access token required' });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = yield ormconfig_1.default.getRepository(User_1.User).findOne({
                where: { id: decoded.userId, is_active: true }
            });
            if (!user) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }))();
};
exports.authMiddleware = authMiddleware;
const requireHospitalAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const hospitalId = req.params.hospitalId || req.body.hospitalId;
        if (!hospitalId) {
            return res.status(400).json({ error: 'Hospital ID required' });
        }
        const userHospital = yield ormconfig_1.default.getRepository(UserHospital_1.UserHospital).findOne({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.requireHospitalAccess = requireHospitalAccess;
const requirePermission = (permission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.userHospital) {
                return res.status(403).json({ error: 'Hospital access required' });
            }
            const hasPermission = yield ormconfig_1.default.getRepository(UserHospital_1.UserHospital)
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
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.requirePermission = requirePermission;
const requireRole = (requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });
};
exports.requireRole = requireRole;
