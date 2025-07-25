import { Router } from 'express';
import authRoutes from './auth.routes';
import hospitalRoutes from './hospital.routes';
import manageAgentRoutes from './manage_agent.routes';
import insightsAgentRoutes from './insights_agent.routes';
import integrationAgentRoutes from './integration_agent.routes';
import marketAgentRoutes from './market_agent.routes';
import makeAgentRoutes from './make_agent.routes';

const router = Router();

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
router.use('/api/auth', authRoutes);
router.use('/api/hospitals', hospitalRoutes);
router.use('/api/manage-agent', manageAgentRoutes);
router.use('/api/insights-agent', insightsAgentRoutes);
router.use('/api/integration-agent', integrationAgentRoutes);
router.use('/api/market-agent', marketAgentRoutes);
router.use('/api/make-agent', makeAgentRoutes);

export default router; 