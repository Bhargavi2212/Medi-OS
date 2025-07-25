import { spawn } from 'child_process';
import path from 'path';

export class MakeAgentService {
  private pythonPath: string;
  private agentPath: string;

  constructor() {
    this.pythonPath = 'python';
    this.agentPath = path.join(__dirname, '../ml/agents/make_agent/make_agent.py');
  }

  private async callPythonAgent(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
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
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${output}`));
          }
        } else {
          reject(new Error(`Python process failed: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  // Speech Recognition
  async transcribeSpeech(audioData: any): Promise<any> {
    return this.callPythonAgent('transcribe_speech', audioData);
  }

  async processAudio(audioConfig: any): Promise<any> {
    return this.callPythonAgent('process_audio', audioConfig);
  }

  async getTranscriptions(): Promise<any> {
    return this.callPythonAgent('get_transcriptions');
  }

  // Medical Records Processing
  async processMedicalRecord(recordData: any): Promise<any> {
    return this.callPythonAgent('process_medical_record', recordData);
  }

  async extractMedicalData(recordData: any): Promise<any> {
    return this.callPythonAgent('extract_medical_data', recordData);
  }

  async getProcessedRecords(): Promise<any> {
    return this.callPythonAgent('get_processed_records');
  }

  // Document Processing
  async analyzeDocument(documentData: any): Promise<any> {
    return this.callPythonAgent('analyze_document', documentData);
  }

  async summarizeDocument(documentData: any): Promise<any> {
    return this.callPythonAgent('summarize_document', documentData);
  }

  async classifyDocument(documentData: any): Promise<any> {
    return this.callPythonAgent('classify_document', documentData);
  }

  // Named Entity Recognition
  async extractEntities(textData: any): Promise<any> {
    return this.callPythonAgent('extract_entities', textData);
  }

  async validateEntities(entitiesData: any): Promise<any> {
    return this.callPythonAgent('validate_entities', entitiesData);
  }

  async getExtractedEntities(): Promise<any> {
    return this.callPythonAgent('get_extracted_entities');
  }

  // Medical Text Processing
  async processMedicalText(textData: any): Promise<any> {
    return this.callPythonAgent('process_medical_text', textData);
  }

  async validateMedicalText(textData: any): Promise<any> {
    return this.callPythonAgent('validate_medical_text', textData);
  }

  async summarizeMedicalText(textData: any): Promise<any> {
    return this.callPythonAgent('summarize_medical_text', textData);
  }

  // Quality Assurance
  async validateRecord(recordData: any): Promise<any> {
    return this.callPythonAgent('validate_record', recordData);
  }

  async getQualityMetrics(): Promise<any> {
    return this.callPythonAgent('get_quality_metrics');
  }

  async improveRecord(recordData: any): Promise<any> {
    return this.callPythonAgent('improve_record', recordData);
  }

  // Workflow Management
  async startWorkflow(workflowConfig: any): Promise<any> {
    return this.callPythonAgent('start_workflow', workflowConfig);
  }

  async getWorkflowStatus(workflowId: string): Promise<any> {
    return this.callPythonAgent('get_workflow_status', { workflowId });
  }

  async completeWorkflow(workflowData: any): Promise<any> {
    return this.callPythonAgent('complete_workflow', workflowData);
  }

  // Batch Processing
  async processBatch(batchConfig: any): Promise<any> {
    return this.callPythonAgent('process_batch', batchConfig);
  }

  async getBatchStatus(batchId: string): Promise<any> {
    return this.callPythonAgent('get_batch_status', { batchId });
  }

  async getBatchResults(batchId: string): Promise<any> {
    return this.callPythonAgent('get_batch_results', { batchId });
  }

  // Model Management
  async getModelStatus(): Promise<any> {
    return this.callPythonAgent('get_model_status');
  }

  async retrainModels(trainingConfig: any): Promise<any> {
    return this.callPythonAgent('retrain_models', trainingConfig);
  }

  async getModelPerformance(): Promise<any> {
    return this.callPythonAgent('get_model_performance');
  }
} 