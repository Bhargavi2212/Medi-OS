import { Request, Response } from 'express';
import { MockAgentService } from '../services/mock_agent_service';

export class MakeAgentController {
  private makeAgentService: MockAgentService;

  constructor() {
    this.makeAgentService = new MockAgentService();
  }

  // Speech Recognition
  transcribeSpeech = async (req: Request, res: Response) => {
    try {
      const audioData = req.body;
      const transcription = await this.makeAgentService.mockMethod('transcribe_speech', audioData);
      res.json({
        success: true,
        data: transcription,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to transcribe speech',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  processAudio = async (req: Request, res: Response) => {
    try {
      const audioConfig = req.body;
      const result = await this.makeAgentService.mockMethod('process_audio', audioConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to process audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getTranscriptions = async (req: Request, res: Response) => {
    try {
      const transcriptions = await this.makeAgentService.getTranscriptions();
      res.json({
        success: true,
        data: transcriptions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get transcriptions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Medical Records Processing
  processMedicalRecord = async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const result = await this.makeAgentService.mockMethod('process_medical_record', recordData);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to process medical record',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  extractMedicalData = async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const extractedData = await this.makeAgentService.mockMethod('extract_medical_data', recordData);
      res.json({
        success: true,
        data: extractedData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to extract medical data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getProcessedRecords = async (req: Request, res: Response) => {
    try {
      const records = await this.makeAgentService.getProcessedRecords();
      res.json({
        success: true,
        data: records,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get processed records',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Document Processing
  analyzeDocument = async (req: Request, res: Response) => {
    try {
      const documentData = req.body;
      const analysis = await this.makeAgentService.mockMethod('analyze_document', documentData);
      res.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to analyze document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  summarizeDocument = async (req: Request, res: Response) => {
    try {
      const documentData = req.body;
      const summary = await this.makeAgentService.mockMethod('summarize_document', documentData);
      res.json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to summarize document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  classifyDocument = async (req: Request, res: Response) => {
    try {
      const documentData = req.body;
      const classification = await this.makeAgentService.mockMethod('classify_document', documentData);
      res.json({
        success: true,
        data: classification,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to classify document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Named Entity Recognition
  extractEntities = async (req: Request, res: Response) => {
    try {
      const textData = req.body;
      const entities = await this.makeAgentService.mockMethod('extract_entities', textData);
      res.json({
        success: true,
        data: entities,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to extract entities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  validateEntities = async (req: Request, res: Response) => {
    try {
      const entitiesData = req.body;
      const validation = await this.makeAgentService.mockMethod('validate_entities', entitiesData);
      res.json({
        success: true,
        data: validation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to validate entities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getExtractedEntities = async (req: Request, res: Response) => {
    try {
      const entities = await this.makeAgentService.mockMethod('get_extracted_entities');
      res.json({
        success: true,
        data: entities,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get extracted entities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Medical Text Processing
  processMedicalText = async (req: Request, res: Response) => {
    try {
      const textData = req.body;
      const processedText = await this.makeAgentService.mockMethod('process_medical_text', textData);
      res.json({
        success: true,
        data: processedText,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to process medical text',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  validateMedicalText = async (req: Request, res: Response) => {
    try {
      const textData = req.body;
      const validation = await this.makeAgentService.mockMethod('validate_medical_text', textData);
      res.json({
        success: true,
        data: validation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to validate medical text',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  summarizeMedicalText = async (req: Request, res: Response) => {
    try {
      const textData = req.body;
      const summary = await this.makeAgentService.mockMethod('summarize_medical_text', textData);
      res.json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to summarize medical text',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Quality Assurance
  validateRecord = async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const validation = await this.makeAgentService.mockMethod('validate_record', recordData);
      res.json({
        success: true,
        data: validation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to validate record',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getQualityMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.makeAgentService.mockMethod('get_quality_metrics');
      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get quality metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  improveRecord = async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const improvedRecord = await this.makeAgentService.mockMethod('improve_record', recordData);
      res.json({
        success: true,
        data: improvedRecord,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to improve record',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Workflow Management
  startWorkflow = async (req: Request, res: Response) => {
    try {
      const workflowConfig = req.body;
      const workflow = await this.makeAgentService.mockMethod('start_workflow', workflowConfig);
      res.json({
        success: true,
        data: workflow,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to start workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getWorkflowStatus = async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;
      const status = await this.makeAgentService.mockMethod('get_workflow_status', { workflowId });
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get workflow status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  completeWorkflow = async (req: Request, res: Response) => {
    try {
      const workflowData = req.body;
      const result = await this.makeAgentService.mockMethod('complete_workflow', workflowData);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to complete workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Batch Processing
  processBatch = async (req: Request, res: Response) => {
    try {
      const batchConfig = req.body;
      const batch = await this.makeAgentService.mockMethod('process_batch', batchConfig);
      res.json({
        success: true,
        data: batch,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to process batch',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getBatchStatus = async (req: Request, res: Response) => {
    try {
      const { batchId } = req.params;
      const status = await this.makeAgentService.mockMethod('get_batch_status', { batchId });
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get batch status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getBatchResults = async (req: Request, res: Response) => {
    try {
      const { batchId } = req.params;
      const results = await this.makeAgentService.mockMethod('get_batch_results', { batchId });
      res.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get batch results',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Model Management
  getModelStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.makeAgentService.mockMethod('get_model_status');
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get model status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  retrainModels = async (req: Request, res: Response) => {
    try {
      const trainingConfig = req.body;
      const result = await this.makeAgentService.mockMethod('retrain_models', trainingConfig);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrain models',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getModelPerformance = async (req: Request, res: Response) => {
    try {
      const performance = await this.makeAgentService.mockMethod('get_model_performance');
      res.json({
        success: true,
        data: performance,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get model performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 