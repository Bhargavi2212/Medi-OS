#!/usr/bin/env python3
"""
MakeAgent (AI Scribe & Records Agent)
Integrates all four trained models for medical transcription and document processing.
"""

import json
import os
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
import joblib
import logging
from datetime import datetime
import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MakeAgent:
    """
    MakeAgent - AI Scribe & Records Agent
    
    Core Functions:
    1. Speech Recognition: Convert medical speech to text
    2. Medical NER: Extract patient info, symptoms, diagnoses, medications
    3. Document Summarization: Generate concise clinical notes
    4. Transcription Validation: Validate and correct transcriptions
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/models/make_agent")
        
        # Initialize text preprocessing
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Load trained models
        self.models = {}
        self.load_models()
        
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
        
    def load_models(self):
        """Load all trained models"""
        model_types = ['speech_recognition', 'ner', 'summarization', 'validation']
        
        for model_type in model_types:
            model_path = os.path.join(self.models_dir, f"{model_type}/{model_type}_model.pkl")
            metrics_path = os.path.join(self.models_dir, f"{model_type}/{model_type}_metrics.json")
            
            try:
                self.models[model_type] = joblib.load(model_path)
                
                # Load metrics
                with open(metrics_path, 'r') as f:
                    metrics = json.load(f)
                
                logger.info(f"Loaded {model_type} model - Accuracy: {metrics['accuracy']:.4f}")
                
            except Exception as e:
                logger.error(f"Failed to load {model_type} model: {e}")
                self.models[model_type] = None
    
    def preprocess_text(self, text: str) -> str:
        """Advanced text preprocessing for medical content"""
        if pd.isna(text):
            return ""
        
        text = str(text).lower()
        
        # Remove special characters but keep medical terms
        text = re.sub(r'[^\w\s\-\.]', ' ', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Lemmatization
        words = word_tokenize(text)
        words = [self.lemmatizer.lemmatize(word) for word in words if word not in self.stop_words]
        
        return ' '.join(words)
    
    def prepare_speech_recognition_features(self, text: str) -> np.ndarray:
        """Prepare features for speech recognition model"""
        processed_text = self.preprocess_text(text)
        words = processed_text.split()
        
        feature_vector = [
            len(words),  # Text length
            len([w for w in words if len(w) > 6]),  # Long words count
            len([w for w in words if w.isdigit()]),  # Numbers count
            len([w for w in words if any(char.isupper() for char in w)]),  # Capitalized words
            len([w for w in words if '-' in w]),  # Hyphenated words
            len([w for w in words if any(char in 'aeiou' for char in w)]),  # Vowel count
            len([w for w in words if any(char in 'bcdfghjklmnpqrstvwxyz' for char in w)]),  # Consonant count
        ]
        
        return np.array([feature_vector])
    
    def prepare_ner_features(self, text: str) -> np.ndarray:
        """Prepare features for NER model"""
        entities = self.extract_medical_entities(text)
        
        feature_vector = [
            len(entities['symptoms']),
            len(entities['diagnoses']),
            len(entities['medications']),
            len(entities['body_parts']),
            sum(len(entities[cat]) for cat in entities),  # Total entities
            len(text.split()),
            len([w for w in text.split() if len(w) > 8]),  # Long medical terms
        ]
        
        return np.array([feature_vector])
    
    def prepare_summarization_features(self, full_text: str, summary: str) -> np.ndarray:
        """Prepare features for summarization model"""
        feature_vector = [
            len(full_text.split()),
            len(summary.split()),
            len(summary.split()) / len(full_text.split()) if len(full_text.split()) > 0 else 0,
            len(sent_tokenize(full_text)),
            len([w for w in full_text.split() if len(w) > 6]),  # Complex words
            len([w for w in summary.split() if len(w) > 6]),
        ]
        
        return np.array([feature_vector])
    
    def prepare_validation_features(self, original: str, with_errors: str) -> np.ndarray:
        """Prepare features for validation model"""
        error_count = self.count_errors(original, with_errors)
        medical_terms = self.extract_medical_entities(original)
        
        feature_vector = [
            error_count,
            len(original.split()),
            len(with_errors.split()),
            len([w for w in original.split() if len(w) > 8]),  # Medical terms
            len([w for w in with_errors.split() if len(w) > 8]),
            len(medical_terms['symptoms']),
            len(medical_terms['diagnoses']),
            len(medical_terms['medications']),
        ]
        
        return np.array([feature_vector])
    
    def extract_medical_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract medical entities from text"""
        entities = {category: [] for category in self.medical_entities.keys()}
        
        text_lower = text.lower()
        
        for category, terms in self.medical_entities.items():
            for term in terms:
                if term in text_lower:
                    entities[category].append(term)
        
        return entities
    
    def count_errors(self, original: str, error_text: str) -> int:
        """Count differences between original and error text"""
        orig_words = set(original.split())
        error_words = set(error_text.split())
        return len(orig_words.symmetric_difference(error_words))
    
    def speech_to_text(self, audio_transcript: str) -> Dict[str, Any]:
        """
        Convert speech transcript to validated medical text
        
        Args:
            audio_transcript: Raw speech transcript
            
        Returns:
            Dict with validated text and confidence score
        """
        if not self.models.get('speech_recognition'):
            return {'error': 'Speech recognition model not loaded'}
        
        try:
            # Prepare features
            features = self.prepare_speech_recognition_features(audio_transcript)
            
            # Predict accuracy
            prediction = self.models['speech_recognition'].predict(features)[0]
            confidence = self.models['speech_recognition'].predict_proba(features)[0].max()
            
            # Clean and validate text
            validated_text = self.preprocess_text(audio_transcript)
            
            return {
                'original_transcript': audio_transcript,
                'validated_text': validated_text,
                'is_accurate': bool(prediction),
                'confidence_score': float(confidence),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Speech recognition error: {e}")
            return {'error': str(e)}
    
    def extract_medical_entities_advanced(self, text: str) -> Dict[str, Any]:
        """
        Extract medical entities using trained NER model
        
        Args:
            text: Medical text to analyze
            
        Returns:
            Dict with extracted entities and confidence
        """
        if not self.models.get('ner'):
            return {'error': 'NER model not loaded'}
        
        try:
            # Prepare features
            features = self.prepare_ner_features(text)
            
            # Predict entity quality
            prediction = self.models['ner'].predict(features)[0]
            confidence = self.models['ner'].predict_proba(features)[0].max()
            
            # Extract entities
            entities = self.extract_medical_entities(text)
            
            return {
                'text': text,
                'entities': entities,
                'entity_count': sum(len(entities[cat]) for cat in entities),
                'has_medical_entities': bool(prediction),
                'confidence_score': float(confidence),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"NER extraction error: {e}")
            return {'error': str(e)}
    
    def summarize_clinical_document(self, full_text: str, max_length: int = 200) -> Dict[str, Any]:
        """
        Generate clinical document summary
        
        Args:
            full_text: Full clinical document text
            max_length: Maximum summary length
            
        Returns:
            Dict with summary and quality metrics
        """
        if not self.models.get('summarization'):
            return {'error': 'Summarization model not loaded'}
        
        try:
            # Generate initial summary (first few sentences)
            sentences = sent_tokenize(full_text)
            initial_summary = ' '.join(sentences[:2])
            
            # Prepare features
            features = self.prepare_summarization_features(full_text, initial_summary)
            
            # Predict summary quality
            prediction = self.models['summarization'].predict(features)[0]
            confidence = self.models['summarization'].predict_proba(features)[0].max()
            
            # Truncate if needed
            if len(initial_summary) > max_length:
                words = initial_summary.split()
                summary = ' '.join(words[:max_length//5]) + '...'
            else:
                summary = initial_summary
            
            return {
                'original_text': full_text,
                'summary': summary,
                'summary_length': len(summary.split()),
                'compression_ratio': len(summary.split()) / len(full_text.split()),
                'is_high_quality': bool(prediction),
                'confidence_score': float(confidence),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Summarization error: {e}")
            return {'error': str(e)}
    
    def validate_transcription(self, original_text: str, transcribed_text: str) -> Dict[str, Any]:
        """
        Validate and correct medical transcription
        
        Args:
            original_text: Original medical text
            transcribed_text: Transcribed text to validate
            
        Returns:
            Dict with validation results and corrections
        """
        if not self.models.get('validation'):
            return {'error': 'Validation model not loaded'}
        
        try:
            # Prepare features
            features = self.prepare_validation_features(original_text, transcribed_text)
            
            # Predict validation result
            prediction = self.models['validation'].predict(features)[0]
            confidence = self.models['validation'].predict_proba(features)[0].max()
            
            # Count errors
            error_count = self.count_errors(original_text, transcribed_text)
            error_rate = error_count / len(original_text.split()) if len(original_text.split()) > 0 else 0
            
            # Generate corrections (simplified)
            corrections = []
            if error_count > 0:
                corrections.append(f"Found {error_count} potential errors")
                if error_rate > 0.1:
                    corrections.append("High error rate detected - manual review recommended")
            
            return {
                'original_text': original_text,
                'transcribed_text': transcribed_text,
                'is_valid': bool(prediction),
                'confidence_score': float(confidence),
                'error_count': error_count,
                'error_rate': error_rate,
                'corrections': corrections,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return {'error': str(e)}
    
    def process_medical_conversation(self, conversation_text: str) -> Dict[str, Any]:
        """
        Complete medical conversation processing pipeline
        
        Args:
            conversation_text: Raw medical conversation text
            
        Returns:
            Dict with all processing results
        """
        try:
            # Step 1: Speech recognition validation
            speech_result = self.speech_to_text(conversation_text)
            
            # Step 2: Entity extraction
            ner_result = self.extract_medical_entities_advanced(conversation_text)
            
            # Step 3: Document summarization
            summary_result = self.summarize_clinical_document(conversation_text)
            
            # Step 4: Transcription validation
            validation_result = self.validate_transcription(conversation_text, conversation_text)
            
            return {
                'input_text': conversation_text,
                'speech_recognition': speech_result,
                'entity_extraction': ner_result,
                'summarization': summary_result,
                'validation': validation_result,
                'processing_timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Medical conversation processing error: {e}")
            return {'error': str(e)}
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get status of all loaded models"""
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
    # Test the MakeAgent
    agent = MakeAgent()
    
    # Check model status
    status = agent.get_model_status()
    print("MakeAgent Model Status:")
    print(json.dumps(status, indent=2))
    
    # Test with sample medical text
    sample_text = "Patient presents with fever, cough, and chest pain. Diagnosed with pneumonia. Prescribed antibiotics and rest."
    
    result = agent.process_medical_conversation(sample_text)
    print("\nSample Processing Result:")
    print(json.dumps(result, indent=2)) 