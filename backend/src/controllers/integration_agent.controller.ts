import { Request, Response } from 'express';
import { MockAgentService } from '../services/mock_agent_service';

export class IntegrationAgentController {
  private integrationAgentService: MockAgentService;

  constructor() {
    this.integrationAgentService = new MockAgentService();
  }

  // System Integration
  connectSystem = async (req: Request, res: Response) => {
    try {
      const connectionConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('connect_system', connectionConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to connect system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getConnections = async (req: Request, res: Response) => {
    try {
      const connections = await this.integrationAgentService.getConnections();
      res.json({
        success: true,
        data: connections,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get connections',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  disconnectSystem = async (req: Request, res: Response) => {
    try {
      const { connectionId } = req.params;
      const result = await this.integrationAgentService.mockMethod('disconnect_system', { connectionId });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to disconnect system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Data Synchronization
  syncData = async (req: Request, res: Response) => {
    try {
      const syncConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('sync_data', syncConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to sync data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getSyncStatus = async (req: Request, res: Response) => {
    try {
      const { syncId } = req.params;
      const status = await this.integrationAgentService.getSyncStatus(syncId);
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getSyncHistory = async (req: Request, res: Response) => {
    try {
      const history = await this.integrationAgentService.mockMethod('get_sync_history');
      res.json({
        success: true,
        data: history,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get sync history',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // API Management
  registerAPI = async (req: Request, res: Response) => {
    try {
      const apiConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('register_api', apiConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to register API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getRegisteredAPIs = async (req: Request, res: Response) => {
    try {
      const apis = await this.integrationAgentService.mockMethod('get_registered_apis');
      res.json({
        success: true,
        data: apis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get registered APIs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  updateAPI = async (req: Request, res: Response) => {
    try {
      const { apiId } = req.params;
      const apiConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('update_api', { apiId, ...apiConfig });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  deleteAPI = async (req: Request, res: Response) => {
    try {
      const { apiId } = req.params;
      const result = await this.integrationAgentService.mockMethod('delete_api', { apiId });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Data Transformation
  transformData = async (req: Request, res: Response) => {
    try {
      const { data, transformationRules } = req.body;
      const result = await this.integrationAgentService.mockMethod('transform_data', { data, transformationRules });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to transform data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  createDataMapping = async (req: Request, res: Response) => {
    try {
      const mappingConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('create_data_mapping', mappingConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create data mapping',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getDataMappings = async (req: Request, res: Response) => {
    try {
      const mappings = await this.integrationAgentService.mockMethod('get_data_mappings');
      res.json({
        success: true,
        data: mappings,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get data mappings',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Workflow Integration
  createWorkflow = async (req: Request, res: Response) => {
    try {
      const workflowConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('create_workflow', workflowConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getWorkflows = async (req: Request, res: Response) => {
    try {
      const workflows = await this.integrationAgentService.mockMethod('get_workflows');
      res.json({
        success: true,
        data: workflows,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get workflows',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  updateWorkflow = async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;
      const workflowConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('update_workflow', { workflowId, ...workflowConfig });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  deleteWorkflow = async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;
      const result = await this.integrationAgentService.mockMethod('delete_workflow', { workflowId });
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Monitoring and Health
  checkConnectionHealth = async (req: Request, res: Response) => {
    try {
      const health = await this.integrationAgentService.mockMethod('check_connection_health');
      res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to check connection health',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getSystemHealth = async (req: Request, res: Response) => {
    try {
      const health = await this.integrationAgentService.mockMethod('get_system_health');
      res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get system health',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  testConnection = async (req: Request, res: Response) => {
    try {
      const connectionConfig = req.body;
      const result = await this.integrationAgentService.mockMethod('test_connection', connectionConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to test connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Error Handling and Logs
  getErrorLogs = async (req: Request, res: Response) => {
    try {
      const logs = await this.integrationAgentService.mockMethod('get_error_logs');
      res.json({
        success: true,
        data: logs,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get error logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getSyncLogs = async (req: Request, res: Response) => {
    try {
      const logs = await this.integrationAgentService.mockMethod('get_sync_logs');
      res.json({
        success: true,
        data: logs,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get sync logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  clearLogs = async (req: Request, res: Response) => {
    try {
      const result = await this.integrationAgentService.mockMethod('clear_logs');
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to clear logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 