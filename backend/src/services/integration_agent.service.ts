import { spawn } from 'child_process';
import path from 'path';

export class IntegrationAgentService {
  private pythonPath: string;
  private agentPath: string;

  constructor() {
    this.pythonPath = 'python';
    this.agentPath = path.join(__dirname, '../ml/agents/integration_agent/integration_agent.py');
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

  // System Integration
  async connectSystem(connectionConfig: any): Promise<any> {
    return this.callPythonAgent('connect_system', connectionConfig);
  }

  async getConnections(): Promise<any> {
    return this.callPythonAgent('get_connections');
  }

  async disconnectSystem(connectionId: string): Promise<any> {
    return this.callPythonAgent('disconnect_system', { connectionId });
  }

  // Data Synchronization
  async syncData(syncConfig: any): Promise<any> {
    return this.callPythonAgent('sync_data', syncConfig);
  }

  async getSyncStatus(syncId: string): Promise<any> {
    return this.callPythonAgent('get_sync_status', { syncId });
  }

  async getSyncHistory(): Promise<any> {
    return this.callPythonAgent('get_sync_history');
  }

  // API Management
  async registerAPI(apiConfig: any): Promise<any> {
    return this.callPythonAgent('register_api', apiConfig);
  }

  async getRegisteredAPIs(): Promise<any> {
    return this.callPythonAgent('get_registered_apis');
  }

  async updateAPI(apiId: string, apiConfig: any): Promise<any> {
    return this.callPythonAgent('update_api', { apiId, ...apiConfig });
  }

  async deleteAPI(apiId: string): Promise<any> {
    return this.callPythonAgent('delete_api', { apiId });
  }

  // Data Transformation
  async transformData(data: any, transformationRules: any): Promise<any> {
    return this.callPythonAgent('transform_data', { data, transformationRules });
  }

  async createDataMapping(mappingConfig: any): Promise<any> {
    return this.callPythonAgent('create_data_mapping', mappingConfig);
  }

  async getDataMappings(): Promise<any> {
    return this.callPythonAgent('get_data_mappings');
  }

  // Workflow Integration
  async createWorkflow(workflowConfig: any): Promise<any> {
    return this.callPythonAgent('create_workflow', workflowConfig);
  }

  async getWorkflows(): Promise<any> {
    return this.callPythonAgent('get_workflows');
  }

  async updateWorkflow(workflowId: string, workflowConfig: any): Promise<any> {
    return this.callPythonAgent('update_workflow', { workflowId, ...workflowConfig });
  }

  async deleteWorkflow(workflowId: string): Promise<any> {
    return this.callPythonAgent('delete_workflow', { workflowId });
  }

  // Monitoring and Health
  async checkConnectionHealth(): Promise<any> {
    return this.callPythonAgent('check_connection_health');
  }

  async getSystemHealth(): Promise<any> {
    return this.callPythonAgent('get_system_health');
  }

  async testConnection(connectionConfig: any): Promise<any> {
    return this.callPythonAgent('test_connection', connectionConfig);
  }

  // Error Handling and Logs
  async getErrorLogs(): Promise<any> {
    return this.callPythonAgent('get_error_logs');
  }

  async getSyncLogs(): Promise<any> {
    return this.callPythonAgent('get_sync_logs');
  }

  async clearLogs(): Promise<any> {
    return this.callPythonAgent('clear_logs');
  }
} 