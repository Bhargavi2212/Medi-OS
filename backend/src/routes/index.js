"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const hospital_routes_1 = __importDefault(require("./hospital.routes"));
const manage_agent_routes_1 = __importDefault(require("./manage_agent.routes"));
const insights_agent_routes_1 = __importDefault(require("./insights_agent.routes"));
const integration_agent_routes_1 = __importDefault(require("./integration_agent.routes"));
const market_agent_routes_1 = __importDefault(require("./market_agent.routes"));
const make_agent_routes_1 = __importDefault(require("./make_agent.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Healthcare OS API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        agents: [
            'ManageAgent',
            'InsightsAgent',
            'IntegrationAgent',
            'MarketAgent',
            'MakeAgent'
        ]
    });
});
// API Documentation
router.get('/api', (req, res) => {
    res.json({
        message: 'Healthcare OS API Documentation',
        endpoints: {
            auth: '/api/auth',
            hospitals: '/api/hospitals',
            manageAgent: '/api/manage-agent',
            insightsAgent: '/api/insights-agent',
            integrationAgent: '/api/integration-agent',
            marketAgent: '/api/market-agent',
            makeAgent: '/api/make-agent'
        },
        documentation: 'https://healthcare-os-api-docs.com'
    });
});
// API routes
router.use('/api/auth', auth_routes_1.default);
router.use('/api/hospitals', hospital_routes_1.default);
router.use('/api/manage-agent', manage_agent_routes_1.default);
router.use('/api/insights-agent', insights_agent_routes_1.default);
router.use('/api/integration-agent', integration_agent_routes_1.default);
router.use('/api/market-agent', market_agent_routes_1.default);
router.use('/api/make-agent', make_agent_routes_1.default);
exports.default = router;
