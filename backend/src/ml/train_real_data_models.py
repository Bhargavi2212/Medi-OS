#!/usr/bin/env python3
"""
Train ML Models on Real Healthcare Data for HealthOS
Retrain existing models and create new ones using real datasets
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging
import pickle
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HealthOSRealDataTrainer:
    """
    Train ML models on real healthcare data for HealthOS
    """
    
    def __init__(self, data_dir="data/indian_healthcare"):
        self.data_dir = data_dir
        self.processed_dir = f"{data_dir}/processed"
        self.models_dir = f"{data_dir}/models"
        
        # Create models directory
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Model configurations
        self.models = {
            'diagnostic_classifier': {
                'type': 'text_classification',
                'algorithm': 'naive_bayes',
                'description': 'Symptom to Diagnosis Classifier'
            },
            'mental_health_classifier': {
                'type': 'text_classification', 
                'algorithm': 'random_forest',
                'description': 'Mental Health Topic Classifier'
            },
            'severity_assessor': {
                'type': 'text_classification',
                'algorithm': 'naive_bayes',
                'description': 'Symptom Severity Assessor'
            }
        }
    
    def load_processed_data(self):
        """
        Load processed datasets
        """
        logger.info("📥 Loading processed datasets...")
        
        datasets = {}
        processed_path = Path(self.processed_dir)
        
        if processed_path.exists():
            for file_path in processed_path.glob("*_processed.csv"):
                dataset_name = file_path.stem.replace('_processed', '')
                logger.info(f"Loading {dataset_name}...")
                
                try:
                    df = pd.read_csv(file_path)
                    datasets[dataset_name] = df
                    logger.info(f"✅ Loaded {dataset_name}: {len(df)} records")
                except Exception as e:
                    logger.error(f"❌ Failed to load {dataset_name}: {e}")
        
        return datasets
    
    def prepare_diagnostic_data(self, df):
        """
        Prepare diagnostic data for training
        """
        logger.info("🏥 Preparing diagnostic data for training...")
        
        # Prepare features and labels
        X = df['input_text'].fillna('')
        y = df['output_text'].fillna('')
        
        # Create TF-IDF features
        vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=2
        )
        
        X_tfidf = vectorizer.fit_transform(X)
        
        return X_tfidf, y, vectorizer
    
    def prepare_mental_health_data(self, df):
        """
        Prepare mental health data for training
        """
        logger.info("🧠 Preparing mental health data for training...")
        
        # Prepare features and labels
        X = df['Context'].fillna('')
        y = df['topic_category'].fillna('general')
        
        # Create TF-IDF features
        vectorizer = TfidfVectorizer(
            max_features=3000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=2
        )
        
        X_tfidf = vectorizer.fit_transform(X)
        
        return X_tfidf, y, vectorizer
    
    def prepare_severity_data(self, df):
        """
        Prepare severity assessment data for training
        """
        logger.info("⚠️ Preparing severity assessment data for training...")
        
        # Prepare features and labels
        X = df['input_text'].fillna('')
        y = df['severity_level'].fillna('mild')
        
        # Create TF-IDF features
        vectorizer = TfidfVectorizer(
            max_features=2000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=2
        )
        
        X_tfidf = vectorizer.fit_transform(X)
        
        return X_tfidf, y, vectorizer
    
    def train_diagnostic_classifier(self, train_df, test_df):
        """
        Train diagnostic classifier
        """
        logger.info("🏥 Training diagnostic classifier...")
        
        # Prepare training data
        X_train, y_train, vectorizer = self.prepare_diagnostic_data(train_df)
        
        # Prepare test data
        X_test = test_df['input_text'].fillna('')
        X_test_tfidf = vectorizer.transform(X_test)
        y_test = test_df['output_text'].fillna('')
        
        # Train model
        model = MultinomialNB(alpha=0.1)
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test_tfidf)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"✅ Diagnostic classifier accuracy: {accuracy:.3f}")
        
        # Save model and vectorizer
        model_data = {
            'model': model,
            'vectorizer': vectorizer,
            'accuracy': accuracy,
            'training_date': datetime.now().isoformat(),
            'training_samples': X_train.shape[0],
            'test_samples': X_test.shape[0]
        }
        
        model_file = f"{self.models_dir}/diagnostic_classifier.pkl"
        with open(model_file, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"💾 Model saved: {model_file}")
        return model_data
    
    def train_mental_health_classifier(self, df):
        """
        Train mental health topic classifier
        """
        logger.info("🧠 Training mental health topic classifier...")
        
        # Prepare data
        X, y, vectorizer = self.prepare_mental_health_data(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"✅ Mental health classifier accuracy: {accuracy:.3f}")
        
        # Save model and vectorizer
        model_data = {
            'model': model,
            'vectorizer': vectorizer,
            'accuracy': accuracy,
            'training_date': datetime.now().isoformat(),
            'training_samples': X_train.shape[0],
            'test_samples': X_test.shape[0]
        }
        
        model_file = f"{self.models_dir}/mental_health_classifier.pkl"
        with open(model_file, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"💾 Model saved: {model_file}")
        return model_data
    
    def train_severity_assessor(self, df):
        """
        Train severity assessment model
        """
        logger.info("⚠️ Training severity assessor...")
        
        # Prepare data
        X, y, vectorizer = self.prepare_severity_data(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model
        model = MultinomialNB(alpha=0.1)
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"✅ Severity assessor accuracy: {accuracy:.3f}")
        
        # Save model and vectorizer
        model_data = {
            'model': model,
            'vectorizer': vectorizer,
            'accuracy': accuracy,
            'training_date': datetime.now().isoformat(),
            'training_samples': X_train.shape[0],
            'test_samples': X_test.shape[0]
        }
        
        model_file = f"{self.models_dir}/severity_assessor.pkl"
        with open(model_file, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"💾 Model saved: {model_file}")
        return model_data
    
    def train_all_models(self):
        """
        Train all models on real healthcare data
        """
        logger.info("🏥 Starting model training on real healthcare data...")
        
        # Load processed data
        datasets = self.load_processed_data()
        
        if not datasets:
            logger.error("No processed datasets found for training")
            return {}
        
        trained_models = {}
        
        # Train diagnostic classifier
        if 'gretelai_symptom_to_diagnosis_train' in datasets and 'gretelai_symptom_to_diagnosis_test' in datasets:
            train_df = datasets['gretelai_symptom_to_diagnosis_train']
            test_df = datasets['gretelai_symptom_to_diagnosis_test']
            
            diagnostic_model = self.train_diagnostic_classifier(train_df, test_df)
            trained_models['diagnostic_classifier'] = diagnostic_model
        
        # Train mental health classifier
        if 'Amod_mental_health_counseling_conversations_train' in datasets:
            mental_health_df = datasets['Amod_mental_health_counseling_conversations_train']
            mental_health_model = self.train_mental_health_classifier(mental_health_df)
            trained_models['mental_health_classifier'] = mental_health_model
        
        # Train severity assessor
        if 'gretelai_symptom_to_diagnosis_train' in datasets:
            severity_df = datasets['gretelai_symptom_to_diagnosis_train']
            severity_model = self.train_severity_assessor(severity_df)
            trained_models['severity_assessor'] = severity_model
        
        return trained_models
    
    def generate_training_report(self, trained_models):
        """
        Generate training report
        """
        logger.info("📋 Generating training report...")
        
        report = {
            'training_date': datetime.now().isoformat(),
            'total_models': len(trained_models),
            'models': {},
            'summary': {
                'average_accuracy': 0,
                'total_training_samples': 0
            }
        }
        
        accuracies = []
        total_samples = 0
        
        for model_name, model_data in trained_models.items():
            model_summary = {
                'name': model_name,
                'accuracy': model_data['accuracy'],
                'training_date': model_data['training_date'],
                'training_samples': model_data['training_samples'],
                'test_samples': model_data['test_samples'],
                'model_file': f"{self.models_dir}/{model_name}.pkl"
            }
            
            report['models'][model_name] = model_summary
            
            accuracies.append(model_data['accuracy'])
            total_samples += model_data['training_samples']
        
        # Calculate summary statistics
        report['summary']['average_accuracy'] = np.mean(accuracies) if accuracies else 0
        report['summary']['total_training_samples'] = total_samples
        
        # Save report
        report_filepath = f"{self.models_dir}/training_report.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Training report saved: {report_filepath}")
        return report
    
    def print_summary(self, report):
        """
        Print training summary
        """
        print(f"\n" + "="*60)
        print("🏥 HealthOS Model Training Summary")
        print("="*60)
        
        print(f"📊 Total Models Trained: {report['total_models']}")
        print(f"📊 Average Accuracy: {report['summary']['average_accuracy']:.3f}")
        print(f"📊 Total Training Samples: {report['summary']['total_training_samples']:,}")
        
        print("\n📋 Model Details:")
        for model_name, info in report['models'].items():
            print(f"   • {model_name}")
            print(f"     - Accuracy: {info['accuracy']:.3f}")
            print(f"     - Training Samples: {info['training_samples']:,}")
            print(f"     - Test Samples: {info['test_samples']:,}")

def main():
    """
    Main function to train models on real data
    """
    print("🏥 HealthOS Real Data Model Training")
    print("=" * 50)
    
    # Initialize trainer
    trainer = HealthOSRealDataTrainer()
    
    try:
        # Train all models
        trained_models = trainer.train_all_models()
        
        if trained_models:
            # Generate report
            report = trainer.generate_training_report(trained_models)
            
            # Print summary
            trainer.print_summary(report)
            
            print(f"\n✅ Model training completed successfully!")
            print(f"📁 Models saved in: {trainer.models_dir}")
        
        else:
            print("❌ No models were trained.")
    
    except Exception as e:
        print(f"❌ Error during training: {e}")

if __name__ == "__main__":
    main() 