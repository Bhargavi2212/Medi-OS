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
exports.InsightsAgentService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
class InsightsAgentService {
    constructor() {
        this.pythonPath = 'python'; // or 'python3' depending on your setup
        this.agentPath = path_1.default.join(__dirname, '../ml/agents/insights_agent/insights_agent.py');
    }
    callPythonAgent(method_1) {
        return __awaiter(this, arguments, void 0, function* (method, params = {}) {
            return new Promise((resolve, reject) => {
                const pythonProcess = (0, child_process_1.spawn)(this.pythonPath, [
                    this.agentPath,
                    '--method', method,
                    '--params', JSON.stringify(params)
                ]);
                let output = '';
                let errorOutput = '';
                pythonProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });
                pythonProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        try {
                            const result = JSON.parse(output);
                            resolve(result);
                        }
                        catch (error) {
                            reject(new Error(`Failed to parse Python output: ${output}`));
                        }
                    }
                    else {
                        reject(new Error(`Python process failed: ${errorOutput}`));
                    }
                });
                pythonProcess.on('error', (error) => {
                    reject(new Error(`Failed to start Python process: ${error.message}`));
                });
            });
        });
    }
    // Analytics Overview
    generateAnalyticsOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('generate_analytics_overview');
        });
    }
    // Trend Analysis
    analyzeTrends(timeRange, metrics) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('analyze_trends', { timeRange, metrics });
        });
    }
    // Performance Metrics
    getPerformanceMetrics(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_performance_metrics', params);
        });
    }
    // Predictive Insights
    generatePredictiveInsights(predictionType, horizon) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('generate_predictive_insights', { predictionType, horizon });
        });
    }
    // Report Generation
    generateReport(reportType, parameters, format) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('generate_report', { reportType, parameters, format });
        });
    }
    getReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_report', { reportId });
        });
    }
    getAllReports(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_all_reports', { limit, offset });
        });
    }
    // Data Analysis
    analyzePatientData(patientIds, analysisType, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('analyze_patient_data', { patientIds, analysisType, parameters });
        });
    }
    analyzeHospitalPerformance(hospitalId, metrics, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('analyze_hospital_performance', { hospitalId, metrics, timeRange });
        });
    }
    analyzeClinicalOutcomes(conditions, timeRange, outcomeMetrics) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('analyze_clinical_outcomes', { conditions, timeRange, outcomeMetrics });
        });
    }
    // Dashboard Data
    getDashboardSummary(hospitalId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_dashboard_summary', { hospitalId, userId });
        });
    }
    getDashboardCharts(chartTypes, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_dashboard_charts', { chartTypes, timeRange });
        });
    }
    getDashboardKPIs(kpiTypes, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_dashboard_kpis', { kpiTypes, timeRange });
        });
    }
    // Custom Analytics
    performCustomAnalysis(analysisType, parameters, dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('perform_custom_analysis', { analysisType, parameters, dataSource });
        });
    }
    getRecommendations(context, userId, hospitalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_recommendations', { context, userId, hospitalId });
        });
    }
}
exports.InsightsAgentService = InsightsAgentService;
