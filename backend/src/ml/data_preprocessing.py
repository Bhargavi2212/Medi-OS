#!/usr/bin/env python3
"""
Data Preprocessing & Cleaning for HealthOS
Standardize, clean, and enrich healthcare datasets
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
import re
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HealthOSDataPreprocessor:
    """
    Comprehensive data preprocessing for HealthOS healthcare datasets
    """
    
    def __init__(self, data_dir="data/indian_healthcare"):
        self.data_dir = data_dir
        self.raw_dir = f"{data_dir}/raw"
        self.processed_dir = f"{data_dir}/processed"
        
        # Create processed directory
        os.makedirs(self.processed_dir, exist_ok=True)
        
        # Indian context data
        self.indian_states = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
            'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ]
        
        self.indian_cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
            'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
            'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
            'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad'
        ]
        
        # Medical specialties
        self.medical_specialties = [
            'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Psychiatry',
            'Pediatrics', 'Gynecology', 'Oncology', 'Endocrinology', 'Gastroenterology',
            'Pulmonology', 'Nephrology', 'Ophthalmology', 'ENT', 'General Medicine'
        ]
    
    def load_raw_datasets(self):
        """
        Load all raw datasets
        """
        logger.info("📥 Loading raw datasets...")
        
        datasets = {}
        raw_path = Path(self.raw_dir)
        
        if raw_path.exists():
            for file_path in raw_path.glob("*.csv"):
                dataset_name = file_path.stem
                logger.info(f"Loading {dataset_name}...")
                
                try:
                    df = pd.read_csv(file_path)
                    datasets[dataset_name] = df
                    logger.info(f"✅ Loaded {dataset_name}: {len(df)} records")
                except Exception as e:
                    logger.error(f"❌ Failed to load {dataset_name}: {e}")
        
        return datasets
    
    def clean_text_data(self, text):
        """
        Clean and standardize text data
        """
        if pd.isna(text):
            return ""
        
        # Convert to string
        text = str(text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\-\'\"]', '', text)
        
        # Standardize quotes
        text = text.replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'")
        
        return text
    
    def preprocess_mental_health_data(self, df):
        """
        Preprocess mental health counseling dataset
        """
        logger.info("🧠 Preprocessing mental health counseling data...")
        
        # Clean text columns
        df['Context'] = df['Context'].apply(self.clean_text_data)
        df['Response'] = df['Response'].apply(self.clean_text_data)
        
        # Remove rows with empty context or response
        df = df.dropna(subset=['Context', 'Response'])
        df = df[df['Context'].str.len() > 10]
        df = df[df['Response'].str.len() > 10]
        
        # Add metadata
        df['conversation_id'] = range(1, len(df) + 1)
        df['timestamp'] = datetime.now() - pd.to_timedelta(range(len(df)), unit='D')
        df['conversation_type'] = 'mental_health_counseling'
        df['language'] = 'english'
        
        # Add Indian context
        df['patient_location'] = np.random.choice(self.indian_cities, len(df))
        df['patient_state'] = np.random.choice(self.indian_states, len(df))
        df['counselor_specialty'] = 'psychology'
        
        # Categorize conversation topics
        def categorize_topic(context):
            context_lower = context.lower()
            if any(word in context_lower for word in ['depression', 'sad', 'worthless', 'hopeless']):
                return 'depression'
            elif any(word in context_lower for word in ['anxiety', 'worry', 'panic', 'stress']):
                return 'anxiety'
            elif any(word in context_lower for word in ['relationship', 'marriage', 'family']):
                return 'relationships'
            elif any(word in context_lower for word in ['suicide', 'kill', 'die']):
                return 'crisis'
            else:
                return 'general'
        
        df['topic_category'] = df['Context'].apply(categorize_topic)
        
        # Add conversation length metrics
        df['context_length'] = df['Context'].str.len()
        df['response_length'] = df['Response'].str.len()
        
        logger.info(f"✅ Processed {len(df)} mental health conversations")
        return df
    
    def preprocess_diagnostic_data(self, df):
        """
        Preprocess symptom-to-diagnosis dataset
        """
        logger.info("🏥 Preprocessing diagnostic data...")
        
        # Clean text columns
        df['input_text'] = df['input_text'].apply(self.clean_text_data)
        df['output_text'] = df['output_text'].apply(self.clean_text_data)
        
        # Remove rows with empty data
        df = df.dropna(subset=['input_text', 'output_text'])
        df = df[df['input_text'].str.len() > 10]
        df = df[df['output_text'].str.len() > 2]
        
        # Add metadata
        df['case_id'] = range(1, len(df) + 1)
        df['timestamp'] = datetime.now() - pd.to_timedelta(range(len(df)), unit='D')
        df['case_type'] = 'symptom_diagnosis'
        df['language'] = 'english'
        
        # Add Indian context
        df['patient_location'] = np.random.choice(self.indian_cities, len(df))
        df['patient_state'] = np.random.choice(self.indian_states, len(df))
        df['doctor_specialty'] = np.random.choice(self.medical_specialties, len(df))
        
        # Categorize diagnoses
        def categorize_diagnosis(diagnosis):
            diagnosis_lower = diagnosis.lower()
            if any(word in diagnosis_lower for word in ['infection', 'bacterial', 'viral']):
                return 'infectious_disease'
            elif any(word in diagnosis_lower for word in ['diabetes', 'hypertension', 'heart']):
                return 'chronic_disease'
            elif any(word in diagnosis_lower for word in ['cancer', 'tumor']):
                return 'oncology'
            elif any(word in diagnosis_lower for word in ['fracture', 'sprain', 'arthritis']):
                return 'orthopedic'
            elif any(word in diagnosis_lower for word in ['depression', 'anxiety', 'mental']):
                return 'mental_health'
            else:
                return 'general'
        
        df['diagnosis_category'] = df['output_text'].apply(categorize_diagnosis)
        
        # Add severity indicators
        def assess_severity(symptoms):
            symptoms_lower = symptoms.lower()
            severe_keywords = ['severe', 'extreme', 'unbearable', 'emergency', 'critical']
            moderate_keywords = ['moderate', 'significant', 'noticeable', 'bothersome']
            
            if any(word in symptoms_lower for word in severe_keywords):
                return 'severe'
            elif any(word in symptoms_lower for word in moderate_keywords):
                return 'moderate'
            else:
                return 'mild'
        
        df['severity_level'] = df['input_text'].apply(assess_severity)
        
        # Add text length metrics
        df['symptoms_length'] = df['input_text'].str.len()
        df['diagnosis_length'] = df['output_text'].str.len()
        
        logger.info(f"✅ Processed {len(df)} diagnostic cases")
        return df
    
    def enrich_with_healthos_entities(self, df, dataset_type):
        """
        Enrich datasets with HealthOS entity mappings
        """
        logger.info(f"🏥 Enriching {dataset_type} data with HealthOS entities...")
        
        if dataset_type == 'mental_health':
            # Map to HealthOS entities
            df['patient_id'] = range(1, len(df) + 1)
            df['counselor_id'] = range(1001, 1001 + len(df))
            df['appointment_id'] = range(2001, 2001 + len(df))
            df['document_id'] = range(3001, 3001 + len(df))
            
            # Add appointment details
            df['appointment_date'] = df['timestamp']
            df['appointment_status'] = 'completed'
            df['appointment_notes'] = df['Context']
            
            # Add document details
            df['document_type'] = 'counseling_session'
            df['document_content'] = df['Response']
            
        elif dataset_type == 'diagnostic':
            # Map to HealthOS entities
            df['patient_id'] = range(5001, 5001 + len(df))
            df['doctor_id'] = range(6001, 6001 + len(df))
            df['appointment_id'] = range(7001, 7001 + len(df))
            df['document_id'] = range(8001, 8001 + len(df))
            
            # Add appointment details
            df['appointment_date'] = df['timestamp']
            df['appointment_status'] = 'completed'
            df['appointment_notes'] = df['input_text']
            
            # Add document details
            df['document_type'] = 'diagnostic_report'
            df['document_content'] = f"Diagnosis: {df['output_text']}"
        
        return df
    
    def process_all_datasets(self):
        """
        Process all raw datasets
        """
        logger.info("🏥 Starting comprehensive data preprocessing...")
        
        # Load raw datasets
        raw_datasets = self.load_raw_datasets()
        
        if not raw_datasets:
            logger.warning("No raw datasets found for processing")
            return {}
        
        processed_datasets = {}
        
        for dataset_name, df in raw_datasets.items():
            logger.info(f"\n📊 Processing {dataset_name}...")
            
            try:
                if 'mental_health' in dataset_name.lower():
                    # Process mental health data
                    processed_df = self.preprocess_mental_health_data(df)
                    processed_df = self.enrich_with_healthos_entities(processed_df, 'mental_health')
                    
                elif 'symptom' in dataset_name.lower() or 'diagnosis' in dataset_name.lower():
                    # Process diagnostic data
                    processed_df = self.preprocess_diagnostic_data(df)
                    processed_df = self.enrich_with_healthos_entities(processed_df, 'diagnostic')
                
                else:
                    # Generic processing
                    processed_df = df.copy()
                    logger.info(f"Applied generic processing to {dataset_name}")
                
                # Save processed dataset
                output_file = f"{self.processed_dir}/{dataset_name}_processed.csv"
                processed_df.to_csv(output_file, index=False)
                
                processed_datasets[dataset_name] = {
                    'dataframe': processed_df,
                    'output_file': output_file,
                    'original_records': len(df),
                    'processed_records': len(processed_df),
                    'columns': list(processed_df.columns)
                }
                
                logger.info(f"✅ Processed {dataset_name}: {len(processed_df)} records")
                
            except Exception as e:
                logger.error(f"❌ Failed to process {dataset_name}: {e}")
        
        return processed_datasets
    
    def generate_preprocessing_report(self, processed_datasets):
        """
        Generate preprocessing report
        """
        logger.info("📋 Generating preprocessing report...")
        
        report = {
            'preprocessing_date': datetime.now().isoformat(),
            'total_datasets': len(processed_datasets),
            'datasets': {},
            'summary': {
                'total_original_records': 0,
                'total_processed_records': 0,
                'data_quality_improvements': {}
            }
        }
        
        total_original = 0
        total_processed = 0
        
        for dataset_name, info in processed_datasets.items():
            dataset_summary = {
                'name': dataset_name,
                'original_records': info['original_records'],
                'processed_records': info['processed_records'],
                'retention_rate': (info['processed_records'] / info['original_records'] * 100),
                'output_file': info['output_file'],
                'columns': info['columns']
            }
            
            report['datasets'][dataset_name] = dataset_summary
            
            total_original += info['original_records']
            total_processed += info['processed_records']
        
        report['summary']['total_original_records'] = total_original
        report['summary']['total_processed_records'] = total_processed
        report['summary']['overall_retention_rate'] = (total_processed / total_original * 100) if total_original > 0 else 0
        
        # Save report
        report_filepath = f"{self.processed_dir}/preprocessing_report.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Preprocessing report saved: {report_filepath}")
        return report
    
    def print_summary(self, report):
        """
        Print preprocessing summary
        """
        print("\n" + "="*60)
        print("🏥 HealthOS Data Preprocessing Summary")
        print("="*60)
        
        print(f"📊 Total Datasets Processed: {report['total_datasets']}")
        print(f"📊 Original Records: {report['summary']['total_original_records']:,}")
        print(f"📊 Processed Records: {report['summary']['total_processed_records']:,}")
        print(f"📊 Retention Rate: {report['summary']['overall_retention_rate']:.1f}%")
        
        print("\n📋 Dataset Details:")
        for dataset_name, info in report['datasets'].items():
            print(f"   • {dataset_name}")
            print(f"     - Original: {info['original_records']:,} records")
            print(f"     - Processed: {info['processed_records']:,} records")
            print(f"     - Retention: {info['retention_rate']:.1f}%")
            print(f"     - Columns: {len(info['columns'])}")

def main():
    """
    Main function to run data preprocessing
    """
    print("🏥 HealthOS Data Preprocessing & Cleaning")
    print("=" * 50)
    
    # Initialize preprocessor
    preprocessor = HealthOSDataPreprocessor()
    
    try:
        # Process all datasets
        processed_datasets = preprocessor.process_all_datasets()
        
        if processed_datasets:
            # Generate report
            report = preprocessor.generate_preprocessing_report(processed_datasets)
            
            # Print summary
            preprocessor.print_summary(report)
            
            print(f"\n✅ Preprocessing completed successfully!")
            print(f"📁 Processed data saved in: {preprocessor.processed_dir}")
        
        else:
            print("❌ No datasets were processed.")
    
    except Exception as e:
        print(f"❌ Error during preprocessing: {e}")

if __name__ == "__main__":
    main() 