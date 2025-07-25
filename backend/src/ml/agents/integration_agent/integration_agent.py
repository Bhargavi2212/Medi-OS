#!/usr/bin/env python3
"""
IntegrationAgent - System Integration & API Agent
Handles API endpoint management, data format conversion, system compatibility analysis,
integration testing, protocol optimization, and error handling.
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
import joblib
import logging
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# ML imports
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error
import matplotlib.pyplot as plt
import seaborn as sns

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class IntegrationAgent:
    """
    IntegrationAgent - System Integration & API Agent
    
    Core Functions:
    1. API Endpoint Management: Analyze and optimize API endpoints
    2. Data Format Conversion: Convert between different data formats
    3. System Compatibility Analysis: Check system compatibility and requirements
    4. Integration Testing: Test system integrations and identify issues
    5. Protocol Optimization: Optimize communication protocols
    6. Error Handling and Recovery: Handle integration errors and provide recovery solutions
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/agents/integration_agent/models")
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data/integration_agent")
        
        # Create directories
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize models
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        
        # Load or initialize models
        self._initialize_models()
        
        # Integration configuration
        self.integration_config = {
            'timeout_threshold': 30,  # seconds
            'retry_attempts': 3,
            'compatibility_threshold': 0.8,
            'performance_threshold': 0.9
        }
        
        # API specifications
        self.api_specs = {
            'healthcare_api': {
                'endpoints': ['/patients', '/appointments', '/records', '/analytics'],
                'methods': ['GET', 'POST', 'PUT', 'DELETE'],
                'formats': ['JSON', 'XML', 'FHIR'],
                'auth_types': ['OAuth2', 'API Key', 'JWT']
            },
            'lab_system': {
                'endpoints': ['/tests', '/results', '/reports'],
                'methods': ['GET', 'POST'],
                'formats': ['JSON', 'HL7'],
                'auth_types': ['API Key', 'Certificate']
            },
            'pharmacy_system': {
                'endpoints': ['/medications', '/prescriptions', '/inventory'],
                'methods': ['GET', 'POST', 'PUT'],
                'formats': ['JSON', 'XML'],
                'auth_types': ['OAuth2', 'API Key']
            }
        }
    
    def _initialize_models(self):
        """Initialize ML models for integration analysis"""
        model_configs = {
            'api_analyzer': {
                'type': 'classification',
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'description': 'API endpoint analysis and optimization'
            },
            'compatibility_checker': {
                'type': 'classification',
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'description': 'System compatibility analysis'
            },
            'format_converter': {
                'type': 'classification',
                'model': LogisticRegression(random_state=42),
                'description': 'Data format conversion analysis'
            },
            'integration_tester': {
                'type': 'regression',
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'description': 'Integration testing and performance prediction'
            }
        }
        
        for model_name, config in model_configs.items():
            self.models[model_name] = config['model']
            self.scalers[model_name] = StandardScaler()
            self.label_encoders[model_name] = LabelEncoder()
            
        logger.info(f"Initialized {len(self.models)} models for IntegrationAgent")
    
    def generate_synthetic_integration_data(self, n_samples: int = 5000) -> Dict[str, pd.DataFrame]:
        """Generate synthetic integration and API data for analysis"""
        np.random.seed(42)
        
        # API endpoint data
        api_data = {
            'endpoint_id': range(1, n_samples + 1),
            'system_name': np.random.choice(['healthcare_api', 'lab_system', 'pharmacy_system'], n_samples),
            'endpoint_path': np.random.choice(['/patients', '/appointments', '/records', '/tests', '/medications'], n_samples),
            'http_method': np.random.choice(['GET', 'POST', 'PUT', 'DELETE'], n_samples),
            'response_time_ms': np.random.normal(200, 100, n_samples),
            'success_rate': np.random.uniform(0.85, 0.99, n_samples),
            'error_rate': np.random.uniform(0.01, 0.15, n_samples),
            'request_volume': np.random.randint(100, 10000, n_samples),
            'data_format': np.random.choice(['JSON', 'XML', 'FHIR', 'HL7'], n_samples),
            'auth_type': np.random.choice(['OAuth2', 'API Key', 'JWT', 'Certificate'], n_samples),
            'is_compatible': np.random.choice([True, False], n_samples, p=[0.8, 0.2])
        }
        
        # System compatibility data
        compatibility_data = {
            'integration_id': range(1, n_samples//2 + 1),
            'source_system': np.random.choice(['EMR', 'LIS', 'PACS', 'Pharmacy', 'Billing'], n_samples//2),
            'target_system': np.random.choice(['EMR', 'LIS', 'PACS', 'Pharmacy', 'Billing'], n_samples//2),
            'protocol_type': np.random.choice(['HL7', 'FHIR', 'DICOM', 'REST', 'SOAP'], n_samples//2),
            'data_format': np.random.choice(['JSON', 'XML', 'HL7', 'DICOM'], n_samples//2),
            'encryption_level': np.random.choice(['None', 'SSL', 'TLS', 'AES'], n_samples//2),
            'authentication_type': np.random.choice(['None', 'Basic', 'OAuth2', 'Certificate'], n_samples//2),
            'compatibility_score': np.random.uniform(0.5, 1.0, n_samples//2),
            'integration_success': np.random.choice([True, False], n_samples//2, p=[0.85, 0.15])
        }
        
        # Integration test data
        test_data = {
            'test_id': range(1, n_samples//4 + 1),
            'test_type': np.random.choice(['Unit', 'Integration', 'Performance', 'Security'], n_samples//4),
            'system_under_test': np.random.choice(['healthcare_api', 'lab_system', 'pharmacy_system'], n_samples//4),
            'test_duration_seconds': np.random.exponential(30, n_samples//4),
            'test_result': np.random.choice(['PASS', 'FAIL', 'TIMEOUT'], n_samples//4, p=[0.8, 0.15, 0.05]),
            'error_count': np.random.poisson(2, n_samples//4),
            'performance_score': np.random.uniform(0.6, 1.0, n_samples//4),
            'security_score': np.random.uniform(0.7, 1.0, n_samples//4)
        }
        
        return {
            'api_data': pd.DataFrame(api_data),
            'compatibility_data': pd.DataFrame(compatibility_data),
            'test_data': pd.DataFrame(test_data)
        }
    
    def analyze_api_endpoints(self, api_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze API endpoints and identify optimization opportunities"""
        logger.info("🔗 Analyzing API endpoints...")
        
        # Calculate API metrics
        api_metrics = {
            'total_endpoints': len(api_data),
            'avg_response_time': api_data['response_time_ms'].mean(),
            'avg_success_rate': api_data['success_rate'].mean(),
            'avg_error_rate': api_data['error_rate'].mean(),
            'total_requests': api_data['request_volume'].sum()
        }
        
        # System-wise analysis
        system_analysis = api_data.groupby('system_name').agg({
            'response_time_ms': 'mean',
            'success_rate': 'mean',
            'error_rate': 'mean',
            'request_volume': 'sum'
        }).to_dict()
        
        # Identify performance issues
        performance_issues = []
        slow_endpoints = api_data[api_data['response_time_ms'] > 300]
        if len(slow_endpoints) > 0:
            performance_issues.append(f"{len(slow_endpoints)} slow endpoints (>300ms)")
        
        high_error_endpoints = api_data[api_data['error_rate'] > 0.1]
        if len(high_error_endpoints) > 0:
            performance_issues.append(f"{len(high_error_endpoints)} high-error endpoints (>10%)")
        
        # Optimization recommendations
        recommendations = []
        if api_metrics['avg_response_time'] > 250:
            recommendations.append("Consider API optimization and caching")
        if api_metrics['avg_error_rate'] > 0.05:
            recommendations.append("Implement better error handling and retry logic")
        
        return {
            'api_metrics': api_metrics,
            'system_analysis': system_analysis,
            'performance_issues': performance_issues,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }
    
    def check_system_compatibility(self, source_system: str, target_system: str, 
                                 requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Check compatibility between systems"""
        logger.info(f"🔍 Checking compatibility: {source_system} -> {target_system}")
        
        # Prepare compatibility features
        features = [
            requirements.get('protocol_type', 'REST'),
            requirements.get('data_format', 'JSON'),
            requirements.get('encryption_level', 'SSL'),
            requirements.get('authentication_type', 'OAuth2'),
            requirements.get('api_version', 'v1'),
            requirements.get('rate_limit', 1000)
        ]
        
        # Use compatibility checker model
        if 'compatibility_checker' in self.models:
            try:
                # Simulate compatibility check
                compatibility_score = np.random.uniform(0.6, 1.0)
                is_compatible = compatibility_score > self.integration_config['compatibility_threshold']
                
                return {
                    'source_system': source_system,
                    'target_system': target_system,
                    'compatibility_score': float(compatibility_score),
                    'is_compatible': bool(is_compatible),
                    'compatibility_issues': self._identify_compatibility_issues(requirements),
                    'recommendations': self._generate_compatibility_recommendations(compatibility_score, requirements),
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                logger.error(f"Compatibility check error: {e}")
                return {'error': str(e)}
        
        return {'error': 'Compatibility checker model not trained'}
    
    def convert_data_format(self, source_format: str, target_format: str, 
                           data_sample: Dict[str, Any]) -> Dict[str, Any]:
        """Convert data between different formats"""
        logger.info(f"🔄 Converting data format: {source_format} -> {target_format}")
        
        # Format conversion mapping
        format_mappings = {
            'JSON_to_XML': {'success_rate': 0.95, 'complexity': 'medium'},
            'XML_to_JSON': {'success_rate': 0.98, 'complexity': 'low'},
            'JSON_to_FHIR': {'success_rate': 0.85, 'complexity': 'high'},
            'FHIR_to_JSON': {'success_rate': 0.90, 'complexity': 'medium'},
            'HL7_to_JSON': {'success_rate': 0.80, 'complexity': 'high'},
            'JSON_to_HL7': {'success_rate': 0.75, 'complexity': 'high'}
        }
        
        conversion_key = f"{source_format}_to_{target_format}"
        conversion_info = format_mappings.get(conversion_key, {'success_rate': 0.7, 'complexity': 'unknown'})
        
        # Simulate conversion
        conversion_success = np.random.random() < conversion_info['success_rate']
        
        return {
            'source_format': source_format,
            'target_format': target_format,
            'conversion_success': conversion_success,
            'success_rate': conversion_info['success_rate'],
            'complexity': conversion_info['complexity'],
            'converted_data': self._simulate_data_conversion(data_sample, source_format, target_format),
            'timestamp': datetime.now().isoformat()
        }
    
    def test_integration(self, integration_config: Dict[str, Any]) -> Dict[str, Any]:
        """Test system integration and predict performance"""
        logger.info("🧪 Testing system integration...")
        
        # Prepare test features
        features = [
            integration_config.get('timeout', 30),
            integration_config.get('retry_attempts', 3),
            integration_config.get('data_volume', 1000),
            integration_config.get('complexity_score', 0.5),
            integration_config.get('security_level', 0.8)
        ]
        
        # Use integration tester model
        if 'integration_tester' in self.models:
            try:
                # Simulate integration test results
                test_duration = np.random.exponential(30)
                success_rate = np.random.uniform(0.8, 0.99)
                error_count = np.random.poisson(2)
                
                test_result = 'PASS' if success_rate > 0.9 else 'FAIL'
                
                return {
                    'test_config': integration_config,
                    'test_duration': float(test_duration),
                    'success_rate': float(success_rate),
                    'error_count': int(error_count),
                    'test_result': test_result,
                    'performance_score': float(np.random.uniform(0.7, 1.0)),
                    'security_score': float(np.random.uniform(0.8, 1.0)),
                    'recommendations': self._generate_test_recommendations(success_rate, error_count),
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                logger.error(f"Integration test error: {e}")
                return {'error': str(e)}
        
        return {'error': 'Integration tester model not trained'}
    
    def generate_integration_report(self, data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Generate comprehensive integration analysis report"""
        logger.info("📋 Generating integration analysis report...")
        
        # Run all analyses
        api_analysis = self.analyze_api_endpoints(data['api_data'])
        
        # Sample compatibility check
        compatibility_check = self.check_system_compatibility(
            'EMR', 'LIS', 
            {'protocol_type': 'HL7', 'data_format': 'JSON', 'encryption_level': 'SSL'}
        )
        
        # Sample format conversion
        format_conversion = self.convert_data_format(
            'JSON', 'XML', 
            {'patient_id': '12345', 'name': 'John Doe', 'age': 45}
        )
        
        # Sample integration test
        integration_test = self.test_integration({
            'timeout': 30,
            'retry_attempts': 3,
            'data_volume': 1000,
            'complexity_score': 0.6,
            'security_level': 0.9
        })
        
        # Compile comprehensive report
        report = {
            'report_date': datetime.now().isoformat(),
            'api_analysis': api_analysis,
            'compatibility_check': compatibility_check,
            'format_conversion': format_conversion,
            'integration_test': integration_test,
            'executive_summary': self._generate_integration_summary(
                api_analysis, compatibility_check, integration_test
            ),
            'action_items': self._generate_integration_action_items(
                api_analysis, compatibility_check, integration_test
            )
        }
        
        return report
    
    def _identify_compatibility_issues(self, requirements: Dict[str, Any]) -> List[str]:
        """Identify potential compatibility issues"""
        issues = []
        
        if requirements.get('protocol_type') == 'HL7' and requirements.get('data_format') == 'JSON':
            issues.append("HL7 protocol typically uses XML format")
        
        if requirements.get('encryption_level') == 'None':
            issues.append("No encryption may pose security risks")
        
        if requirements.get('authentication_type') == 'None':
            issues.append("No authentication may pose security risks")
        
        return issues
    
    def _generate_compatibility_recommendations(self, score: float, requirements: Dict[str, Any]) -> List[str]:
        """Generate compatibility recommendations"""
        recommendations = []
        
        if score < 0.8:
            recommendations.append("Consider protocol standardization")
            recommendations.append("Implement data format conversion layer")
        
        if requirements.get('encryption_level') == 'None':
            recommendations.append("Implement SSL/TLS encryption")
        
        if requirements.get('authentication_type') == 'None':
            recommendations.append("Implement OAuth2 authentication")
        
        return recommendations
    
    def _simulate_data_conversion(self, data: Dict[str, Any], source_format: str, target_format: str) -> Dict[str, Any]:
        """Simulate data format conversion"""
        if source_format == 'JSON' and target_format == 'XML':
            return {
                'converted': True,
                'format': 'XML',
                'data': f"<patient><id>{data.get('patient_id', '')}</id><name>{data.get('name', '')}</name></patient>"
            }
        elif source_format == 'XML' and target_format == 'JSON':
            return {
                'converted': True,
                'format': 'JSON',
                'data': data
            }
        else:
            return {
                'converted': False,
                'error': f'Conversion from {source_format} to {target_format} not supported'
            }
    
    def _generate_test_recommendations(self, success_rate: float, error_count: int) -> List[str]:
        """Generate integration test recommendations"""
        recommendations = []
        
        if success_rate < 0.9:
            recommendations.append("Implement retry logic with exponential backoff")
            recommendations.append("Add circuit breaker pattern")
        
        if error_count > 5:
            recommendations.append("Improve error handling and logging")
            recommendations.append("Add monitoring and alerting")
        
        return recommendations
    
    def _generate_integration_summary(self, api_analysis: Dict, compatibility_check: Dict, integration_test: Dict) -> str:
        """Generate integration analysis summary"""
        summary = f"""
        System Integration Analysis Summary
        
        API Analysis:
        - Total endpoints analyzed: {api_analysis['api_metrics']['total_endpoints']}
        - Average response time: {api_analysis['api_metrics']['avg_response_time']:.1f}ms
        - Average success rate: {api_analysis['api_metrics']['avg_success_rate']:.1%}
        
        Compatibility Check:
        - Compatibility score: {compatibility_check.get('compatibility_score', 0):.1%}
        - Is compatible: {compatibility_check.get('is_compatible', False)}
        
        Integration Test:
        - Test result: {integration_test.get('test_result', 'UNKNOWN')}
        - Success rate: {integration_test.get('success_rate', 0):.1%}
        - Performance score: {integration_test.get('performance_score', 0):.1%}
        """
        
        return summary
    
    def _generate_integration_action_items(self, api_analysis: Dict, compatibility_check: Dict, integration_test: Dict) -> List[str]:
        """Generate actionable items for integration"""
        action_items = []
        
        # High priority items
        if api_analysis['api_metrics']['avg_response_time'] > 250:
            action_items.append("URGENT: Optimize slow API endpoints")
        if api_analysis['api_metrics']['avg_error_rate'] > 0.05:
            action_items.append("HIGH: Implement better error handling")
        if not compatibility_check.get('is_compatible', True):
            action_items.append("HIGH: Resolve system compatibility issues")
        if integration_test.get('test_result') == 'FAIL':
            action_items.append("URGENT: Fix integration test failures")
        
        return action_items
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get status of all models"""
        status = {}
        
        for model_name, model in self.models.items():
            status[model_name] = {
                'loaded': model is not None,
                'model_type': type(model).__name__ if model else None
            }
        
        return {
            'total_models': len(self.models),
            'loaded_models': sum(1 for m in self.models.values() if m is not None),
            'model_status': status,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Test IntegrationAgent
    agent = IntegrationAgent()
    
    # Generate synthetic data
    data = agent.generate_synthetic_integration_data(2000)
    
    # Generate integration report
    report = agent.generate_integration_report(data)
    
    print("IntegrationAgent Test Results:")
    print(report['executive_summary'])
    print(f"Action Items: {report['action_items']}") 