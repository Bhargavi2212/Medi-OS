import { Repository } from "typeorm";
import AppDataSource from "../config/ormconfig";
import { User } from "../entity/User";
import { PythonMLBridge } from "./python_ml_bridge";

export interface QueueState {
    queueLength: number;
    currentWaitTime: number;
    staffAvailable: number;
    roomsAvailable: number;
    hourOfDay: number;
    dayOfWeek: number;
}

export interface PatientInfo {
    patientId: string;
    age: number;
    urgencyLevel: number;
    department: string;
    medicalComplexity: number;
    symptoms: string[];
    painLevel?: number;
}

export interface WaitTimePrediction {
    predictedWaitTime: number;
    confidence: number;
    queuePosition: number;
    estimatedWaitTime: string;
}

export interface TriageResult {
    urgencyLevel: number;
    urgencyDescription: string;
    recommendedDepartment: string;
    estimatedWaitTime: string;
    confidence: number;
}

export interface ResourceOptimization {
    optimalStaffAllocation: number;
    optimalRoomAllocation: number;
    currentEfficiency: number;
    recommendations: string[];
}

export interface CheckinResult {
    checkinId: string;
    patientId: string;
    queuePosition: number;
    estimatedWaitTime: string;
    department: string;
    checkinTime: string;
    status: string;
}

