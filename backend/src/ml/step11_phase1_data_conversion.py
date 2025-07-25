#!/usr/bin/env python3
"""
Phase 1: Data Conversion (20-30 Mins—Convert 497k CSV to Training Format)
Convert 497k medical records to Llama instruction format with 80/20 train/val split.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from typing import List, Dict, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

# ML imports
from sklearn.model_selection import train_test_split
from datasets import Dataset

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataConverter:
    """
    Phase 1: Convert 497k CSV to Llama instruction format
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data")
        self.output_dir = os.path.join(self.project_root, "backend/src/ml/data/step11_llama_training")
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Input dataset path
        self.input_csv = os.path.join(self.data_dir, "step10_merged/merged_dataset.csv")
        
        # Results tracking
        self.results = {
            'total_records': 0,
            'train_records': 0,
            'val_records': 0,
            'conversion_time': 0,
            'timestamp': datetime.now().isoformat()
        }
    
    def load_497k_dataset(self) -> pd.DataFrame:
        """Load the 497k merged dataset"""
        logger.info("Loading 497k merged dataset...")
        
        if not os.path.exists(self.input_csv):
            logger.error(f"Input CSV not found: {self.input_csv}")
            return pd.DataFrame()
        
        try:
            df = pd.read_csv(self.input_csv)
            logger.info(f"Loaded dataset: {len(df)} records")
            self.results['total_records'] = len(df)
            return df
        except Exception as e:
            logger.error(f"Failed to load dataset: {e}")
            return pd.DataFrame()
    
    def create_medical_instruction_prompts(self, df: pd.DataFrame) -> List[Dict[str, str]]:
        """Create medical instruction prompts from 497k records"""
        logger.info("Creating medical instruction prompts...")
        
        prompts = []
        
        for idx, row in df.iterrows():
            # Create medical instruction prompt
            prompt = self._generate_medical_prompt(row)
            response = self._generate_medical_response(row)
            
            prompts.append({
                'instruction': prompt,
                'input': '',
                'output': response,
                'text': f"<|system|>You are a medical AI assistant specialized in Indian healthcare. Provide accurate, helpful medical information.</s><|user|>{prompt}</s><|assistant|>{response}</s>"
            })
            
            # Progress logging
            if (idx + 1) % 50000 == 0:
                logger.info(f"Processed {idx + 1} records...")
        
        logger.info(f"Created {len(prompts)} medical instruction prompts")
        return prompts
    
    def _generate_medical_prompt(self, row: pd.Series) -> str:
        """Generate medical instruction prompt based on data"""
        
        # Extract available fields
        age = row.get('age', 'unknown')
        symptoms = row.get('symptoms', 'unknown')
        state = row.get('state', 'unknown')
        cost = row.get('cost', 'unknown')
        urgency = row.get('urgency_level', 'unknown')
        department = row.get('department', 'unknown')
        medical_complexity = row.get('medical_complexity', 'unknown')
        
        # Create different types of medical prompts based on available data
        if pd.notna(symptoms) and symptoms != 'unknown':
            # Triage assessment prompt
            prompt = f"Medical task: Extract entities and reason urgency for patient age {age}, symptoms {symptoms}, state {state}, cost {cost}, urgency {urgency}, department {department}, medical complexity {medical_complexity}."
        
        elif 'input_text' in row and pd.notna(row['input_text']):
            # Medical Q&A prompt
            prompt = f"Medical Question: {row['input_text']}"
        
        elif 'Context' in row and pd.notna(row['Context']):
            # Mental health counseling prompt
            prompt = f"Mental Health Session: Patient says: {row['Context']}"
        
        elif 'department' in row and pd.notna(row['department']):
            # Resource management prompt
            patient_count = row.get('patient_count', 'unknown')
            staff_available = row.get('staff_available', 'unknown')
            prompt = f"Resource Management: Department {department}, patient count: {patient_count}, staff available: {staff_available}. Optimize resource allocation."
        
        else:
            # Generic medical assessment prompt
            prompt = f"Medical Assessment: Patient age {age}, state {state}, cost {cost}, urgency {urgency}. Provide medical assessment and recommendations."
        
        return prompt
    
    def _generate_medical_response(self, row: pd.Series) -> str:
        """Generate medical response based on data"""
        
        # Extract available fields
        age = row.get('age', 'unknown')
        symptoms = row.get('symptoms', 'unknown')
        state = row.get('state', 'unknown')
        urgency = row.get('urgency_level', 'unknown')
        department = row.get('department', 'unknown')
        
        # Generate response based on available data
        if pd.notna(symptoms) and symptoms != 'unknown':
            # Triage response
            if urgency and float(urgency) > 4:
                response = f"URGENT TRIAGE: Patient requires immediate attention. Symptoms: {symptoms}. Age: {age}. State: {state}. Refer to emergency department immediately. Monitor vitals closely."
            elif urgency and float(urgency) > 2:
                response = f"MODERATE PRIORITY: Patient needs prompt evaluation. Symptoms: {symptoms}. Age: {age}. State: {state}. Schedule urgent appointment. Consider specialist referral."
            else:
                response = f"ROUTINE CARE: Patient presents with {symptoms}. Age: {age}. State: {state}. Standard evaluation recommended. Follow up as needed."
        
        elif 'output_text' in row and pd.notna(row['output_text']):
            # Medical Q&A response
            response = row['output_text']
        
        elif 'Response' in row and pd.notna(row['Response']):
            # Mental health response
            response = row['Response']
        
        elif 'department' in row and pd.notna(row['department']):
            # Resource management response
            patient_count = row.get('patient_count', 'unknown')
            staff_available = row.get('staff_available', 'unknown')
            response = f"RESOURCE OPTIMIZATION: Department {department} has {patient_count} patients and {staff_available} staff. Recommended: Reallocate staff based on patient load, optimize room utilization, and monitor wait times."
        
        else:
            # Generic medical response
            response = f"MEDICAL ASSESSMENT: Patient age {age}, state {state}, urgency {urgency}. Standard evaluation recommended. Consider follow-up based on symptoms and medical history."
        
        return response
    
    def create_train_val_split(self, prompts: List[Dict[str, str]]) -> Tuple[Dataset, Dataset]:
        """Create 80/20 train/val split"""
        logger.info("Creating 80/20 train/val split...")
        
        # Create dataset
        dataset = Dataset.from_list(prompts)
        
        # Split 80/20
        train_test = dataset.train_test_split(test_size=0.2, seed=42)
        train_dataset = train_test['train']
        val_dataset = train_test['test']
        
        self.results['train_records'] = len(train_dataset)
        self.results['val_records'] = len(val_dataset)
        
        logger.info(f"Train dataset: {len(train_dataset)} records")
        logger.info(f"Validation dataset: {len(val_dataset)} records")
        
        return train_dataset, val_dataset
    
    def save_datasets(self, train_dataset: Dataset, val_dataset: Dataset):
        """Save train and validation datasets"""
        logger.info("Saving datasets...")
        
        # Save train dataset
        train_path = os.path.join(self.output_dir, "train_dataset")
        train_dataset.save_to_disk(train_path)
        logger.info(f"Saved train dataset to: {train_path}")
        
        # Save validation dataset
        val_path = os.path.join(self.output_dir, "val_dataset")
        val_dataset.save_to_disk(val_path)
        logger.info(f"Saved validation dataset to: {val_path}")
        
        # Save sample prompts for inspection
        sample_prompts = train_dataset.select(range(min(10, len(train_dataset))))
        sample_path = os.path.join(self.output_dir, "sample_prompts.json")
        with open(sample_path, 'w') as f:
            json.dump(sample_prompts.to_list(), f, indent=2)
        logger.info(f"Saved sample prompts to: {sample_path}")
    
    def generate_phase1_report(self):
        """Generate Phase 1 summary report"""
        logger.info("Generating Phase 1 report...")
        
        report = {
            'phase': 'Phase 1: Data Conversion',
            'timestamp': datetime.now().isoformat(),
            'results': self.results,
            'success_criteria': {
                'total_records': '>400k records',
                'train_records': '>300k records',
                'val_records': '>80k records',
                'conversion_time': '<30 minutes'
            },
            'status': 'COMPLETE' if self.results['total_records'] > 400000 else 'INCOMPLETE'
        }
        
        # Save report
        output_path = os.path.join(self.output_dir, 'phase1_report.json')
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Phase 1 report saved to: {output_path}")
        return report
    
    def run_phase1(self) -> Dict[str, Any]:
        """Run complete Phase 1 process"""
        logger.info("Starting Phase 1: Data Conversion")
        
        start_time = datetime.now()
        
        try:
            # Step 1: Load 497k dataset
            df = self.load_497k_dataset()
            
            if df.empty:
                logger.error("No dataset loaded!")
                return {'error': 'No dataset loaded', 'status': 'FAILED'}
            
            # Step 2: Create medical instruction prompts
            prompts = self.create_medical_instruction_prompts(df)
            
            if not prompts:
                logger.error("No prompts created!")
                return {'error': 'No prompts created', 'status': 'FAILED'}
            
            # Step 3: Create train/val split
            train_dataset, val_dataset = self.create_train_val_split(prompts)
            
            # Step 4: Save datasets
            self.save_datasets(train_dataset, val_dataset)
            
            # Step 5: Generate report
            conversion_time = (datetime.now() - start_time).total_seconds()
            self.results['conversion_time'] = conversion_time
            
            report = self.generate_phase1_report()
            
            logger.info(f"Phase 1 completed in {conversion_time:.2f} seconds!")
            return report
            
        except Exception as e:
            logger.error(f"Phase 1 failed: {e}")
            return {'error': str(e), 'status': 'FAILED'}

def main():
    """Main execution function"""
    converter = DataConverter()
    results = converter.run_phase1()
    
    print("\n" + "="*60)
    print("PHASE 1 RESULTS")
    print("="*60)
    print(f"Total Records: {results.get('results', {}).get('total_records', 0)}")
    print(f"Train Records: {results.get('results', {}).get('train_records', 0)}")
    print(f"Validation Records: {results.get('results', {}).get('val_records', 0)}")
    print(f"Conversion Time: {results.get('results', {}).get('conversion_time', 0):.2f} seconds")
    print(f"Status: {results.get('status', 'UNKNOWN')}")
    print("="*60)

if __name__ == "__main__":
    main() 