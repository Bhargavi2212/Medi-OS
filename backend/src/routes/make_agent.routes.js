"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_agent_controller_1 = require("../controllers/make_agent.controller");
const router = (0, express_1.Router)();
const makeAgentController = new make_agent_controller_1.MakeAgentController();
// Speech Recognition Routes
router.post('/speech/transcribe', makeAgentController.transcribeSpeech);
router.post('/speech/process-audio', makeAgentController.processAudio);
router.get('/speech/transcriptions', makeAgentController.getTranscriptions);
// Medical Records Processing
router.post('/records/process', makeAgentController.processMedicalRecord);
router.post('/records/extract', makeAgentController.extractMedicalData);
router.get('/records/processed', makeAgentController.getProcessedRecords);
// Document Processing
router.post('/documents/analyze', makeAgentController.analyzeDocument);
router.post('/documents/summarize', makeAgentController.summarizeDocument);
router.post('/documents/classify', makeAgentController.classifyDocument);
// Named Entity Recognition
router.post('/ner/extract', makeAgentController.extractEntities);
router.post('/ner/validate', makeAgentController.validateEntities);
router.get('/ner/entities', makeAgentController.getExtractedEntities);
// Medical Text Processing
router.post('/text/process', makeAgentController.processMedicalText);
router.post('/text/validate', makeAgentController.validateMedicalText);
router.post('/text/summarize', makeAgentController.summarizeMedicalText);
// Quality Assurance
router.post('/qa/validate', makeAgentController.validateRecord);
router.get('/qa/quality-metrics', makeAgentController.getQualityMetrics);
router.post('/qa/improve', makeAgentController.improveRecord);
// Workflow Management
router.post('/workflow/start', makeAgentController.startWorkflow);
router.get('/workflow/status/:workflowId', makeAgentController.getWorkflowStatus);
router.post('/workflow/complete', makeAgentController.completeWorkflow);
// Batch Processing
router.post('/batch/process', makeAgentController.processBatch);
router.get('/batch/status/:batchId', makeAgentController.getBatchStatus);
router.get('/batch/results/:batchId', makeAgentController.getBatchResults);
// Model Management
router.get('/models/status', makeAgentController.getModelStatus);
router.post('/models/retrain', makeAgentController.retrainModels);
router.get('/models/performance', makeAgentController.getModelPerformance);
exports.default = router;
