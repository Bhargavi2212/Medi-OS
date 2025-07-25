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
exports.InsightsAgentController = void 0;
const mock_agent_service_1 = require("../services/mock_agent_service");
class InsightsAgentController {
    constructor() {
        // Analytics Overview
        this.getAnalyticsOverview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const overview = yield this.insightsAgentService.generateAnalyticsOverview();
                res.json({
                    success: true,
                    data: overview,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate analytics overview',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Trend Analysis
        this.getTrendAnalysis = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange = '30d', metrics = 'all' } = req.query;
                const trends = yield this.insightsAgentService.analyzeTrends(timeRange, metrics);
                res.json({
                    success: true,
                    data: trends,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze trends',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Performance Metrics
        this.getPerformanceMetrics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { hospitalId, department, timeRange } = req.query;
                const metrics = yield this.insightsAgentService.getPerformanceMetrics({
                    hospitalId: hospitalId,
                    department: department,
                    timeRange: timeRange
                });
                res.json({
                    success: true,
                    data: metrics,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get performance metrics',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Predictive Insights
        this.getPredictiveInsights = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { predictionType = 'patient_flow', horizon = '30d' } = req.query;
                const predictions = yield this.insightsAgentService.mockMethod('generate_predictive_insights', {
                    predictionType,
                    horizon
                });
                res.json({
                    success: true,
                    data: predictions,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate predictive insights',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Report Generation
        this.generateReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reportType, parameters, format = 'json' } = req.body;
                const report = yield this.insightsAgentService.mockMethod('generate_report', {
                    reportType,
                    parameters,
                    format
                });
                res.json({
                    success: true,
                    data: report,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate report',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reportId } = req.params;
                const report = yield this.insightsAgentService.mockMethod('get_report', { reportId });
                res.json({
                    success: true,
                    data: report,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve report',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getAllReports = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit = 10, offset = 0 } = req.query;
                const reports = yield this.insightsAgentService.mockMethod('get_all_reports', { limit, offset });
                res.json({
                    success: true,
                    data: reports,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve reports',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Data Analysis
        this.analyzePatientData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientIds, analysisType, parameters } = req.body;
                const analysis = yield this.insightsAgentService.mockMethod('analyze_patient_data', {
                    patientIds,
                    analysisType,
                    parameters
                });
                res.json({
                    success: true,
                    data: analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze patient data',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.analyzeHospitalPerformance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { hospitalId, metrics, timeRange } = req.body;
                const analysis = yield this.insightsAgentService.mockMethod('analyze_hospital_performance', {
                    hospitalId,
                    metrics,
                    timeRange
                });
                res.json({
                    success: true,
                    data: analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze hospital performance',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.analyzeClinicalOutcomes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { conditions, timeRange, outcomeMetrics } = req.body;
                const analysis = yield this.insightsAgentService.mockMethod('analyze_clinical_outcomes', {
                    conditions,
                    timeRange,
                    outcomeMetrics
                });
                res.json({
                    success: true,
                    data: analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze clinical outcomes',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Dashboard Data
        this.getDashboardSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { hospitalId, userId } = req.query;
                const summary = yield this.insightsAgentService.mockMethod('get_dashboard_summary', {
                    hospitalId,
                    userId
                });
                res.json({
                    success: true,
                    data: summary,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get dashboard summary',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getDashboardCharts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chartTypes, timeRange } = req.query;
                const charts = yield this.insightsAgentService.mockMethod('get_dashboard_charts', {
                    chartTypes,
                    timeRange
                });
                res.json({
                    success: true,
                    data: charts,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get dashboard charts',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getDashboardKPIs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { kpiTypes, timeRange } = req.query;
                const kpis = yield this.insightsAgentService.mockMethod('get_dashboard_kpis', {
                    kpiTypes,
                    timeRange
                });
                res.json({
                    success: true,
                    data: kpis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get dashboard KPIs',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Custom Analytics
        this.performCustomAnalysis = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { analysisType, parameters, dataSource } = req.body;
                const analysis = yield this.insightsAgentService.mockMethod('perform_custom_analysis', {
                    analysisType,
                    parameters,
                    dataSource
                });
                res.json({
                    success: true,
                    data: analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to perform custom analysis',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getRecommendations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { context, userId, hospitalId } = req.query;
                const recommendations = yield this.insightsAgentService.mockMethod('get_recommendations', {
                    context,
                    userId,
                    hospitalId
                });
                res.json({
                    success: true,
                    data: recommendations,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get recommendations',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.insightsAgentService = new mock_agent_service_1.MockAgentService();
    }
}
exports.InsightsAgentController = InsightsAgentController;
