import { Router } from 'express';
import { InsightsAgentController } from '../controllers/insights_agent.controller';

const router = Router();
const insightsAgentController = new InsightsAgentController();

// Analytics and Insights Routes
router.get('/analytics/overview', insightsAgentController.getAnalyticsOverview);
router.get('/analytics/trends', insightsAgentController.getTrendAnalysis);
router.get('/analytics/performance', insightsAgentController.getPerformanceMetrics);
router.get('/analytics/predictions', insightsAgentController.getPredictiveInsights);

// Report Generation
router.post('/reports/generate', insightsAgentController.generateReport);
router.get('/reports/:reportId', insightsAgentController.getReport);
router.get('/reports', insightsAgentController.getAllReports);

// Data Analysis
router.post('/analyze/patient-data', insightsAgentController.analyzePatientData);
router.post('/analyze/hospital-performance', insightsAgentController.analyzeHospitalPerformance);
router.post('/analyze/clinical-outcomes', insightsAgentController.analyzeClinicalOutcomes);

// Dashboard Data
router.get('/dashboard/summary', insightsAgentController.getDashboardSummary);
router.get('/dashboard/charts', insightsAgentController.getDashboardCharts);
router.get('/dashboard/kpis', insightsAgentController.getDashboardKPIs);

// Custom Analytics
router.post('/custom-analysis', insightsAgentController.performCustomAnalysis);
router.get('/insights/recommendations', insightsAgentController.getRecommendations);

export default router; 