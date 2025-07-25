"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register);
// Protected routes
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => (0, auth_controller_1.getProfile)(req, res));
router.post('/change-password', auth_middleware_1.authMiddleware, (req, res) => (0, auth_controller_1.changePassword)(req, res));
exports.default = router;
