#!/usr/bin/env python3
"""
MakeAgent Data Preparation Script
Prepares medical datasets for training speech recognition, NER, summarization, and validation models.
"""

import pandas as pd
import numpy as np
import json
import re
import os
from typing import Dict, List, Tuple, Any
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import logging

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MakeAgentDataPreparation:
    def __init__(self):
        # Get the current working directory which should be the project root
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data/medical_datasets/make_agent")
        self.output_dir = os.path.join(self.project_root, "backend/src/ml/data/processed/make_agent")
        self.ensure_directories()
        
        # Medical entity patterns for NER
        self.medical_entities = {
            'symptoms': [
                'fever', 'cough', 'headache', 'nausea', 'vomiting', 'diarrhea',
                'fatigue', 'pain', 'swelling', 'rash', 'dizziness', 'shortness of breath',
                'chest pain', 'abdominal pain', 'back pain', 'joint pain'
            ],
            'diagnoses': [
                'diabetes', 'hypertension', 'asthma', 'pneumonia', 'flu', 'covid',
                'heart disease', 'cancer', 'arthritis', 'depression', 'anxiety'
            ],
            'medications': [
                'aspirin', 'ibuprofen', 'acetaminophen', 'antibiotics', 'insulin',
                'metformin', 'lisinopril', 'amlodipine', 'albuterol', 'prednisone'
            ],
            'body_parts': [
                'head', 'chest', 'abdomen', 'arm', 'leg', 'back', 'neck',
                'throat', 'ear', 'eye', 'nose', 'mouth', 'heart', 'lung'
            ]
        }
        
    def ensure_directories(self):
        """Create necessary directories"""
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(f"{self.output_dir}/speech_recognition", exist_ok=True)
        os.makedirs(f"{self.output_dir}/ner", exist_ok=True)
        os.makedirs(f"{self.output_dir}/summarization", exist_ok=True)
        os.makedirs(f"{self.output_dir}/validation", exist_ok=True)
        
    def load_medical_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all available medical datasets"""
        datasets = {}
        
        logger.info(f"Looking for datasets in: {self.data_dir}")
        logger.info(f"Project root: {self.project_root}")
        
        # Load Medical Q&A datasets
        qa_files = [
            'Medical_Multiple_Choice_QA_train.csv',
            'Medical_Multiple_Choice_QA_test.csv',
            'Medical_Multiple_Choice_QA_validation.csv'
        ]
        
        for file in qa_files:
            file_path = os.path.join(self.data_dir, file)
            logger.info(f"Checking for file: {file_path}")
            logger.info(f"File exists: {os.path.exists(file_path)}")
            if os.path.exists(file_path):
                try:
                    df = pd.read_csv(file_path)
                    datasets[f"qa_{file.replace('.csv', '')}"] = df
                    logger.info(f"Loaded {file}: {len(df)} rows")
                except Exception as e:
                    logger.warning(f"Failed to load {file}: {e}")
        
        # Load medical conversations dataset
        conv_file = 'Med_Dataset___Medical_Q&A_&_Conversations_test.csv'
        conv_path = os.path.join(self.data_dir, conv_file)
        logger.info(f"Checking for conversations file: {conv_path}")
        logger.info(f"File exists: {os.path.exists(conv_path)}")
        if os.path.exists(conv_path):
            try:
                df = pd.read_csv(conv_path)
                datasets['medical_conversations'] = df
                logger.info(f"Loaded {conv_file}: {len(df)} rows")
            except Exception as e:
                logger.warning(f"Failed to load {conv_file}: {e}")
        
        # Load Indian mental health data
        mental_health_path = os.path.join(self.project_root, "backend/src/ml/data/indian_healthcare/raw/Amod_mental_health_counseling_conversations_train.csv")
        logger.info(f"Checking for mental health file: {mental_health_path}")
        logger.info(f"File exists: {os.path.exists(mental_health_path)}")
        if os.path.exists(mental_health_path):
            try:
                df = pd.read_csv(mental_health_path)
                datasets['mental_health'] = df
                logger.info(f"Loaded mental health data: {len(df)} rows")
            except Exception as e:
                logger.warning(f"Failed to load mental health data: {e}")
        
        return datasets
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for medical content"""
        if pd.isna(text):
            return ""
        
        text = str(text).lower()
        
        # Remove special characters but keep medical terms
        text = re.sub(r'[^\w\s\-\.]', ' ', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_medical_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract medical entities from text for NER training"""
        entities = {category: [] for category in self.medical_entities.keys()}
        
        text_lower = text.lower()
        words = word_tokenize(text_lower)
        
        for category, terms in self.medical_entities.items():
            for term in terms:
                if term in text_lower:
                    entities[category].append(term)
        
        return entities
    
    def prepare_speech_recognition_data(self, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Prepare data for speech recognition model training"""
        logger.info("Preparing speech recognition data...")
        
        # Combine all text data to simulate speech transcripts
        all_texts = []
        
        for name, df in datasets.items():
            # Find text columns
            text_columns = [col for col in df.columns if any(keyword in col.lower() 
                           for keyword in ['text', 'question', 'answer', 'conversation', 'content'])]
            
            for col in text_columns:
                texts = df[col].dropna().apply(self.preprocess_text)
                all_texts.extend(texts.tolist())
        
        # Create training/validation split
        train_texts, val_texts = train_test_split(all_texts, test_size=0.2, random_state=42)
        
        # Create synthetic speech-like data (simulating transcribed speech)
        speech_data = {
            'train': {
                'transcripts': train_texts,
                'lengths': [len(text.split()) for text in train_texts]
            },
            'validation': {
                'transcripts': val_texts,
                'lengths': [len(text.split()) for text in val_texts]
            }
        }
        
        # Save speech recognition data
        with open(f"{self.output_dir}/speech_recognition/speech_data.json", 'w') as f:
            json.dump(speech_data, f, indent=2)
        
        logger.info(f"Speech recognition data prepared: {len(train_texts)} train, {len(val_texts)} validation")
        return speech_data
    
    def prepare_ner_data(self, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Prepare data for Named Entity Recognition model training"""
        logger.info("Preparing NER data...")
        
        ner_samples = []
        
        for name, df in datasets.items():
            text_columns = [col for col in df.columns if any(keyword in col.lower() 
                           for keyword in ['text', 'question', 'answer', 'conversation', 'content'])]
            
            for col in text_columns:
                texts = df[col].dropna().apply(self.preprocess_text)
                
                for text in texts:
                    if len(text.split()) > 5:  # Only meaningful texts
                        entities = self.extract_medical_entities(text)
                        
                        # Create NER training sample
                        sample = {
                            'text': text,
                            'entities': entities,
                            'entity_count': sum(len(entities[cat]) for cat in entities)
                        }
                        ner_samples.append(sample)
        
        # Split data
        train_samples, val_samples = train_test_split(ner_samples, test_size=0.2, random_state=42)
        
        ner_data = {
            'train': train_samples,
            'validation': val_samples,
            'entity_types': list(self.medical_entities.keys())
        }
        
        # Save NER data
        with open(f"{self.output_dir}/ner/ner_data.json", 'w') as f:
            json.dump(ner_data, f, indent=2)
        
        logger.info(f"NER data prepared: {len(train_samples)} train, {len(val_samples)} validation")
        return ner_data
    
    def prepare_summarization_data(self, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Prepare data for document summarization model training"""
        logger.info("Preparing summarization data...")
        
        summarization_samples = []
        
        for name, df in datasets.items():
            text_columns = [col for col in df.columns if any(keyword in col.lower() 
                           for keyword in ['text', 'question', 'answer', 'conversation', 'content'])]
            
            for col in text_columns:
                texts = df[col].dropna().apply(self.preprocess_text)
                
                for text in texts:
                    sentences = sent_tokenize(text)
                    
                    if len(sentences) >= 3:  # Only texts with multiple sentences
                        # Create summary (first 2 sentences as summary)
                        summary = ' '.join(sentences[:2])
                        full_text = ' '.join(sentences)
                        
                        sample = {
                            'full_text': full_text,
                            'summary': summary,
                            'length_ratio': len(summary.split()) / len(full_text.split())
                        }
                        summarization_samples.append(sample)
        
        # Split data
        train_samples, val_samples = train_test_split(summarization_samples, test_size=0.2, random_state=42)
        
        summarization_data = {
            'train': train_samples,
            'validation': val_samples
        }
        
        # Save summarization data
        with open(f"{self.output_dir}/summarization/summarization_data.json", 'w') as f:
            json.dump(summarization_data, f, indent=2)
        
        logger.info(f"Summarization data prepared: {len(train_samples)} train, {len(val_samples)} validation")
        return summarization_data
    
    def prepare_validation_data(self, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Prepare data for transcription validation model training"""
        logger.info("Preparing validation data...")
        
        validation_samples = []
        
        for name, df in datasets.items():
            text_columns = [col for col in df.columns if any(keyword in col.lower() 
                           for keyword in ['text', 'question', 'answer', 'conversation', 'content'])]
            
            for col in text_columns:
                texts = df[col].dropna().apply(self.preprocess_text)
                
                for text in texts:
                    if len(text.split()) > 10:  # Only longer texts
                        # Create synthetic errors for training
                        words = text.split()
                        
                        # Create version with potential errors
                        error_text = self.introduce_synthetic_errors(text)
                        
                        sample = {
                            'original': text,
                            'with_errors': error_text,
                            'error_count': self.count_errors(text, error_text),
                            'medical_terms': self.extract_medical_entities(text)
                        }
                        validation_samples.append(sample)
        
        # Split data
        train_samples, val_samples = train_test_split(validation_samples, test_size=0.2, random_state=42)
        
        validation_data = {
            'train': train_samples,
            'validation': val_samples
        }
        
        # Save validation data
        with open(f"{self.output_dir}/validation/validation_data.json", 'w') as f:
            json.dump(validation_data, f, indent=2)
        
        logger.info(f"Validation data prepared: {len(train_samples)} train, {len(val_samples)} validation")
        return validation_data
    
    def introduce_synthetic_errors(self, text: str) -> str:
        """Introduce synthetic errors for validation training"""
        words = text.split()
        error_probability = 0.1  # 10% chance of error per word
        
        for i in range(len(words)):
            if np.random.random() < error_probability:
                # Introduce different types of errors
                error_type = np.random.choice(['typo', 'missing', 'extra'])
                
                if error_type == 'typo' and len(words[i]) > 2:
                    # Introduce typo
                    pos = np.random.randint(0, len(words[i]))
                    words[i] = words[i][:pos] + 'x' + words[i][pos+1:]
                elif error_type == 'missing':
                    # Remove word
                    words[i] = ''
                elif error_type == 'extra':
                    # Add extra word
                    words[i] = words[i] + ' extra'
        
        return ' '.join([w for w in words if w])
    
    def count_errors(self, original: str, error_text: str) -> int:
        """Count differences between original and error text"""
        orig_words = set(original.split())
        error_words = set(error_text.split())
        return len(orig_words.symmetric_difference(error_words))
    
    def create_data_summary(self, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Create comprehensive data summary"""
        summary = {
            'datasets_loaded': len(datasets),
            'total_samples': sum(len(df) for df in datasets.values()),
            'dataset_details': {}
        }
        
        for name, df in datasets.items():
            summary['dataset_details'][name] = {
                'rows': len(df),
                'columns': list(df.columns),
                'memory_usage': int(df.memory_usage(deep=True).sum())
            }
        
        # Save summary
        with open(f"{self.output_dir}/data_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary
    
    def run_preparation(self):
        """Run complete data preparation pipeline"""
        logger.info("Starting MakeAgent data preparation...")
        
        # Load datasets
        datasets = self.load_medical_datasets()
        if not datasets:
            logger.error("No datasets found!")
            return
        
        # Create data summary
        summary = self.create_data_summary(datasets)
        logger.info(f"Loaded {summary['datasets_loaded']} datasets with {summary['total_samples']} total samples")
        
        # Prepare data for each model
        speech_data = self.prepare_speech_recognition_data(datasets)
        ner_data = self.prepare_ner_data(datasets)
        summarization_data = self.prepare_summarization_data(datasets)
        validation_data = self.prepare_validation_data(datasets)
        
        logger.info("MakeAgent data preparation completed successfully!")
        
        return {
            'speech_recognition': speech_data,
            'ner': ner_data,
            'summarization': summarization_data,
            'validation': validation_data,
            'summary': summary
        }

if __name__ == "__main__":
    preparer = MakeAgentDataPreparation()
    results = preparer.run_preparation()
    print("Data preparation completed!") 