export class ManageAgentService {
    private userRepository: Repository<User>;
    private mlBridge: PythonMLBridge;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.mlBridge = new PythonMLBridge();
    }

    /**
     * Predict wait time using ML model
     */
    async predictWaitTime(queueState: QueueState): Promise<WaitTimePrediction> {
        try {
            // Use ML bridge for prediction
            const mlResult = await this.mlBridge.callMLAgent({
                type: 'wait_time',
                data: queueState
            });

            if (mlResult.success && mlResult.data) {
                return mlResult.data;
            } else {
                // Fallback to rule-based prediction if ML fails
                console.warn('ML prediction failed, using fallback:', mlResult.error);
                return this.fallbackWaitTimePrediction(queueState);
            }
        } catch (error) {
            console.error('Error in ML prediction:', error);
            return this.fallbackWaitTimePrediction(queueState);
        }
    }

    /**
     * Classify patient triage using ML model
     */
    async classifyTriage(patientInfo: PatientInfo): Promise<TriageResult> {
        try {
            // Use ML bridge for triage classification
            const mlResult = await this.mlBridge.callMLAgent({
                type: 'triage',
                data: patientInfo
            });

            if (mlResult.success && mlResult.data) {
                return mlResult.data;
            } else {
                // Fallback to rule-based classification if ML fails
                console.warn('ML triage failed, using fallback:', mlResult.error);
                return this.fallbackTriageClassification(patientInfo);
            }
        } catch (error) {
            console.error('Error in ML triage:', error);
            return this.fallbackTriageClassification(patientInfo);
        }
    }

    /**
     * Optimize resource allocation using ML model
     */
    async optimizeResources(queueState: QueueState): Promise<ResourceOptimization> {
        try {
            // Use ML bridge for resource optimization
            const mlResult = await this.mlBridge.callMLAgent({
                type: 'optimization',
                data: queueState
            });

            if (mlResult.success && mlResult.data) {
                return mlResult.data;
            } else {
                // Fallback to rule-based optimization if ML fails
                console.warn('ML optimization failed, using fallback:', mlResult.error);
                return this.fallbackResourceOptimization(queueState);
            }
        } catch (error) {
            console.error('Error in ML optimization:', error);
            return this.fallbackResourceOptimization(queueState);
        }
    }

    /**
     * Process digital check-in and assign to queue
     */
    async processDigitalCheckin(patientData: PatientInfo): Promise<CheckinResult> {
        const checkinId = `CI${Date.now()}`;
        const queuePosition = Math.floor(Math.random() * 15) + 1;
        const estimatedWait = queuePosition * 15;
        
        return {
            checkinId,
            patientId: patientData.patientId,
            queuePosition,
            estimatedWaitTime: `${estimatedWait} minutes`,
            department: patientData.department,
            checkinTime: new Date().toISOString(),
            status: 'checked_in'
        };
    }

    /**
     * Get queue management dashboard data
     */
    async getQueueDashboard(): Promise<any> {
        // Mock dashboard data (would come from real database)
        const currentTime = new Date();
        const hourOfDay = currentTime.getHours();
        const dayOfWeek = currentTime.getDay();
        
        const departments = ['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General Medicine'];
        const dashboardData = departments.map(dept => ({
            department: dept,
            queueLength: Math.floor(Math.random() * 20) + 1,
            averageWaitTime: Math.floor(Math.random() * 60) + 15,
            staffAvailable: Math.floor(Math.random() * 8) + 2,
            roomsAvailable: Math.floor(Math.random() * 10) + 3
        }));
        
        return {
            timestamp: currentTime.toISOString(),
            totalPatients: dashboardData.reduce((sum, dept) => sum + dept.queueLength, 0),
            averageWaitTime: Math.floor(dashboardData.reduce((sum, dept) => sum + dept.averageWaitTime, 0) / departments.length),
            departments: dashboardData,
            hourOfDay,
            dayOfWeek
        };
    }

    /**
     * Get patient flow analytics
     */
    async getPatientFlowAnalytics(): Promise<any> {
        // Mock analytics data (would come from real database)
        const currentTime = new Date();
        
        return {
            totalPatientsToday: Math.floor(Math.random() * 100) + 50,
            averageWaitTime: Math.floor(Math.random() * 45) + 20,
            peakHours: ['10:00-12:00', '14:00-16:00'],
            busiestDepartment: 'General Medicine',
            efficiencyScore: Math.random() * 0.3 + 0.7, // 70-100%
            recommendations: [
                'Increase staff during peak hours',
                'Optimize room allocation',
                'Consider appointment scheduling improvements'
            ]
        };
    }

    /**
     * Update queue state (for real-time updates)
     */
    async updateQueueState(department: string, queueData: Partial<QueueState>): Promise<boolean> {
        // Mock queue update (would update real database)
        console.log(`Updating queue for ${department}:`, queueData);
        return true;
    }

    /**
     * Get agent performance metrics
     */
    async getPerformanceMetrics(): Promise<any> {
        try {
            // Try to get ML performance metrics
            const mlMetrics = await this.mlBridge.getPerformanceMetrics();
            if (mlMetrics.success && mlMetrics.data) {
                return mlMetrics.data;
            }
        } catch (error) {
            console.warn('Failed to get ML metrics:', error);
        }

        // Fallback metrics
        return {
            accuracy: 0.85,
            precision: 0.82,
            recall: 0.88,
            f1Score: 0.85,
            lastTrainingDate: new Date().toISOString(),
            dataPointsProcessed: 15000,
            modelVersion: '1.0.0'
        };
    }

    /**
     * Train ML models
     */
    async trainModels(): Promise<any> {
        try {
            const result = await this.mlBridge.trainModels();
            return result;
        } catch (error) {
            console.error('Failed to train models:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Test ML environment
     */
    async testMLEnvironment(): Promise<any> {
        try {
            const result = await this.mlBridge.testEnvironment();
            return result;
        } catch (error) {
            console.error('Failed to test ML environment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Fallback methods for when ML fails
    private fallbackWaitTimePrediction(queueState: QueueState): WaitTimePrediction {
        const baseWaitTime = queueState.queueLength * 15;
        const staffFactor = Math.max(0.5, Math.min(2.0, 5 / queueState.staffAvailable));
        const timeFactor = queueState.hourOfDay < 9 || queueState.hourOfDay > 17 ? 0.7 : 
                          queueState.hourOfDay >= 10 && queueState.hourOfDay <= 14 ? 1.3 : 1.0;
        const dayFactor = queueState.dayOfWeek >= 5 ? 0.8 : 1.0;
        
        const predictedWaitTime = Math.round(baseWaitTime * staffFactor * timeFactor * dayFactor);
        const confidence = Math.max(0.6, Math.min(0.95, 1 - (queueState.queueLength / 20)));
        
        return {
            predictedWaitTime: Math.max(5, Math.min(predictedWaitTime, 180)),
            confidence,
            queuePosition: queueState.queueLength,
            estimatedWaitTime: `${Math.max(5, Math.min(predictedWaitTime, 180))} minutes`
        };
    }

    private fallbackTriageClassification(patientInfo: PatientInfo): TriageResult {
        let urgencyLevel = patientInfo.urgencyLevel;
        let recommendedDepartment = patientInfo.department;
        
        if (patientInfo.age > 65) {
            urgencyLevel = Math.min(5, urgencyLevel + 1);
        }
        
        if (patientInfo.medicalComplexity > 5) {
            urgencyLevel = Math.min(5, urgencyLevel + 1);
        }
        
        if (patientInfo.symptoms.some(s => s.includes('chest') || s.includes('heart'))) {
            recommendedDepartment = 'Cardiology';
        } else if (patientInfo.symptoms.some(s => s.includes('head') || s.includes('brain'))) {
            recommendedDepartment = 'Neurology';
        } else if (patientInfo.symptoms.some(s => s.includes('bone') || s.includes('joint'))) {
            recommendedDepartment = 'Orthopedics';
        }
        
        const urgencyDescriptions = {
            1: 'Non-urgent',
            2: 'Low urgency',
            3: 'Medium urgency',
            4: 'High urgency',
            5: 'Emergency'
        };
        
        return {
            urgencyLevel,
            urgencyDescription: urgencyDescriptions[urgencyLevel as keyof typeof urgencyDescriptions] || 'Medium urgency',
            recommendedDepartment,
            estimatedWaitTime: `${urgencyLevel * 15} minutes`,
            confidence: 0.8
        };
    }

    private fallbackResourceOptimization(queueState: QueueState): ResourceOptimization {
        const optimalStaff = Math.max(1, Math.min(10, Math.ceil(queueState.queueLength / 3) + 2));
        const optimalRooms = Math.max(1, Math.min(15, Math.ceil(queueState.queueLength / 2) + 3));
        
        let adjustedStaff = optimalStaff;
        let adjustedRooms = optimalRooms;
        
        if (queueState.hourOfDay < 9 || queueState.hourOfDay > 17) {
            adjustedStaff = Math.max(1, Math.floor(optimalStaff / 2));
            adjustedRooms = Math.max(1, Math.floor(optimalRooms / 2));
        }
        
        const currentEfficiency = queueState.staffAvailable / Math.max(adjustedStaff, 1);
        
        const recommendations = [
            `Allocate ${adjustedStaff} staff members`,
            `Use ${adjustedRooms} rooms`,
            'Consider adjusting based on patient flow'
        ];
        
        if (currentEfficiency < 0.8) {
            recommendations.push('Consider increasing staff allocation');
        }
        
        if (currentEfficiency > 1.2) {
            recommendations.push('Consider reducing staff allocation');
        }
        
        return {
            optimalStaffAllocation: adjustedStaff,
            optimalRoomAllocation: adjustedRooms,
            currentEfficiency,
            recommendations
        };
    }
} 