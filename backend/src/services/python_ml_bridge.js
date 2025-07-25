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
exports.PythonMLBridge = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const child_process_2 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_2.exec);
class PythonMLBridge {
    constructor() {
        this.pythonPath = 'C:\\Python313\\python.exe';
        this.scriptPath = __dirname + '/../ml/manage_agent.py';
    }
    /**
     * Call Python ML agent for predictions
     */
    callMLAgent(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pythonScript = this.createPythonScript(request);
                const result = yield this.executePythonScript(pythonScript);
                return result;
            }
            catch (error) {
                console.error('ML Bridge Error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    /**
     * Create Python script based on request type
     */
    createPythonScript(request) {
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
    executePythonScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const pythonProcess = (0, child_process_1.spawn)(this.pythonPath, ['-c', script], {
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
                        }
                        catch (error) {
                            resolve({
                                success: false,
                                error: `Failed to parse Python output: ${output}`
                            });
                        }
                    }
                    else {
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
        });
    }
    /**
     * Train the ML models
     */
    trainModels() {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield this.executePythonScript(script);
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    /**
     * Get model performance metrics
     */
    getPerformanceMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield this.executePythonScript(script);
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    /**
     * Test if Python ML environment is working
     */
    testEnvironment() {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield this.executePythonScript(script);
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
}
exports.PythonMLBridge = PythonMLBridge;
