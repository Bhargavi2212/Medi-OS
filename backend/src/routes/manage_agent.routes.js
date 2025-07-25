"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manage_agent_controller_1 = require("../controllers/manage_agent.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const manageAgentController = new manage_agent_controller_1.ManageAgentController();
// Queue Management Routes
router.post("/predict-wait-time", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.predictWaitTime(req, res));
router.post("/classify-triage", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.classifyTriage(req, res));
router.post("/optimize-resources", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.optimizeResources(req, res));
// Digital Check-in Routes
router.post("/digital-checkin", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.processDigitalCheckin(req, res));
// Dashboard & Analytics Routes
router.get("/queue-dashboard", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.getQueueDashboard(req, res));
router.get("/patient-flow-analytics", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.getPatientFlowAnalytics(req, res));
router.get("/performance-metrics", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.getPerformanceMetrics(req, res));
// Real-time Queue Management
router.put("/queue-state/:department", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.updateQueueState(req, res));
// ML model management endpoints
router.post("/train-models", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.trainModels(req, res));
router.get("/test-ml-environment", auth_middleware_1.authMiddleware, (req, res) => manageAgentController.testMLEnvironment(req, res));
exports.default = router;
