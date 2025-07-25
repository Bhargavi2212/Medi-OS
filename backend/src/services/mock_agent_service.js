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
exports.MockAgentService = void 0;
class MockAgentService {
    constructor() {
        // Mock data for testing
        this.mockData = {
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
    }
    // Mock methods that return realistic data
    generateAnalyticsOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mockData.analytics.overview;
        });
    }
    analyzeTrends(timeRange, metrics) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                timeRange,
                metrics,
                trends: this.mockData.analytics.trends
            };
        });
    }
    getPerformanceMetrics(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, this.mockData.analytics.performance), { params });
        });
    }
    getMarketOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mockData.market.overview;
        });
    }
    getMarketTrends(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                timeRange,
                trends: this.mockData.market.trends
            };
        });
    }
    getConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mockData.integration.connections;
        });
    }
    getSyncStatus(syncId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign({ syncId }, this.mockData.integration.syncStatus);
        });
    }
    getTranscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mockData.make.transcriptions;
        });
    }
    getProcessedRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mockData.make.processedRecords;
        });
    }
    // Generic mock method for any other calls
    mockMethod(method_1) {
        return __awaiter(this, arguments, void 0, function* (method, params = {}) {
            return {
                method,
                params,
                status: 'success',
                message: 'Mock response for testing',
                timestamp: new Date().toISOString()
            };
        });
    }
}
exports.MockAgentService = MockAgentService;
