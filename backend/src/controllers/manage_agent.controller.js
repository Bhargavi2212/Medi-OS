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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAgentController = void 0;
const manage_agent_service_1 = require("../services/manage_agent.service");
class ManageAgentController {
    constructor() {
        this.manageAgentService = new manage_agent_service_1.ManageAgentService();
    }
    /**
     * Predict wait time for a queue
     */
    predictWaitTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queueState = req.body;
                const user = req.user;
                if (!queueState.queueLength || !queueState.staffAvailable) {
                    res.status(400).json({
                        success: false,
                        message: "Queue length and staff available are required"
                    });
                    return;
                }
                const prediction = yield this.manageAgentService.predictWaitTime(queueState);
                res.status(200).json({
                    success: true,
                    message: "Wait time prediction generated",
                    data: prediction
                });
            }
            catch (error) {
                console.error("Error predicting wait time:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to predict wait time",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Classify patient triage
     */
    classifyTriage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientInfo = req.body;
                const user = req.user;
                if (!patientInfo.patientId || !patientInfo.age || !patientInfo.department) {
                    res.status(400).json({
                        success: false,
                        message: "Patient ID, age, and department are required"
                    });
                    return;
                }
                const triageResult = yield this.manageAgentService.classifyTriage(patientInfo);
                res.status(200).json({
                    success: true,
                    message: "Triage classification completed",
                    data: triageResult
                });
            }
            catch (error) {
                console.error("Error classifying triage:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to classify triage",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Optimize resource allocation
     */
    optimizeResources(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queueState = req.body;
                const user = req.user;
                if (!queueState.queueLength || !queueState.staffAvailable) {
                    res.status(400).json({
                        success: false,
                        message: "Queue length and staff available are required"
                    });
                    return;
                }
                const optimization = yield this.manageAgentService.optimizeResources(queueState);
                res.status(200).json({
                    success: true,
                    message: "Resource optimization completed",
                    data: optimization
                });
            }
            catch (error) {
                console.error("Error optimizing resources:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to optimize resources",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Process digital check-in
     */
    processDigitalCheckin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientData = req.body;
                const user = req.user;
                if (!patientData.patientId || !patientData.department) {
                    res.status(400).json({
                        success: false,
                        message: "Patient ID and department are required"
                    });
                    return;
                }
                const checkinResult = yield this.manageAgentService.processDigitalCheckin(patientData);
                res.status(200).json({
                    success: true,
                    message: "Digital check-in processed successfully",
                    data: checkinResult
                });
            }
            catch (error) {
                console.error("Error processing digital check-in:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to process digital check-in",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Get queue dashboard
     */
    getQueueDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const dashboard = yield this.manageAgentService.getQueueDashboard();
                res.status(200).json({
                    success: true,
                    message: "Queue dashboard retrieved",
                    data: dashboard
                });
            }
            catch (error) {
                console.error("Error getting queue dashboard:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to get queue dashboard",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Get patient flow analytics
     */
    getPatientFlowAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const analytics = yield this.manageAgentService.getPatientFlowAnalytics();
                res.status(200).json({
                    success: true,
                    message: "Patient flow analytics retrieved",
                    data: analytics
                });
            }
            catch (error) {
                console.error("Error getting patient flow analytics:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to get patient flow analytics",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Update queue state
     */
    updateQueueState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { department } = req.params;
                const queueData = req.body;
                const user = req.user;
                if (!department) {
                    res.status(400).json({
                        success: false,
                        message: "Department is required"
                    });
                    return;
                }
                const success = yield this.manageAgentService.updateQueueState(department, queueData);
                res.status(200).json({
                    success: true,
                    message: "Queue state updated successfully",
                    data: { department, updated: success }
                });
            }
            catch (error) {
                console.error("Error updating queue state:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to update queue state",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const metrics = yield this.manageAgentService.getPerformanceMetrics();
                res.status(200).json({
                    success: true,
                    message: "Performance metrics retrieved",
                    data: metrics
                });
            }
            catch (error) {
                console.error("Error getting performance metrics:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to get performance metrics",
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    }
    /**
     * Train ML models
     */
    trainModels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.manageAgentService.trainModels();
                res.json({
                    success: result.success,
                    data: result.data,
                    error: result.error
                });
            }
            catch (error) {
                console.error('Error training models:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to train models'
                });
            }
        });
    }
    /**
     * Test ML environment
     */
    testMLEnvironment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.manageAgentService.testMLEnvironment();
                res.json({
                    success: result.success,
                    data: result.data,
                    error: result.error
                });
            }
            catch (error) {
                console.error('Error testing ML environment:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to test ML environment'
                });
            }
        });
    }
}
exports.ManageAgentController = ManageAgentController;
