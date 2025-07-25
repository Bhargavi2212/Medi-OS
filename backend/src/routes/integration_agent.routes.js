"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const integration_agent_controller_1 = require("../controllers/integration_agent.controller");
const router = (0, express_1.Router)();
const integrationAgentController = new integration_agent_controller_1.IntegrationAgentController();
// System Integration Routes
router.post('/connect/system', integrationAgentController.connectSystem);
router.get('/connections', integrationAgentController.getConnections);
router.delete('/connections/:connectionId', integrationAgentController.disconnectSystem);
// Data Synchronization
router.post('/sync/data', integrationAgentController.syncData);
router.get('/sync/status/:syncId', integrationAgentController.getSyncStatus);
router.get('/sync/history', integrationAgentController.getSyncHistory);
// API Management
router.post('/apis/register', integrationAgentController.registerAPI);
router.get('/apis', integrationAgentController.getRegisteredAPIs);
router.put('/apis/:apiId', integrationAgentController.updateAPI);
router.delete('/apis/:apiId', integrationAgentController.deleteAPI);
// Data Transformation
router.post('/transform/data', integrationAgentController.transformData);
router.post('/transform/mapping', integrationAgentController.createDataMapping);
router.get('/transform/mappings', integrationAgentController.getDataMappings);
// Workflow Integration
router.post('/workflows/create', integrationAgentController.createWorkflow);
router.get('/workflows', integrationAgentController.getWorkflows);
router.put('/workflows/:workflowId', integrationAgentController.updateWorkflow);
router.delete('/workflows/:workflowId', integrationAgentController.deleteWorkflow);
// Monitoring and Health
router.get('/health/connections', integrationAgentController.checkConnectionHealth);
router.get('/health/systems', integrationAgentController.getSystemHealth);
router.post('/health/test', integrationAgentController.testConnection);
// Error Handling and Logs
router.get('/logs/errors', integrationAgentController.getErrorLogs);
router.get('/logs/sync', integrationAgentController.getSyncLogs);
router.post('/logs/clear', integrationAgentController.clearLogs);
exports.default = router;
