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
exports.MakeAgentController = void 0;
const mock_agent_service_1 = require("../services/mock_agent_service");
class MakeAgentController {
    constructor() {
        // Speech Recognition
        this.transcribeSpeech = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const audioData = req.body;
                const transcription = yield this.makeAgentService.mockMethod('transcribe_speech', audioData);
                res.json({
                    success: true,
                    data: transcription,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to transcribe speech',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.processAudio = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const audioConfig = req.body;
                const result = yield this.makeAgentService.mockMethod('process_audio', audioConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to process audio',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getTranscriptions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transcriptions = yield this.makeAgentService.getTranscriptions();
                res.json({
                    success: true,
                    data: transcriptions,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get transcriptions',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Medical Records Processing
        this.processMedicalRecord = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recordData = req.body;
                const result = yield this.makeAgentService.mockMethod('process_medical_record', recordData);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to process medical record',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.extractMedicalData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recordData = req.body;
                const extractedData = yield this.makeAgentService.mockMethod('extract_medical_data', recordData);
                res.json({
                    success: true,
                    data: extractedData,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to extract medical data',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getProcessedRecords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield this.makeAgentService.getProcessedRecords();
                res.json({
                    success: true,
                    data: records,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get processed records',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Document Processing
        this.analyzeDocument = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const documentData = req.body;
                const analysis = yield this.makeAgentService.mockMethod('analyze_document', documentData);
                res.json({
                    success: true,
                    data: analysis,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze document',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.summarizeDocument = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const documentData = req.body;
                const summary = yield this.makeAgentService.mockMethod('summarize_document', documentData);
                res.json({
                    success: true,
                    data: summary,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to summarize document',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.classifyDocument = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const documentData = req.body;
                const classification = yield this.makeAgentService.mockMethod('classify_document', documentData);
                res.json({
                    success: true,
                    data: classification,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to classify document',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Named Entity Recognition
        this.extractEntities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const textData = req.body;
                const entities = yield this.makeAgentService.mockMethod('extract_entities', textData);
                res.json({
                    success: true,
                    data: entities,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to extract entities',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.validateEntities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entitiesData = req.body;
                const validation = yield this.makeAgentService.mockMethod('validate_entities', entitiesData);
                res.json({
                    success: true,
                    data: validation,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to validate entities',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getExtractedEntities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entities = yield this.makeAgentService.mockMethod('get_extracted_entities');
                res.json({
                    success: true,
                    data: entities,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get extracted entities',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Medical Text Processing
        this.processMedicalText = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const textData = req.body;
                const processedText = yield this.makeAgentService.mockMethod('process_medical_text', textData);
                res.json({
                    success: true,
                    data: processedText,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to process medical text',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.validateMedicalText = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const textData = req.body;
                const validation = yield this.makeAgentService.mockMethod('validate_medical_text', textData);
                res.json({
                    success: true,
                    data: validation,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to validate medical text',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.summarizeMedicalText = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const textData = req.body;
                const summary = yield this.makeAgentService.mockMethod('summarize_medical_text', textData);
                res.json({
                    success: true,
                    data: summary,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to summarize medical text',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Quality Assurance
        this.validateRecord = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recordData = req.body;
                const validation = yield this.makeAgentService.mockMethod('validate_record', recordData);
                res.json({
                    success: true,
                    data: validation,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to validate record',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getQualityMetrics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const metrics = yield this.makeAgentService.mockMethod('get_quality_metrics');
                res.json({
                    success: true,
                    data: metrics,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get quality metrics',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.improveRecord = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recordData = req.body;
                const improvedRecord = yield this.makeAgentService.mockMethod('improve_record', recordData);
                res.json({
                    success: true,
                    data: improvedRecord,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to improve record',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Workflow Management
        this.startWorkflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workflowConfig = req.body;
                const workflow = yield this.makeAgentService.mockMethod('start_workflow', workflowConfig);
                res.json({
                    success: true,
                    data: workflow,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to start workflow',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getWorkflowStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { workflowId } = req.params;
                const status = yield this.makeAgentService.mockMethod('get_workflow_status', { workflowId });
                res.json({
                    success: true,
                    data: status,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get workflow status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.completeWorkflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workflowData = req.body;
                const result = yield this.makeAgentService.mockMethod('complete_workflow', workflowData);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to complete workflow',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Batch Processing
        this.processBatch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const batchConfig = req.body;
                const batch = yield this.makeAgentService.mockMethod('process_batch', batchConfig);
                res.json({
                    success: true,
                    data: batch,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to process batch',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getBatchStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { batchId } = req.params;
                const status = yield this.makeAgentService.mockMethod('get_batch_status', { batchId });
                res.json({
                    success: true,
                    data: status,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get batch status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getBatchResults = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { batchId } = req.params;
                const results = yield this.makeAgentService.mockMethod('get_batch_results', { batchId });
                res.json({
                    success: true,
                    data: results,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get batch results',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // Model Management
        this.getModelStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.makeAgentService.mockMethod('get_model_status');
                res.json({
                    success: true,
                    data: status,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get model status',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.retrainModels = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const trainingConfig = req.body;
                const result = yield this.makeAgentService.mockMethod('retrain_models', trainingConfig);
                res.json({
                    success: true,
                    data: result,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrain models',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.getModelPerformance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const performance = yield this.makeAgentService.mockMethod('get_model_performance');
                res.json({
                    success: true,
                    data: performance,
                    timestamp: new Date().toISOString()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get model performance',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.makeAgentService = new mock_agent_service_1.MockAgentService();
    }
}
exports.MakeAgentController = MakeAgentController;
