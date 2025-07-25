import { spawn } from 'child_process';
import path from 'path';

export class MarketAgentService {
  private pythonPath: string;
  private agentPath: string;

  constructor() {
    this.pythonPath = 'python';
    this.agentPath = path.join(__dirname, '../ml/agents/market_agent/market_agent.py');
  }

  private async callPythonAgent(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
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
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${output}`));
          }
        } else {
          reject(new Error(`Python process failed: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  // Market Analysis
  async getMarketOverview(): Promise<any> {
    return this.callPythonAgent('get_market_overview');
  }

  async getMarketTrends(timeRange: string): Promise<any> {
    return this.callPythonAgent('get_market_trends', { timeRange });
  }

  async getCompetitorAnalysis(): Promise<any> {
    return this.callPythonAgent('get_competitor_analysis');
  }

  async getMarketOpportunities(): Promise<any> {
    return this.callPythonAgent('get_market_opportunities');
  }

  // Business Intelligence
  async getBIDashboard(): Promise<any> {
    return this.callPythonAgent('get_bi_dashboard');
  }

  async getBIReports(): Promise<any> {
    return this.callPythonAgent('get_bi_reports');
  }

  async generateBIReport(reportConfig: any): Promise<any> {
    return this.callPythonAgent('generate_bi_report', reportConfig);
  }

  // Competitive Intelligence
  async getCompetitiveAnalysis(): Promise<any> {
    return this.callPythonAgent('get_competitive_analysis');
  }

  async getCompetitiveBenchmarking(): Promise<any> {
    return this.callPythonAgent('get_competitive_benchmarking');
  }

  async getCompetitiveMonitoring(): Promise<any> {
    return this.callPythonAgent('get_competitive_monitoring');
  }

  // Market Research
  async conductMarketResearch(researchConfig: any): Promise<any> {
    return this.callPythonAgent('conduct_market_research', researchConfig);
  }

  async getMarketStudies(): Promise<any> {
    return this.callPythonAgent('get_market_studies');
  }

  async getResearchInsights(): Promise<any> {
    return this.callPythonAgent('get_research_insights');
  }

  // Strategic Planning
  async developStrategy(strategyConfig: any): Promise<any> {
    return this.callPythonAgent('develop_strategy', strategyConfig);
  }

  async getStrategicRecommendations(): Promise<any> {
    return this.callPythonAgent('get_strategic_recommendations');
  }

  async validateStrategy(strategyData: any): Promise<any> {
    return this.callPythonAgent('validate_strategy', strategyData);
  }

  // Performance Metrics
  async getROIMetrics(): Promise<any> {
    return this.callPythonAgent('get_roi_metrics');
  }

  async getGrowthMetrics(): Promise<any> {
    return this.callPythonAgent('get_growth_metrics');
  }

  async getEfficiencyMetrics(): Promise<any> {
    return this.callPythonAgent('get_efficiency_metrics');
  }

  // Market Forecasting
  async generateForecast(forecastConfig: any): Promise<any> {
    return this.callPythonAgent('generate_forecast', forecastConfig);
  }

  async getForecastModels(): Promise<any> {
    return this.callPythonAgent('get_forecast_models');
  }

  async getForecastAccuracy(): Promise<any> {
    return this.callPythonAgent('get_forecast_accuracy');
  }

  // Customer Analysis
  async getCustomerSegmentation(): Promise<any> {
    return this.callPythonAgent('get_customer_segmentation');
  }

  async getCustomerBehavior(): Promise<any> {
    return this.callPythonAgent('get_customer_behavior');
  }

  async getCustomerSatisfaction(): Promise<any> {
    return this.callPythonAgent('get_customer_satisfaction');
  }
} 