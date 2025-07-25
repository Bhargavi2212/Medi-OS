export class MockAgentService {
  // Mock data for testing
  private mockData = {
    analytics: {
      overview: {
        totalPatients: 1250,
        activeAppointments: 45,
        revenue: 125000,
        efficiency: 87.5
      },
      trends: {
        patientGrowth: 12.5,
        revenueGrowth: 8.3,
        efficiencyTrend: 2.1
      },
      performance: {
        waitTime: 15.2,
        satisfaction: 4.2,
        readmissionRate: 3.1
      }
    },
    market: {
      overview: {
        marketSize: 2500000000,
        growthRate: 6.8,
        competition: 12,
        opportunities: 8
      },
      trends: {
        telehealth: 45.2,
        aiAdoption: 23.1,
        digitalHealth: 67.8
      }
    },
    integration: {
      connections: [
        { id: 'conn1', system: 'EMR', status: 'active' },
        { id: 'conn2', system: 'PACS', status: 'active' },
        { id: 'conn3', system: 'Lab', status: 'inactive' }
      ],
      syncStatus: {
        lastSync: '2024-01-01T10:00:00Z',
        recordsSynced: 1250,
        errors: 0
      }
    },
    make: {
      transcriptions: [
        { id: 'trans1', text: 'Patient reports chest pain', confidence: 0.95 },
        { id: 'trans2', text: 'Blood pressure 120/80', confidence: 0.92 }
      ],
      processedRecords: [
        { id: 'rec1', type: 'consultation', status: 'processed' },
        { id: 'rec2', type: 'lab_report', status: 'processing' }
      ]
    }
  };

  // Mock methods that return realistic data
  async generateAnalyticsOverview() {
    return this.mockData.analytics.overview;
  }

  async analyzeTrends(timeRange: string, metrics: string) {
    return {
      timeRange,
      metrics,
      trends: this.mockData.analytics.trends
    };
  }

  async getPerformanceMetrics(params: any) {
    return {
      ...this.mockData.analytics.performance,
      params
    };
  }

  async getMarketOverview() {
    return this.mockData.market.overview;
  }

  async getMarketTrends(timeRange: string) {
    return {
      timeRange,
      trends: this.mockData.market.trends
    };
  }

  async getConnections() {
    return this.mockData.integration.connections;
  }

  async getSyncStatus(syncId: string) {
    return {
      syncId,
      ...this.mockData.integration.syncStatus
    };
  }

  async getTranscriptions() {
    return this.mockData.make.transcriptions;
  }

  async getProcessedRecords() {
    return this.mockData.make.processedRecords;
  }

  // Generic mock method for any other calls
  async mockMethod(method: string, params: any = {}) {
    return {
      method,
      params,
      status: 'success',
      message: 'Mock response for testing',
      timestamp: new Date().toISOString()
    };
  }
} 