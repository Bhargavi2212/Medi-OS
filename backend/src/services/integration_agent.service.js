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
exports.IntegrationAgentService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
class IntegrationAgentService {
    constructor() {
        this.pythonPath = 'python';
        this.agentPath = path_1.default.join(__dirname, '../ml/agents/integration_agent/integration_agent.py');
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
    // System Integration
    connectSystem(connectionConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('connect_system', connectionConfig);
        });
    }
    getConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_connections');
        });
    }
    disconnectSystem(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('disconnect_system', { connectionId });
        });
    }
    // Data Synchronization
    syncData(syncConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('sync_data', syncConfig);
        });
    }
    getSyncStatus(syncId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_sync_status', { syncId });
        });
    }
    getSyncHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_sync_history');
        });
    }
    // API Management
    registerAPI(apiConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('register_api', apiConfig);
        });
    }
    getRegisteredAPIs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_registered_apis');
        });
    }
    updateAPI(apiId, apiConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('update_api', Object.assign({ apiId }, apiConfig));
        });
    }
    deleteAPI(apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('delete_api', { apiId });
        });
    }
    // Data Transformation
    transformData(data, transformationRules) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('transform_data', { data, transformationRules });
        });
    }
    createDataMapping(mappingConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('create_data_mapping', mappingConfig);
        });
    }
    getDataMappings() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_data_mappings');
        });
    }
    // Workflow Integration
    createWorkflow(workflowConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('create_workflow', workflowConfig);
        });
    }
    getWorkflows() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_workflows');
        });
    }
    updateWorkflow(workflowId, workflowConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('update_workflow', Object.assign({ workflowId }, workflowConfig));
        });
    }
    deleteWorkflow(workflowId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('delete_workflow', { workflowId });
        });
    }
    // Monitoring and Health
    checkConnectionHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('check_connection_health');
        });
    }
    getSystemHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_system_health');
        });
    }
    testConnection(connectionConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('test_connection', connectionConfig);
        });
    }
    // Error Handling and Logs
    getErrorLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_error_logs');
        });
    }
    getSyncLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_sync_logs');
        });
    }
    clearLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('clear_logs');
        });
    }
}
exports.IntegrationAgentService = IntegrationAgentService;
