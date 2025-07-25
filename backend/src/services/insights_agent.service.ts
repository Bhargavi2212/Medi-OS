import { spawn } from 'child_process';
import path from 'path';

export class InsightsAgentService {
  private pythonPath: string;
  private agentPath: string;

  constructor() {
    this.pythonPath = 'python'; // or 'python3' depending on your setup
    this.agentPath = path.join(__dirname, '../ml/agents/insights_agent/insights_agent.py');
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

  // Analytics Overview
  async generateAnalyticsOverview(): Promise<any> {
    return this.callPythonAgent('generate_analytics_overview');
  }

  // Trend Analysis
  async analyzeTrends(timeRange: string, metrics: string): Promise<any> {
    return this.callPythonAgent('analyze_trends', { timeRange, metrics });
  }

  // Performance Metrics
  async getPerformanceMetrics(params: any): Promise<any> {
    return this.callPythonAgent('get_performance_metrics', params);
  }

  // Predictive Insights
  async generatePredictiveInsights(predictionType: string, horizon: string): Promise<any> {
    return this.callPythonAgent('generate_predictive_insights', { predictionType, horizon });
  }

  // Report Generation
  async generateReport(reportType: string, parameters: any, format: string): Promise<any> {
    return this.callPythonAgent('generate_report', { reportType, parameters, format });
  }

  async getReport(reportId: string): Promise<any> {
    return this.callPythonAgent('get_report', { reportId });
  }

  async getAllReports(limit: number, offset: number): Promise<any> {
    return this.callPythonAgent('get_all_reports', { limit, offset });
  }

  // Data Analysis
  async analyzePatientData(patientIds: any, analysisType: string, parameters: any): Promise<any> {
    return this.callPythonAgent('analyze_patient_data', { patientIds, analysisType, parameters });
  }

  async analyzeHospitalPerformance(hospitalId: string, metrics: any, timeRange: string): Promise<any> {
    return this.callPythonAgent('analyze_hospital_performance', { hospitalId, metrics, timeRange });
  }

  async analyzeClinicalOutcomes(conditions: any, timeRange: string, outcomeMetrics: any): Promise<any> {
    return this.callPythonAgent('analyze_clinical_outcomes', { conditions, timeRange, outcomeMetrics });
  }

  // Dashboard Data
  async getDashboardSummary(hospitalId: string, userId: string): Promise<any> {
    return this.callPythonAgent('get_dashboard_summary', { hospitalId, userId });
  }

  async getDashboardCharts(chartTypes: string, timeRange: string): Promise<any> {
    return this.callPythonAgent('get_dashboard_charts', { chartTypes, timeRange });
  }

  async getDashboardKPIs(kpiTypes: string, timeRange: string): Promise<any> {
    return this.callPythonAgent('get_dashboard_kpis', { kpiTypes, timeRange });
  }

  // Custom Analytics
  async performCustomAnalysis(analysisType: string, parameters: any, dataSource: string): Promise<any> {
    return this.callPythonAgent('perform_custom_analysis', { analysisType, parameters, dataSource });
  }

  async getRecommendations(context: string, userId: string, hospitalId: string): Promise<any> {
    return this.callPythonAgent('get_recommendations', { context, userId, hospitalId });
  }
} 