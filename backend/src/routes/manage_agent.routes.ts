import { Router } from "express";
import { ManageAgentController } from "../controllers/manage_agent.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const manageAgentController = new ManageAgentController();

// Queue Management Routes
router.post("/predict-wait-time", authMiddleware, (req, res) => manageAgentController.predictWaitTime(req, res));
router.post("/classify-triage", authMiddleware, (req, res) => manageAgentController.classifyTriage(req, res));
router.post("/optimize-resources", authMiddleware, (req, res) => manageAgentController.optimizeResources(req, res));

// Digital Check-in Routes
router.post("/digital-checkin", authMiddleware, (req, res) => manageAgentController.processDigitalCheckin(req, res));

// Dashboard & Analytics Routes
router.get("/queue-dashboard", authMiddleware, (req, res) => manageAgentController.getQueueDashboard(req, res));
router.get("/patient-flow-analytics", authMiddleware, (req, res) => manageAgentController.getPatientFlowAnalytics(req, res));
router.get("/performance-metrics", authMiddleware, (req, res) => manageAgentController.getPerformanceMetrics(req, res));

// Real-time Queue Management
router.put("/queue-state/:department", authMiddleware, (req, res) => manageAgentController.updateQueueState(req, res));

// ML model management endpoints
router.post("/train-models", authMiddleware, (req, res) => manageAgentController.trainModels(req, res));
router.get("/test-ml-environment", authMiddleware, (req, res) => manageAgentController.testMLEnvironment(req, res));

export default router; 