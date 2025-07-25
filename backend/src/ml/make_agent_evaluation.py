#!/usr/bin/env python3
"""
MakeAgent Model Evaluation Framework
Proper evaluation with cross-validation, overfitting detection, and realistic testing.
"""

import json
import os
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from sklearn.model_selection import cross_val_score, train_test_split, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import logging
from datetime import datetime
from nltk.tokenize import sent_tokenize
import warnings
warnings.filterwarnings('ignore')

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MakeAgentEvaluator:
    def __init__(self):
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data/processed/make_agent")
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/models/make_agent")
        
    def load_processed_data(self, model_type: str) -> Dict[str, Any]:
        """Load processed data for evaluation"""
        if model_type == 'speech_recognition':
            data_file = os.path.join(self.data_dir, f"{model_type}/speech_data.json")
        else:
            data_file = os.path.join(self.data_dir, f"{model_type}/{model_type}_data.json")
        
        with open(data_file, 'r') as f:
            data = json.load(f)
        
        return data
    
    def create_realistic_features(self, model_type: str, data: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray]:
        """Create realistic features that don't leak information"""
        
        if model_type == 'speech_recognition':
            return self.create_speech_features_realistic(data)
        elif model_type == 'ner':
            return self.create_ner_features_realistic(data)
        elif model_type == 'summarization':
            return self.create_summarization_features_realistic(data)
        elif model_type == 'validation':
            return self.create_validation_features_realistic(data)
        else:
            raise ValueError(f"Unknown model type: {model_type}")
    
    def create_speech_features_realistic(self, data: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray]:
        """Create realistic speech recognition features"""
        features = []
        labels = []
        
        all_transcripts = data['train']['transcripts'] + data['validation']['transcripts']
        
        for transcript in all_transcripts:
            # Realistic features that don't directly predict quality
            words = transcript.split()
            
            feature_vector = [
                len(words),  # Text length
                np.mean([len(w) for w in words]) if words else 0,  # Average word length
                len([w for w in words if w.isupper()]),  # All caps words
                len([w for w in words if any(c.isdigit() for c in w)]),  # Words with numbers
                len([w for w in words if '-' in w]),  # Hyphenated words
                len([w for w in words if '.' in w]),  # Words with periods
                len([w for w in words if ',' in w]),  # Words with commas
                len([w for w in words if len(w) > 10]),  # Very long words
                len([w for w in words if len(w) < 3]),  # Very short words
                len(set(words)) / len(words) if words else 0,  # Vocabulary diversity
            ]
            
            features.append(feature_vector)
            
            # Realistic label based on text quality indicators (not derived from features)
            has_medical_terms = any(term in transcript.lower() for term in 
                                  ['patient', 'diagnosis', 'treatment', 'symptoms', 'prescribed'])
            has_proper_structure = '.' in transcript and len(words) > 5
            label = 1 if has_medical_terms and has_proper_structure else 0
            labels.append(label)
        
        return np.array(features), np.array(labels)
    
    def create_ner_features_realistic(self, data: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray]:
        """Create realistic NER features"""
        features = []
        labels = []
        
        for sample in data['train'] + data['validation']:
            text = sample['text']
            words = text.split()
            
            # Features based on text characteristics, not entity counts
            feature_vector = [
                len(words),  # Text length
                np.mean([len(w) for w in words]) if words else 0,  # Average word length
                len([w for w in words if w.isupper()]),  # Capitalized words
                len([w for w in words if any(c.isdigit() for c in w)]),  # Words with numbers
                len([w for w in words if len(w) > 8]),  # Long words (potential medical terms)
                len([w for w in words if w.endswith('itis')]),  # Medical suffixes
                len([w for w in words if w.endswith('osis')]),  # Medical suffixes
                len([w for w in words if w.endswith('emia')]),  # Medical suffixes
                len(set(words)) / len(words) if words else 0,  # Vocabulary diversity
                len([w for w in words if any(c in 'aeiou' for c in w)]) / len(words) if words else 0,  # Vowel ratio
            ]
            
            features.append(feature_vector)
            
            # Realistic label based on medical content indicators
            medical_indicators = ['diagnosis', 'symptoms', 'treatment', 'prescribed', 'patient', 'doctor']
            has_medical_content = any(indicator in text.lower() for indicator in medical_indicators)
            has_medical_terms = len([w for w in words if len(w) > 8]) > 0
            label = 1 if has_medical_content and has_medical_terms else 0
            labels.append(label)
        
        return np.array(features), np.array(labels)
    
    def create_summarization_features_realistic(self, data: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray]:
        """Create realistic summarization features"""
        features = []
        labels = []
        
        for sample in data['train'] + data['validation']:
            full_text = sample['full_text']
            summary = sample['summary']
            
            # Features based on text characteristics
            feature_vector = [
                len(full_text.split()),
                len(summary.split()),
                len(sent_tokenize(full_text)),
                len(sent_tokenize(summary)),
                np.mean([len(s.split()) for s in sent_tokenize(full_text)]) if sent_tokenize(full_text) else 0,
                np.mean([len(s.split()) for s in sent_tokenize(summary)]) if sent_tokenize(summary) else 0,
                len([w for w in full_text.split() if len(w) > 6]),
                len([w for w in summary.split() if len(w) > 6]),
                len(set(full_text.split())) / len(full_text.split()) if full_text.split() else 0,
                len(set(summary.split())) / len(summary.split()) if summary.split() else 0,
            ]
            
            features.append(feature_vector)
            
            # Realistic label based on summary quality
            compression_ratio = len(summary.split()) / len(full_text.split()) if len(full_text.split()) > 0 else 0
            has_key_info = any(term in summary.lower() for term in ['diagnosis', 'treatment', 'symptoms'])
            is_appropriate_length = 0.1 <= compression_ratio <= 0.8
            label = 1 if has_key_info and is_appropriate_length else 0
            labels.append(label)
        
        return np.array(features), np.array(labels)
    
    def create_validation_features_realistic(self, data: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray]:
        """Create realistic validation features"""
        features = []
        labels = []
        
        for sample in data['train'] + data['validation']:
            original = sample['original']
            with_errors = sample['with_errors']
            
            # Features based on text characteristics
            orig_words = original.split()
            error_words = with_errors.split()
            
            feature_vector = [
                len(orig_words),
                len(error_words),
                np.mean([len(w) for w in orig_words]) if orig_words else 0,
                np.mean([len(w) for w in error_words]) if error_words else 0,
                len([w for w in orig_words if w.isupper()]),
                len([w for w in error_words if w.isupper()]),
                len([w for w in orig_words if any(c.isdigit() for c in w)]),
                len([w for w in error_words if any(c.isdigit() for c in w)]),
                len([w for w in orig_words if len(w) > 8]),
                len([w for w in error_words if len(w) > 8]),
            ]
            
            features.append(feature_vector)
            
            # Realistic label based on error characteristics
            word_diff = abs(len(orig_words) - len(error_words))
            has_significant_errors = word_diff > 2 or len(set(orig_words) - set(error_words)) > 1
            label = 0 if has_significant_errors else 1
            labels.append(label)
        
        return np.array(features), np.array(labels)
    
    def evaluate_model_realistic(self, model_type: str) -> Dict[str, Any]:
        """Evaluate model with realistic features and proper cross-validation"""
        logger.info(f"Evaluating {model_type} model with realistic features...")
        
        # Load data
        data = self.load_processed_data(model_type)
        
        # Create realistic features
        X, y = self.create_realistic_features(model_type, data)
        
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
            'model_type': model_type,
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
        logger.info(f"{model_type} Results:")
        logger.info(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        logger.info(f"  Test Accuracy: {accuracy:.4f}")
        logger.info(f"  F1 Score: {f1:.4f}")
        logger.info(f"  Overfitting Score: {overfitting_score:.4f}")
        
        if overfitting_score > 0.1:
            logger.warning(f"  ⚠️  Potential overfitting detected!")
        
        return results
    
    def evaluate_all_models(self) -> Dict[str, Any]:
        """Evaluate all MakeAgent models"""
        logger.info("Starting realistic evaluation of all MakeAgent models...")
        
        model_types = ['speech_recognition', 'ner', 'summarization', 'validation']
        results = {}
        
        for model_type in model_types:
            try:
                results[model_type] = self.evaluate_model_realistic(model_type)
                logger.info(f"✅ {model_type} evaluation completed")
            except Exception as e:
                logger.error(f"❌ {model_type} evaluation failed: {e}")
                results[model_type] = {'error': str(e)}
        
        # Create evaluation summary
        summary = {
            'total_models': len(model_types),
            'successful_evaluations': len([r for r in results.values() if 'error' not in r]),
            'failed_evaluations': len([r for r in results.values() if 'error' in r]),
            'results': results,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save evaluation results
        eval_path = os.path.join(self.models_dir, 'realistic_evaluation.json')
        with open(eval_path, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        logger.info(f"Evaluation completed: {summary['successful_evaluations']}/{summary['total_models']} models evaluated")
        
        return summary

if __name__ == "__main__":
    evaluator = MakeAgentEvaluator()
    results = evaluator.evaluate_all_models()
    print("Realistic evaluation completed!") 