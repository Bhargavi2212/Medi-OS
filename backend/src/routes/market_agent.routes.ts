import { Router } from 'express';
import { MarketAgentController } from '../controllers/market_agent.controller';

const router = Router();
const marketAgentController = new MarketAgentController();

// Market Analysis Routes
router.get('/analysis/overview', marketAgentController.getMarketOverview);
router.get('/analysis/trends', marketAgentController.getMarketTrends);
router.get('/analysis/competitors', marketAgentController.getCompetitorAnalysis);
router.get('/analysis/opportunities', marketAgentController.getMarketOpportunities);

// Business Intelligence
router.get('/bi/dashboard', marketAgentController.getBIDashboard);
router.get('/bi/reports', marketAgentController.getBIReports);
router.post('/bi/generate-report', marketAgentController.generateBIReport);

// Competitive Intelligence
router.get('/competitive/analysis', marketAgentController.getCompetitiveAnalysis);
router.get('/competitive/benchmarking', marketAgentController.getCompetitiveBenchmarking);
router.get('/competitive/monitoring', marketAgentController.getCompetitiveMonitoring);

// Market Research
router.post('/research/conduct', marketAgentController.conductMarketResearch);
router.get('/research/studies', marketAgentController.getMarketStudies);
router.get('/research/insights', marketAgentController.getResearchInsights);

// Strategic Planning
router.post('/strategy/develop', marketAgentController.developStrategy);
router.get('/strategy/recommendations', marketAgentController.getStrategicRecommendations);
router.post('/strategy/validate', marketAgentController.validateStrategy);

// Performance Metrics
router.get('/metrics/roi', marketAgentController.getROIMetrics);
router.get('/metrics/growth', marketAgentController.getGrowthMetrics);
router.get('/metrics/efficiency', marketAgentController.getEfficiencyMetrics);

// Market Forecasting
router.post('/forecast/generate', marketAgentController.generateForecast);
router.get('/forecast/models', marketAgentController.getForecastModels);
router.get('/forecast/accuracy', marketAgentController.getForecastAccuracy);

// Customer Analysis
router.get('/customers/segmentation', marketAgentController.getCustomerSegmentation);
router.get('/customers/behavior', marketAgentController.getCustomerBehavior);
router.get('/customers/satisfaction', marketAgentController.getCustomerSatisfaction);

export default router; 