#!/usr/bin/env python3
"""
InsightsAgent - Data Analytics & Insights Agent
Provides advanced analytics, predictive modeling, and insights for healthcare data.
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
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
from sklearn.cluster import KMeans
# import matplotlib.pyplot as plt
# import seaborn as sns

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class InsightsAgent:
    """
    InsightsAgent - Data Analytics & Insights Agent
    
    Core Functions:
    1. Patient Trend Analysis: Identify patterns in patient demographics, conditions, and outcomes
    2. Clinical Outcome Prediction: Predict patient outcomes based on historical data
    3. Resource Utilization Analysis: Optimize resource allocation and identify bottlenecks
    4. Performance Metrics Analysis: Track and analyze key performance indicators
    5. Predictive Analytics: Forecast future trends and demand
    6. Data Visualization: Generate insights and recommendations
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/agents/insights_agent/models")
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data/insights_agent")
        
        # Create directories
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize models
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        
        # Load or initialize models
        self._initialize_models()
        
        # Analytics configuration
        self.analytics_config = {
            'trend_analysis_window': 30,  # days
            'prediction_horizon': 90,      # days
            'confidence_threshold': 0.8,
            'min_data_points': 100
        }
    
    def _initialize_models(self):
        """Initialize ML models for insights"""
        model_configs = {
            'trend_analyzer': {
                'type': 'regression',
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'description': 'Patient trend analysis'
            },
            'outcome_predictor': {
                'type': 'classification',
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'description': 'Clinical outcome prediction'
            },
            'utilization_analyzer': {
                'type': 'regression',
                'model': LinearRegression(),
                'description': 'Resource utilization analysis'
            },
            'performance_analyzer': {
                'type': 'classification',
                'model': LogisticRegression(random_state=42),
                'description': 'Performance metrics analysis'
            }
        }
        
        for model_name, config in model_configs.items():
            self.models[model_name] = config['model']
            self.scalers[model_name] = StandardScaler()
            self.label_encoders[model_name] = LabelEncoder()
            
        logger.info(f"Initialized {len(self.models)} models for InsightsAgent")
    
    def generate_synthetic_healthcare_data(self, n_samples: int = 10000) -> Dict[str, pd.DataFrame]:
        """Generate comprehensive synthetic healthcare data for analytics"""
        np.random.seed(42)
        
        # Patient demographics and trends
        patient_data = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(45, 15, n_samples).astype(int),
            'gender': np.random.choice(['M', 'F'], n_samples),
            'department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General'], n_samples),
            'admission_date': pd.date_range('2023-01-01', periods=n_samples, freq='H'),
            'length_of_stay': np.random.exponential(3, n_samples).astype(int),
            'severity_score': np.random.randint(1, 11, n_samples),
            'readmission_risk': np.random.random(n_samples),
            'treatment_cost': np.random.normal(5000, 2000, n_samples),
            'outcome': np.random.choice(['Recovered', 'Improved', 'Stable', 'Deteriorated'], n_samples, p=[0.6, 0.25, 0.1, 0.05])
        }
        
        # Resource utilization data
        resource_data = {
            'date': pd.date_range('2023-01-01', periods=n_samples//10, freq='D'),
            'department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General'], n_samples//10),
            'beds_occupied': np.random.randint(10, 50, n_samples//10),
            'staff_available': np.random.randint(5, 25, n_samples//10),
            'equipment_utilization': np.random.uniform(0.3, 0.9, n_samples//10),
            'wait_time_avg': np.random.normal(45, 15, n_samples//10),
            'patient_satisfaction': np.random.uniform(3.5, 5.0, n_samples//10)
        }
        
        # Performance metrics
        performance_data = {
            'date': pd.date_range('2023-01-01', periods=n_samples//20, freq='D'),
            'department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General'], n_samples//20),
            'readmission_rate': np.random.uniform(0.05, 0.15, n_samples//20),
            'mortality_rate': np.random.uniform(0.01, 0.05, n_samples//20),
            'avg_length_of_stay': np.random.uniform(2.5, 8.0, n_samples//20),
            'patient_satisfaction_score': np.random.uniform(3.8, 4.8, n_samples//20),
            'cost_per_case': np.random.normal(8000, 3000, n_samples//20)
        }
        
        return {
            'patient_data': pd.DataFrame(patient_data),
            'resource_data': pd.DataFrame(resource_data),
            'performance_data': pd.DataFrame(performance_data)
        }
    
    def analyze_patient_trends(self, patient_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze patient trends and patterns"""
        logger.info("🔍 Analyzing patient trends...")
        
        # Calculate trends
        trends = {
            'total_patients': len(patient_data),
            'avg_age': patient_data['age'].mean(),
            'gender_distribution': patient_data['gender'].value_counts().to_dict(),
            'department_distribution': patient_data['department'].value_counts().to_dict(),
            'avg_length_of_stay': patient_data['length_of_stay'].mean(),
            'avg_severity': patient_data['severity_score'].mean(),
            'avg_cost': patient_data['treatment_cost'].mean(),
            'outcome_distribution': patient_data['outcome'].value_counts().to_dict()
        }
        
        # Time-based trends
        patient_data['admission_date'] = pd.to_datetime(patient_data['admission_date'])
        patient_data['month'] = patient_data['admission_date'].dt.month
        
        monthly_trends = patient_data.groupby('month').agg({
            'patient_id': 'count',
            'treatment_cost': 'mean',
            'length_of_stay': 'mean',
            'severity_score': 'mean'
        }).to_dict()
        
        # Risk analysis
        high_risk_patients = patient_data[patient_data['readmission_risk'] > 0.7]
        risk_analysis = {
            'high_risk_count': len(high_risk_patients),
            'high_risk_percentage': len(high_risk_patients) / len(patient_data) * 100,
            'avg_risk_score': patient_data['readmission_risk'].mean()
        }
        
        return {
            'trends': trends,
            'monthly_trends': monthly_trends,
            'risk_analysis': risk_analysis,
            'timestamp': datetime.now().isoformat()
        }
    
    def predict_clinical_outcomes(self, patient_features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict clinical outcomes based on patient features"""
        logger.info("🎯 Predicting clinical outcomes...")
        
        # Prepare features
        features = [
            patient_features.get('age', 45),
            patient_features.get('severity_score', 5),
            patient_features.get('length_of_stay', 3),
            patient_features.get('treatment_cost', 5000),
            patient_features.get('readmission_risk', 0.3)
        ]
        
        # Use outcome predictor model
        if 'outcome_predictor' in self.models:
            try:
                prediction = self.models['outcome_predictor'].predict([features])[0]
                confidence = self.models['outcome_predictor'].predict_proba([features])[0].max()
                
                outcome_mapping = {
                    0: 'Recovered',
                    1: 'Improved', 
                    2: 'Stable',
                    3: 'Deteriorated'
                }
                
                return {
                    'predicted_outcome': outcome_mapping.get(prediction, 'Unknown'),
                    'confidence': float(confidence),
                    'risk_factors': self._identify_risk_factors(patient_features),
                    'recommendations': self._generate_outcome_recommendations(prediction, patient_features)
                }
            except Exception as e:
                logger.error(f"Outcome prediction error: {e}")
                return {'error': str(e)}
        
        return {'error': 'Outcome predictor model not trained'}
    
    def analyze_resource_utilization(self, resource_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze resource utilization patterns"""
        logger.info("📊 Analyzing resource utilization...")
        
        # Calculate utilization metrics
        utilization_metrics = {
            'avg_bed_occupancy': resource_data['beds_occupied'].mean(),
            'avg_staff_utilization': resource_data['staff_available'].mean(),
            'avg_equipment_utilization': resource_data['equipment_utilization'].mean(),
            'avg_wait_time': resource_data['wait_time_avg'].mean(),
            'avg_satisfaction': resource_data['patient_satisfaction'].mean()
        }
        
        # Department-wise analysis
        dept_analysis = resource_data.groupby('department').agg({
            'beds_occupied': 'mean',
            'staff_available': 'mean',
            'equipment_utilization': 'mean',
            'wait_time_avg': 'mean',
            'patient_satisfaction': 'mean'
        }).to_dict()
        
        # Identify bottlenecks
        bottlenecks = []
        if utilization_metrics['avg_bed_occupancy'] > 0.8:
            bottlenecks.append("High bed occupancy - consider capacity expansion")
        if utilization_metrics['avg_wait_time'] > 60:
            bottlenecks.append("Long wait times - optimize patient flow")
        if utilization_metrics['avg_satisfaction'] < 4.0:
            bottlenecks.append("Low patient satisfaction - review service quality")
        
        return {
            'utilization_metrics': utilization_metrics,
            'department_analysis': dept_analysis,
            'bottlenecks': bottlenecks,
            'optimization_recommendations': self._generate_utilization_recommendations(utilization_metrics),
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_performance_metrics(self, performance_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze performance metrics and KPIs"""
        logger.info("📈 Analyzing performance metrics...")
        
        # Calculate KPIs
        kpis = {
            'avg_readmission_rate': performance_data['readmission_rate'].mean(),
            'avg_mortality_rate': performance_data['mortality_rate'].mean(),
            'avg_length_of_stay': performance_data['avg_length_of_stay'].mean(),
            'avg_satisfaction_score': performance_data['patient_satisfaction_score'].mean(),
            'avg_cost_per_case': performance_data['cost_per_case'].mean()
        }
        
        # Department performance comparison
        dept_performance = performance_data.groupby('department').agg({
            'readmission_rate': 'mean',
            'mortality_rate': 'mean',
            'avg_length_of_stay': 'mean',
            'patient_satisfaction_score': 'mean',
            'cost_per_case': 'mean'
        }).to_dict()
        
        # Performance insights
        insights = []
        if kpis['avg_readmission_rate'] > 0.1:
            insights.append("High readmission rate - focus on discharge planning")
        if kpis['avg_satisfaction_score'] < 4.0:
            insights.append("Low satisfaction scores - improve patient experience")
        if kpis['avg_cost_per_case'] > 10000:
            insights.append("High cost per case - optimize resource utilization")
        
        return {
            'kpis': kpis,
            'department_performance': dept_performance,
            'insights': insights,
            'recommendations': self._generate_performance_recommendations(kpis),
            'timestamp': datetime.now().isoformat()
        }
    
    def generate_insights_report(self, data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Generate comprehensive insights report"""
        logger.info("📋 Generating comprehensive insights report...")
        
        # Run all analyses
        patient_trends = self.analyze_patient_trends(data['patient_data'])
        resource_utilization = self.analyze_resource_utilization(data['resource_data'])
        performance_metrics = self.analyze_performance_metrics(data['performance_data'])
        
        # Generate predictions
        sample_patient = {
            'age': 55,
            'severity_score': 7,
            'length_of_stay': 5,
            'treatment_cost': 8000,
            'readmission_risk': 0.4
        }
        outcome_prediction = self.predict_clinical_outcomes(sample_patient)
        
        # Compile comprehensive report
        report = {
            'report_date': datetime.now().isoformat(),
            'patient_trends': patient_trends,
            'resource_utilization': resource_utilization,
            'performance_metrics': performance_metrics,
            'outcome_prediction': outcome_prediction,
            'executive_summary': self._generate_executive_summary(
                patient_trends, resource_utilization, performance_metrics
            ),
            'action_items': self._generate_action_items(
                patient_trends, resource_utilization, performance_metrics
            )
        }
        
        return report
    
    def _identify_risk_factors(self, patient_features: Dict[str, Any]) -> List[str]:
        """Identify risk factors for patient outcomes"""
        risk_factors = []
        
        if patient_features.get('age', 0) > 65:
            risk_factors.append("Advanced age")
        if patient_features.get('severity_score', 0) > 7:
            risk_factors.append("High severity score")
        if patient_features.get('readmission_risk', 0) > 0.5:
            risk_factors.append("High readmission risk")
        if patient_features.get('length_of_stay', 0) > 7:
            risk_factors.append("Extended length of stay")
        
        return risk_factors
    
    def _generate_outcome_recommendations(self, prediction: int, features: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on outcome prediction"""
        recommendations = []
        
        if prediction == 3:  # Deteriorated
            recommendations.extend([
                "Increase monitoring frequency",
                "Consider specialist consultation",
                "Review treatment plan"
            ])
        elif prediction == 0:  # Recovered
            recommendations.extend([
                "Plan for discharge",
                "Schedule follow-up appointment",
                "Provide discharge instructions"
            ])
        
        return recommendations
    
    def _generate_utilization_recommendations(self, metrics: Dict[str, float]) -> List[str]:
        """Generate resource utilization recommendations"""
        recommendations = []
        
        if metrics['avg_bed_occupancy'] > 0.8:
            recommendations.append("Consider adding bed capacity")
        if metrics['avg_wait_time'] > 60:
            recommendations.append("Optimize patient scheduling")
        if metrics['avg_satisfaction'] < 4.0:
            recommendations.append("Improve patient experience initiatives")
        
        return recommendations
    
    def _generate_performance_recommendations(self, kpis: Dict[str, float]) -> List[str]:
        """Generate performance improvement recommendations"""
        recommendations = []
        
        if kpis['avg_readmission_rate'] > 0.1:
            recommendations.append("Implement enhanced discharge planning")
        if kpis['avg_satisfaction_score'] < 4.0:
            recommendations.append("Focus on patient experience improvement")
        if kpis['avg_cost_per_case'] > 10000:
            recommendations.append("Optimize resource utilization and cost management")
        
        return recommendations
    
    def _generate_executive_summary(self, trends: Dict, utilization: Dict, performance: Dict) -> str:
        """Generate executive summary of insights"""
        summary = f"""
        Healthcare Analytics Executive Summary
        
        Patient Trends:
        - Total patients analyzed: {trends['trends']['total_patients']}
        - Average age: {trends['trends']['avg_age']:.1f} years
        - Average length of stay: {trends['trends']['avg_length_of_stay']:.1f} days
        
        Resource Utilization:
        - Average bed occupancy: {utilization['utilization_metrics']['avg_bed_occupancy']:.1%}
        - Average wait time: {utilization['utilization_metrics']['avg_wait_time']:.1f} minutes
        - Patient satisfaction: {utilization['utilization_metrics']['avg_satisfaction']:.2f}/5.0
        
        Performance Metrics:
        - Readmission rate: {performance['kpis']['avg_readmission_rate']:.1%}
        - Mortality rate: {performance['kpis']['avg_mortality_rate']:.1%}
        - Average cost per case: ${performance['kpis']['avg_cost_per_case']:,.0f}
        """
        
        return summary
    
    def _generate_action_items(self, trends: Dict, utilization: Dict, performance: Dict) -> List[str]:
        """Generate actionable items based on insights"""
        action_items = []
        
        # High priority items
        if utilization['utilization_metrics']['avg_wait_time'] > 60:
            action_items.append("URGENT: Reduce patient wait times")
        if performance['kpis']['avg_readmission_rate'] > 0.1:
            action_items.append("HIGH: Implement readmission prevention program")
        if utilization['utilization_metrics']['avg_satisfaction'] < 4.0:
            action_items.append("MEDIUM: Improve patient satisfaction scores")
        
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
    # Test InsightsAgent
    agent = InsightsAgent()
    
    # Generate synthetic data
    data = agent.generate_synthetic_healthcare_data(5000)
    
    # Generate insights report
    report = agent.generate_insights_report(data)
    
    print("InsightsAgent Test Results:")
    print(json.dumps(report['executive_summary'], indent=2))
    print(f"Action Items: {report['action_items']}") 