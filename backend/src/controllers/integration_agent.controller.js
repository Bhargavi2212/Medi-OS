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
exports.IntegrationAgentController = void 0;
const mock_agent_service_1 = require("../services/mock_agent_service");
class IntegrationAgentController {
    constructor() {
        // System Integration
        this.connectSystem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connectionConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('connect_system', connectionConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to connect system',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getConnections = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connections = yield this.integrationAgentService.getConnections();
                res.json({
                    success: true,
                    data: connections,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get connections',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.disconnectSystem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { connectionId } = req.params;
                const result = yield this.integrationAgentService.mockMethod('disconnect_system', { connectionId });
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to disconnect system',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Data Synchronization
        this.syncData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const syncConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('sync_data', syncConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to sync data',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getSyncStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { syncId } = req.params;
                const status = yield this.integrationAgentService.getSyncStatus(syncId);
                res.json({
                    success: true,
                    data: status,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get sync status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getSyncHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const history = yield this.integrationAgentService.mockMethod('get_sync_history');
                res.json({
                    success: true,
                    data: history,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get sync history',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // API Management
        this.registerAPI = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const apiConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('register_api', apiConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to register API',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getRegisteredAPIs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const apis = yield this.integrationAgentService.mockMethod('get_registered_apis');
                res.json({
                    success: true,
                    data: apis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get registered APIs',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.updateAPI = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { apiId } = req.params;
                const apiConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('update_api', Object.assign({ apiId }, apiConfig));
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to update API',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.deleteAPI = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { apiId } = req.params;
                const result = yield this.integrationAgentService.mockMethod('delete_api', { apiId });
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete API',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Data Transformation
        this.transformData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, transformationRules } = req.body;
                const result = yield this.integrationAgentService.mockMethod('transform_data', { data, transformationRules });
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to transform data',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.createDataMapping = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mappingConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('create_data_mapping', mappingConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to create data mapping',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getDataMappings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mappings = yield this.integrationAgentService.mockMethod('get_data_mappings');
                res.json({
                    success: true,
                    data: mappings,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get data mappings',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Workflow Integration
        this.createWorkflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workflowConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('create_workflow', workflowConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to create workflow',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getWorkflows = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workflows = yield this.integrationAgentService.mockMethod('get_workflows');
                res.json({
                    success: true,
                    data: workflows,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get workflows',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.updateWorkflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { workflowId } = req.params;
                const workflowConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('update_workflow', Object.assign({ workflowId }, workflowConfig));
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to update workflow',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.deleteWorkflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { workflowId } = req.params;
                const result = yield this.integrationAgentService.mockMethod('delete_workflow', { workflowId });
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete workflow',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Monitoring and Health
        this.checkConnectionHealth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield this.integrationAgentService.mockMethod('check_connection_health');
                res.json({
                    success: true,
                    data: health,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to check connection health',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getSystemHealth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield this.integrationAgentService.mockMethod('get_system_health');
                res.json({
                    success: true,
                    data: health,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get system health',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.testConnection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connectionConfig = req.body;
                const result = yield this.integrationAgentService.mockMethod('test_connection', connectionConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to test connection',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Error Handling and Logs
        this.getErrorLogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield this.integrationAgentService.mockMethod('get_error_logs');
                res.json({
                    success: true,
                    data: logs,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get error logs',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getSyncLogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield this.integrationAgentService.mockMethod('get_sync_logs');
                res.json({
                    success: true,
                    data: logs,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get sync logs',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.clearLogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.integrationAgentService.mockMethod('clear_logs');
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to clear logs',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.integrationAgentService = new mock_agent_service_1.MockAgentService();
    }
}
exports.IntegrationAgentController = IntegrationAgentController;
