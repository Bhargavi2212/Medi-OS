import { Request, Response } from "express";
import { ManageAgentService, QueueState, PatientInfo } from "../services/manage_agent.service";
import { User } from "../entity/User";
import { AuthRequest } from "../middleware/auth.middleware";

export class ManageAgentController {
    private manageAgentService: ManageAgentService;

    constructor() {
        this.manageAgentService = new ManageAgentService();
    }

    /**
     * Predict wait time for a queue
     */
    async predictWaitTime(req: AuthRequest, res: Response): Promise<void> {
        try {
            const queueState: QueueState = req.body;
            const user = req.user;

            if (!queueState.queueLength || !queueState.staffAvailable) {
                res.status(400).json({
                    success: false,
                    message: "Queue length and staff available are required"
                });
                return;
            }

            const prediction = await this.manageAgentService.predictWaitTime(queueState);

            res.status(200).json({
                success: true,
                message: "Wait time prediction generated",
                data: prediction
            });
        } catch (error) {
            console.error("Error predicting wait time:", error);
            res.status(500).json({
                success: false,
                message: "Failed to predict wait time",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Classify patient triage
     */
    async classifyTriage(req: AuthRequest, res: Response): Promise<void> {
        try {
            const patientInfo: PatientInfo = req.body;
            const user = req.user;

            if (!patientInfo.patientId || !patientInfo.age || !patientInfo.department) {
                res.status(400).json({
                    success: false,
                    message: "Patient ID, age, and department are required"
                });
                return;
            }

            const triageResult = await this.manageAgentService.classifyTriage(patientInfo);

            res.status(200).json({
                success: true,
                message: "Triage classification completed",
                data: triageResult
            });
        } catch (error) {
            console.error("Error classifying triage:", error);
            res.status(500).json({
                success: false,
                message: "Failed to classify triage",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Optimize resource allocation
     */
    async optimizeResources(req: AuthRequest, res: Response): Promise<void> {
        try {
            const queueState: QueueState = req.body;
            const user = req.user;

            if (!queueState.queueLength || !queueState.staffAvailable) {
                res.status(400).json({
                    success: false,
                    message: "Queue length and staff available are required"
                });
                return;
            }

            const optimization = await this.manageAgentService.optimizeResources(queueState);

            res.status(200).json({
                success: true,
                message: "Resource optimization completed",
                data: optimization
            });
        } catch (error) {
            console.error("Error optimizing resources:", error);
            res.status(500).json({
                success: false,
                message: "Failed to optimize resources",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Process digital check-in
     */
    async processDigitalCheckin(req: AuthRequest, res: Response): Promise<void> {
        try {
            const patientData: PatientInfo = req.body;
            const user = req.user;

            if (!patientData.patientId || !patientData.department) {
                res.status(400).json({
                    success: false,
                    message: "Patient ID and department are required"
                });
                return;
            }

            const checkinResult = await this.manageAgentService.processDigitalCheckin(patientData);

            res.status(200).json({
                success: true,
                message: "Digital check-in processed successfully",
                data: checkinResult
            });
        } catch (error) {
            console.error("Error processing digital check-in:", error);
            res.status(500).json({
                success: false,
                message: "Failed to process digital check-in",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Get queue dashboard
     */
    async getQueueDashboard(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = req.user;

            const dashboard = await this.manageAgentService.getQueueDashboard();

            res.status(200).json({
                success: true,
                message: "Queue dashboard retrieved",
                data: dashboard
            });
        } catch (error) {
            console.error("Error getting queue dashboard:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get queue dashboard",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Get patient flow analytics
     */
    async getPatientFlowAnalytics(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = req.user;

            const analytics = await this.manageAgentService.getPatientFlowAnalytics();

            res.status(200).json({
                success: true,
                message: "Patient flow analytics retrieved",
                data: analytics
            });
        } catch (error) {
            console.error("Error getting patient flow analytics:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get patient flow analytics",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Update queue state
     */
    async updateQueueState(req: AuthRequest, res: Response): Promise<void> {
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

            const success = await this.manageAgentService.updateQueueState(department, queueData);

            res.status(200).json({
                success: true,
                message: "Queue state updated successfully",
                data: { department, updated: success }
            });
        } catch (error) {
            console.error("Error updating queue state:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update queue state",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Get performance metrics
     */
    async getPerformanceMetrics(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = req.user;

            const metrics = await this.manageAgentService.getPerformanceMetrics();

            res.status(200).json({
                success: true,
                message: "Performance metrics retrieved",
                data: metrics
            });
        } catch (error) {
            console.error("Error getting performance metrics:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get performance metrics",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Train ML models
     */
    async trainModels(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.manageAgentService.trainModels();
            res.json({
                success: result.success,
                data: result.data,
                error: result.error
            });
        } catch (error) {
            console.error('Error training models:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to train models'
            });
        }
    }

    /**
     * Test ML environment
     */
    async testMLEnvironment(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.manageAgentService.testMLEnvironment();
            res.json({
                success: result.success,
                data: result.data,
                error: result.error
            });
        } catch (error) {
            console.error('Error testing ML environment:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to test ML environment'
            });
        }
    }
} 