#!/usr/bin/env python3
"""
ManageAgent Model Evaluation Framework
Proper evaluation with cross-validation, overfitting detection, and realistic testing.
"""

import json
import os
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from sklearn.model_selection import cross_val_score, train_test_split, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.pipeline import Pipeline
import joblib
import logging
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ManageAgentEvaluator:
    def __init__(self):
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data")
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/models")
        
    def generate_realistic_data(self, n_samples: int = 5000) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Generate realistic healthcare data for evaluation"""
        np.random.seed(42)
        
        # Wait time prediction features
        queue_data = {
            'queue_length': np.random.randint(1, 50, n_samples),
            'staff_available': np.random.randint(1, 15, n_samples),
            'rooms_available': np.random.randint(1, 20, n_samples),
            'hour_of_day': np.random.randint(0, 24, n_samples),
            'day_of_week': np.random.randint(0, 7, n_samples),
            'current_wait_time': np.random.randint(5, 120, n_samples),
            'department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General'], n_samples)
        }
        
        # Calculate realistic wait times with noise
        base_wait = queue_data['queue_length'] * 15
        staff_factor = np.maximum(0.5, np.minimum(2.0, 5 / queue_data['staff_available']))
        time_factor = np.where(
            (queue_data['hour_of_day'] < 9) | (queue_data['hour_of_day'] > 17),
            0.7,  # Off-peak
            np.where(
                (queue_data['hour_of_day'] >= 10) & (queue_data['hour_of_day'] <= 14),
                1.3,  # Peak
                1.0   # Normal
            )
        )
        day_factor = np.where(queue_data['day_of_week'] >= 5, 0.8, 1.0)
        
        # Add realistic noise
        noise = np.random.normal(0, 10, n_samples)
        wait_times = np.maximum(5, np.minimum(180, base_wait * staff_factor * time_factor * day_factor + noise))
        queue_data['predicted_wait_time'] = wait_times
        
        # Triage classification features
        triage_data = {
            'age': np.random.randint(1, 95, n_samples),
            'urgency_level': np.random.randint(1, 6, n_samples),
            'medical_complexity': np.random.uniform(1, 10, n_samples),
            'symptoms_count': np.random.randint(1, 8, n_samples),
            'vital_signs_stable': np.random.choice([True, False], n_samples),
            'consciousness_level': np.random.choice(['Alert', 'Confused', 'Unresponsive'], n_samples),
            'pain_level': np.random.randint(0, 11, n_samples),
            'department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'Emergency', 'General'], n_samples)
        }
        
        # Calculate realistic triage levels with noise
        triage_levels = []
        for i in range(n_samples):
            base_level = triage_data['urgency_level'][i]
            
            # Adjust based on age
            if triage_data['age'][i] > 65:
                base_level = min(5, base_level + 1)
            
            # Adjust based on medical complexity
            if triage_data['medical_complexity'][i] > 5:
                base_level = min(5, base_level + 1)
            
            # Adjust based on consciousness
            if triage_data['consciousness_level'][i] == 'Unresponsive':
                base_level = 5
            elif triage_data['consciousness_level'][i] == 'Confused':
                base_level = min(5, base_level + 1)
            
            # Adjust based on pain level
            if triage_data['pain_level'][i] > 8:
                base_level = min(5, base_level + 1)
            
            # Add some randomness
            if np.random.random() < 0.1:  # 10% chance of level change
                base_level = max(1, min(5, base_level + np.random.choice([-1, 1])))
            
            triage_levels.append(base_level)
        
        triage_data['final_triage_level'] = triage_levels
        
        return pd.DataFrame(queue_data), pd.DataFrame(triage_data)
    
    def evaluate_wait_time_model(self) -> Dict[str, Any]:
        """Evaluate wait time prediction model with realistic testing"""
        logger.info("Evaluating wait time prediction model...")
        
        # Generate realistic data
        queue_df, _ = self.generate_realistic_data(5000)
        
        # Prepare features
        wait_features = ['queue_length', 'staff_available', 'rooms_available', 
                        'hour_of_day', 'day_of_week', 'current_wait_time']
        X = queue_df[wait_features]
        y = queue_df['predicted_wait_time']
        
        # Proper train/test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )
        
        # Cross-validation for regression
        cv_scores = cross_val_score(
            RandomForestRegressor(n_estimators=100, random_state=42),
            X_train, y_train, cv=5, scoring='neg_mean_squared_error'
        )
        cv_rmse = np.sqrt(-cv_scores)
        
        # Train final model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Test predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        train_rmse = np.sqrt(mean_squared_error(y_train, model.predict(X_train)))
        r2 = r2_score(y_test, y_pred)
        
        # Overfitting detection
        overfitting_score = train_rmse - test_rmse
        
        results = {
            'model_type': 'wait_time_prediction',
            'cv_rmse_mean': cv_rmse.mean(),
            'cv_rmse_std': cv_rmse.std(),
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'overfitting_score': overfitting_score,
            'r2_score': r2,
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'timestamp': datetime.now().isoformat()
        }
        
        # Log results
        logger.info(f"Wait Time Model Results:")
        logger.info(f"  CV RMSE: {cv_rmse.mean():.2f} (+/- {cv_rmse.std() * 2:.2f})")
        logger.info(f"  Test RMSE: {test_rmse:.2f}")
        logger.info(f"  R² Score: {r2:.4f}")
        logger.info(f"  Overfitting Score: {overfitting_score:.2f}")
        
        if overfitting_score < -5:
            logger.warning(f"  ⚠️  Potential overfitting detected!")
        
        return results
    
    def evaluate_triage_model(self) -> Dict[str, Any]:
        """Evaluate triage classification model with realistic testing"""
        logger.info("Evaluating triage classification model...")
        
        # Generate realistic data
        _, triage_df = self.generate_realistic_data(5000)
        
        # Prepare features
        triage_features = ['age', 'urgency_level', 'medical_complexity', 
                          'symptoms_count', 'pain_level']
        X = triage_df[triage_features]
        y = triage_df['final_triage_level']
        
        # Check class balance
        unique, counts = np.unique(y, return_counts=True)
        class_dist = {int(k): int(v) for k, v in zip(unique, counts)}
        logger.info(f"Class distribution: {class_dist}")
        
        # Proper train/test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        
        # Cross-validation
        cv_scores = cross_val_score(
            RandomForestClassifier(n_estimators=100, random_state=42),
            X_train, y_train, cv=5, scoring='accuracy'
        )
        
        # Train final model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Test predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # Overfitting detection
        train_accuracy = model.score(X_train, y_train)
        test_accuracy = accuracy
        overfitting_score = train_accuracy - test_accuracy
        
        results = {
            'model_type': 'triage_classification',
            'cv_scores': cv_scores.tolist(),
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'overfitting_score': overfitting_score,
            'f1_score': f1,
            'precision': precision,
            'recall': recall,
            'confusion_matrix': cm.tolist(),
            'class_distribution': class_dist,
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'timestamp': datetime.now().isoformat()
        }
        
        # Log results
        logger.info(f"Triage Model Results:")
        logger.info(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        logger.info(f"  Test Accuracy: {accuracy:.4f}")
        logger.info(f"  F1 Score: {f1:.4f}")
        logger.info(f"  Overfitting Score: {overfitting_score:.4f}")
        
        if overfitting_score > 0.1:
            logger.warning(f"  ⚠️  Potential overfitting detected!")
        
        return results
    
    def evaluate_all_models(self) -> Dict[str, Any]:
        """Evaluate all ManageAgent models"""
        logger.info("Starting realistic evaluation of all ManageAgent models...")
        
        results = {}
        
        # Evaluate each model
        try:
            results['wait_time'] = self.evaluate_wait_time_model()
            logger.info(f"✅ Wait time model evaluation completed")
        except Exception as e:
            logger.error(f"❌ Wait time model evaluation failed: {e}")
            results['wait_time'] = {'error': str(e)}
        
        try:
            results['triage'] = self.evaluate_triage_model()
            logger.info(f"✅ Triage model evaluation completed")
        except Exception as e:
            logger.error(f"❌ Triage model evaluation failed: {e}")
            results['triage'] = {'error': str(e)}
        
        # Create evaluation summary
        summary = {
            'total_models': 2,
            'successful_evaluations': len([r for r in results.values() if 'error' not in r]),
            'failed_evaluations': len([r for r in results.values() if 'error' in r]),
            'results': results,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save evaluation results
        eval_path = os.path.join(self.models_dir, 'manage_agent_evaluation.json')
        with open(eval_path, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        logger.info(f"ManageAgent evaluation completed: {summary['successful_evaluations']}/{summary['total_models']} models evaluated")
        
        return summary

if __name__ == "__main__":
    evaluator = ManageAgentEvaluator()
    results = evaluator.evaluate_all_models()
    print("ManageAgent realistic evaluation completed!") 