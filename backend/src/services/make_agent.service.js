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
exports.MakeAgentService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
class MakeAgentService {
    constructor() {
        this.pythonPath = 'python';
        this.agentPath = path_1.default.join(__dirname, '../ml/agents/make_agent/make_agent.py');
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
    // Speech Recognition
    transcribeSpeech(audioData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('transcribe_speech', audioData);
        });
    }
    processAudio(audioConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('process_audio', audioConfig);
        });
    }
    getTranscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_transcriptions');
        });
    }
    // Medical Records Processing
    processMedicalRecord(recordData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('process_medical_record', recordData);
        });
    }
    extractMedicalData(recordData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('extract_medical_data', recordData);
        });
    }
    getProcessedRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_processed_records');
        });
    }
    // Document Processing
    analyzeDocument(documentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('analyze_document', documentData);
        });
    }
    summarizeDocument(documentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('summarize_document', documentData);
        });
    }
    classifyDocument(documentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('classify_document', documentData);
        });
    }
    // Named Entity Recognition
    extractEntities(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('extract_entities', textData);
        });
    }
    validateEntities(entitiesData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('validate_entities', entitiesData);
        });
    }
    getExtractedEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_extracted_entities');
        });
    }
    // Medical Text Processing
    processMedicalText(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('process_medical_text', textData);
        });
    }
    validateMedicalText(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('validate_medical_text', textData);
        });
    }
    summarizeMedicalText(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('summarize_medical_text', textData);
        });
    }
    // Quality Assurance
    validateRecord(recordData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('validate_record', recordData);
        });
    }
    getQualityMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_quality_metrics');
        });
    }
    improveRecord(recordData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('improve_record', recordData);
        });
    }
    // Workflow Management
    startWorkflow(workflowConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('start_workflow', workflowConfig);
        });
    }
    getWorkflowStatus(workflowId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_workflow_status', { workflowId });
        });
    }
    completeWorkflow(workflowData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('complete_workflow', workflowData);
        });
    }
    // Batch Processing
    processBatch(batchConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('process_batch', batchConfig);
        });
    }
    getBatchStatus(batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_batch_status', { batchId });
        });
    }
    getBatchResults(batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_batch_results', { batchId });
        });
    }
    // Model Management
    getModelStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_model_status');
        });
    }
    retrainModels(trainingConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('retrain_models', trainingConfig);
        });
    }
    getModelPerformance() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callPythonAgent('get_model_performance');
        });
    }
}
exports.MakeAgentService = MakeAgentService;
