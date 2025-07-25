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
exports.MarketAgentService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
class MarketAgentService {
    constructor() {
        this.pythonPath = 'python';
        this.agentPath = path_1.default.join(__dirname, '../ml/agents/market_agent/market_agent.py');
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
    // Market Analysis
    getMarketOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_market_overview');
        });
    }
    getMarketTrends(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_market_trends', { timeRange });
        });
    }
    getCompetitorAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_competitor_analysis');
        });
    }
    getMarketOpportunities() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_market_opportunities');
        });
    }
    // Business Intelligence
    getBIDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_bi_dashboard');
        });
    }
    getBIReports() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_bi_reports');
        });
    }
    generateBIReport(reportConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('generate_bi_report', reportConfig);
        });
    }
    // Competitive Intelligence
    getCompetitiveAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_competitive_analysis');
        });
    }
    getCompetitiveBenchmarking() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_competitive_benchmarking');
        });
    }
    getCompetitiveMonitoring() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_competitive_monitoring');
        });
    }
    // Market Research
    conductMarketResearch(researchConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('conduct_market_research', researchConfig);
        });
    }
    getMarketStudies() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_market_studies');
        });
    }
    getResearchInsights() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_research_insights');
        });
    }
    // Strategic Planning
    developStrategy(strategyConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('develop_strategy', strategyConfig);
        });
    }
    getStrategicRecommendations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_strategic_recommendations');
        });
    }
    validateStrategy(strategyData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('validate_strategy', strategyData);
        });
    }
    // Performance Metrics
    getROIMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_roi_metrics');
        });
    }
    getGrowthMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_growth_metrics');
        });
    }
    getEfficiencyMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_efficiency_metrics');
        });
    }
    // Market Forecasting
    generateForecast(forecastConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('generate_forecast', forecastConfig);
        });
    }
    getForecastModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_forecast_models');
        });
    }
    getForecastAccuracy() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_forecast_accuracy');
        });
    }
    // Customer Analysis
    getCustomerSegmentation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_customer_segmentation');
        });
    }
    getCustomerBehavior() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_customer_behavior');
        });
    }
    getCustomerSatisfaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_customer_satisfaction');
        });
    }
}
exports.MarketAgentService = MarketAgentService;
