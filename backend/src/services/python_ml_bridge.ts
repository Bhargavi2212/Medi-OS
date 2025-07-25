import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export interface MLPredictionRequest {
    type: 'wait_time' | 'triage' | 'optimization';
    data: any;
}

export interface MLPredictionResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export class PythonMLBridge {
    private pythonPath: string;
    private scriptPath: string;

    constructor() {
        this.pythonPath = 'C:\\Python313\\python.exe';
        this.scriptPath = __dirname + '/../ml/manage_agent.py';
    }

    /**
     * Call Python ML agent for predictions
     */
    async callMLAgent(request: MLPredictionRequest): Promise<MLPredictionResponse> {
        try {
            const pythonScript = this.createPythonScript(request);
            const result = await this.executePythonScript(pythonScript);
            return result;
        } catch (error) {
            console.error('ML Bridge Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Create Python script based on request type
     */
    private createPythonScript(request: MLPredictionRequest): string {
        const { type, data } = request;
        
        switch (type) {
            case 'wait_time':
                return `
import sys
import json
sys.path.append('${__dirname}/../ml')
from manage_agent import ManageAgent

agent = ManageAgent()
result = agent.predict_wait_time(${JSON.stringify(data)})
print(json.dumps(result))
`;
            
            case 'triage':
                return `
import sys
import json
sys.path.append('${__dirname}/../ml')
from manage_agent import ManageAgent

agent = ManageAgent()
result = agent.classify_triage(${JSON.stringify(data)})
print(json.dumps(result))
`;
            
            case 'optimization':
                return `
import sys
import json
sys.path.append('${__dirname}/../ml')
from manage_agent import ManageAgent

agent = ManageAgent()
result = agent.optimize_resources(${JSON.stringify(data)})
print(json.dumps(result))
`;
            
            default:
                throw new Error(`Unknown request type: ${type}`);
        }
    }

    /**
     * Execute Python script and return result
     */
    private async executePythonScript(script: string): Promise<MLPredictionResponse> {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonPath, ['-c', script], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

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
                        const result = JSON.parse(output.trim());
                        resolve({
                            success: true,
                            data: result
                        });
                    } catch (error) {
                        resolve({
                            success: false,
                            error: `Failed to parse Python output: ${output}`
                        });
                    }
                } else {
                    resolve({
                        success: false,
                        error: `Python process failed with code ${code}: ${errorOutput}`
                    });
                }
            });

            pythonProcess.on('error', (error) => {
                resolve({
                    success: false,
                    error: `Failed to start Python process: ${error.message}`
                });
            });
        });
    }

    /**
     * Train the ML models
     */
    async trainModels(): Promise<MLPredictionResponse> {
        try {
            const script = `
import sys
import json
sys.path.append('${__dirname}/../ml')
from manage_agent import ManageAgent

agent = ManageAgent()
metrics = agent.train_models()
print(json.dumps(metrics))
`;
            
            return await this.executePythonScript(script);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get model performance metrics
     */
    async getPerformanceMetrics(): Promise<MLPredictionResponse> {
        try {
            const script = `
import sys
import json
sys.path.append('${__dirname}/../ml')
from manage_agent import ManageAgent

agent = ManageAgent()
metrics = agent.get_performance_metrics()
print(json.dumps(metrics))
`;
            
            return await this.executePythonScript(script);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Test if Python ML environment is working
     */
    async testEnvironment(): Promise<MLPredictionResponse> {
        try {
            const script = `
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

result = {
    "numpy_version": np.__version__,
    "pandas_version": pd.__version__,
    "sklearn_available": True,
    "joblib_available": True,
    "python_version": sys.version
}
print(json.dumps(result))
`;
            
            return await this.executePythonScript(script);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
} 