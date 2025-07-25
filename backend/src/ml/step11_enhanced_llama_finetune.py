#!/usr/bin/env python3
"""
Enhanced Step 11: Fine-tune Llama 3.1 with QLoRA on 500k+ Medical Records
Advanced implementation with DeepSpeed, W&B monitoring, and Cloud Run deployment.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from typing import Dict, List, Any, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

# Core ML imports
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, accuracy_score
import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    TaskType
)
import bitsandbytes as bnb

# Enhanced imports
from datasets import Dataset, load_from_disk
from trl import SFTTrainer
import wandb
from imblearn.over_sampling import SMOTE

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedLlamaFineTuner:
    """
    Enhanced Step 11: Fine-tune Llama 3.1 with QLoRA on 500k+ Medical Records
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data")
        self.output_dir = os.path.join(self.project_root, "backend/src/ml/data/step11_enhanced_finetune")
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Model configuration
        self.model_name = "meta-llama/Meta-Llama-3-8B-Instruct"
        
        # Enhanced QLoRA configuration
        self.lora_config = {
            'r': 16,  # Rank
            'lora_alpha': 32,  # Alpha parameter
            'target_modules': ['q_proj', 'v_proj', 'k_proj', 'o_proj'],
            'lora_dropout': 0.05,  # Reduced dropout
            'bias': 'none',
            'task_type': TaskType.CAUSAL_LM
        }
        
        # Enhanced training configuration
        self.training_config = {
            'output_dir': os.path.join(self.output_dir, 'medi_os_llama_tuned'),
            'num_train_epochs': 5,  # Increased epochs
            'per_device_train_batch_size': 8,  # Larger batch
            'per_device_eval_batch_size': 8,
            'gradient_accumulation_steps': 4,
            'learning_rate': 2e-5,  # Optimized learning rate
            'warmup_steps': 100,
            'logging_steps': 50,
            'save_steps': 500,
            'eval_steps': 500,
            'save_total_limit': 3,
            'load_best_model_at_end': True,
            'metric_for_best_model': 'f1',
            'greater_is_better': True,
            'fp16': True,
            'bf16': False,
            'dataloader_pin_memory': False,
            'remove_unused_columns': False,
            'report_to': 'wandb',  # W&B integration
            'deepspeed': {
                'zero_optimization': {
                    'stage': 3,
                    'offload_optimizer': {'device': 'cpu'},
                    'offload_param': {'device': 'cpu'}
                },
                'fp16': {'enabled': True},
                'gradient_accumulation_steps': 4,
                'gradient_clipping': 1.0,
                'steps_per_print': 50,
                'train_batch_size': 32,
                'train_micro_batch_size_per_gpu': 8,
                'wall_clock_breakdown': False
            }
        }
        
        # Results tracking
        self.results = {
            'total_records': 0,
            'training_records': 0,
            'validation_records': 0,
            'model_path': '',
            'training_time': 0,
            'final_f1_score': 0.0,
            'timestamp': datetime.now().isoformat()
        }
    
    def load_enhanced_dataset(self) -> pd.DataFrame:
        """Load and merge all available datasets for 500k+ records"""
        logger.info("Loading enhanced dataset (target: 500k+ records)...")
        
        datasets = []
        
        # Load all available datasets
        dataset_paths = [
            # Core datasets
            os.path.join(self.data_dir, 'merged_40k_dataset.csv'),
            os.path.join(self.data_dir, 'medical_datasets/make_agent/Medical_Multiple_Choice_QA_test.csv'),
            os.path.join(self.data_dir, 'medical_datasets/make_agent/Medical_Multiple_Choice_QA_validation.csv'),
            os.path.join(self.data_dir, 'indian_healthcare/raw/Amod_mental_health_counseling_conversations_train.csv'),
            os.path.join(self.data_dir, 'indian_healthcare/raw/gretelai_symptom_to_diagnosis_train.csv'),
            os.path.join(self.data_dir, 'indian_healthcare/raw/gretelai_symptom_to_diagnosis_test.csv'),
            
            # Additional datasets
            os.path.join(self.data_dir, 'sample_resource_data.csv'),
            os.path.join(self.data_dir, 'sample_triage_data.csv'),
            os.path.join(self.data_dir, 'sample_wait_time_data.csv'),
            
            # Processed datasets
            os.path.join(self.data_dir, 'indian_healthcare/processed/Amod_mental_health_counseling_conversations_train_processed.csv'),
            os.path.join(self.data_dir, 'indian_healthcare/processed/gretelai_symptom_to_diagnosis_train_processed.csv'),
            os.path.join(self.data_dir, 'indian_healthcare/processed/gretelai_symptom_to_diagnosis_test_processed.csv')
        ]
        
        for path in dataset_paths:
            if os.path.exists(path):
                try:
                    df = pd.read_csv(path)
                    df['dataset_source'] = os.path.basename(path)
                    datasets.append(df)
                    logger.info(f"Loaded {os.path.basename(path)}: {len(df)} records")
                except Exception as e:
                    logger.warning(f"Failed to load {path}: {e}")
        
        if datasets:
            merged_df = pd.concat(datasets, ignore_index=True)
            logger.info(f"Total merged records: {len(merged_df)}")
            
            # Apply SMOTE for class imbalance
            merged_df = self._apply_smote_augmentation(merged_df)
            
            self.results['total_records'] = len(merged_df)
            return merged_df
        else:
            logger.error("No datasets found!")
            return pd.DataFrame()
    
    def _apply_smote_augmentation(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply SMOTE augmentation for class imbalance"""
        logger.info("Applying SMOTE augmentation...")
        
        try:
            # Identify categorical columns for encoding
            categorical_cols = ['caste', 'state', 'gender', 'department', 'dataset_source']
            
            # Create label encoders
            encoders = {}
            df_encoded = df.copy()
            
            for col in categorical_cols:
                if col in df.columns:
                    from sklearn.preprocessing import LabelEncoder
                    le = LabelEncoder()
                    df_encoded[f'{col}_encoded'] = le.fit_transform(df[col].fillna('Unknown'))
                    encoders[col] = le
            
            # Prepare features for SMOTE
            feature_cols = [col for col in df_encoded.columns if col.endswith('_encoded') or col in ['age', 'medical_complexity', 'urgency_level', 'cost']]
            
            X = df_encoded[feature_cols].fillna(0)
            y = df_encoded['caste_encoded']  # Use caste as target for balancing
            
            # Apply SMOTE
            smote = SMOTE(random_state=42, k_neighbors=3)
            X_resampled, y_resampled = smote.fit_resample(X, y)
            
            # Create augmented dataset
            augmented_df = df_encoded.iloc[:len(X_resampled)].copy()
            augmented_df[feature_cols] = X_resampled
            
            # Decode categorical columns back
            for col in categorical_cols:
                if col in encoders:
                    encoded_col = f'{col}_encoded'
                    if encoded_col in augmented_df.columns:
                        augmented_df[col] = encoders[col].inverse_transform(augmented_df[encoded_col])
            
            # Remove encoded columns
            for col in feature_cols:
                if col.endswith('_encoded'):
                    augmented_df = augmented_df.drop(columns=[col])
            
            logger.info(f"SMOTE applied: {len(augmented_df)} records (original: {len(df)})")
            return augmented_df
            
        except Exception as e:
            logger.warning(f"SMOTE failed: {e}. Using original dataset.")
            return df
    
    def convert_to_enhanced_instruction_format(self, df: pd.DataFrame) -> List[Dict[str, str]]:
        """Convert medical data to enhanced instruction-following format"""
        logger.info("Converting data to enhanced instruction format...")
        
        training_data = []
        
        # Enhanced medical scenarios
        for idx, row in df.iterrows():
            # Scenario 1: Triage Assessment
            if 'symptoms' in df.columns and pd.notna(row['symptoms']):
                instruction = f"Medical Triage Assessment: Patient age {row.get('age', 'unknown')}, symptoms: {row['symptoms']}, urgency level: {row.get('urgency_level', 'unknown')}, state: {row.get('state', 'unknown')}. Provide triage assessment and next steps."
                response = self._generate_enhanced_medical_response(row, 'triage')
                training_data.append({'instruction': instruction, 'input': '', 'output': response})
            
            # Scenario 2: Medical Q&A
            elif 'input_text' in df.columns and pd.notna(row['input_text']):
                instruction = f"Medical Question: {row['input_text']}"
                response = row.get('output_text', 'I need more information to provide a proper medical assessment.')
                training_data.append({'instruction': instruction, 'input': '', 'output': response})
            
            # Scenario 3: Mental Health Counseling
            elif 'Context' in df.columns and pd.notna(row['Context']):
                instruction = f"Mental Health Session: Patient says: {row['Context']}"
                response = row.get('Response', 'I understand. Let me help you with this.')
                training_data.append({'instruction': instruction, 'input': '', 'output': response})
            
            # Scenario 4: Resource Management
            elif 'department' in df.columns and pd.notna(row['department']):
                instruction = f"Resource Management: Department {row['department']}, patient count: {row.get('patient_count', 'unknown')}, staff available: {row.get('staff_available', 'unknown')}. Optimize resource allocation."
                response = self._generate_enhanced_medical_response(row, 'resource')
                training_data.append({'instruction': instruction, 'input': '', 'output': response})
        
        logger.info(f"Created {len(training_data)} enhanced training examples")
        return training_data
    
    def _generate_enhanced_medical_response(self, row: pd.Series, scenario: str) -> str:
        """Generate enhanced medical response based on scenario"""
        if scenario == 'triage':
            symptoms = row.get('symptoms', '')
            age = row.get('age', 'unknown')
            urgency = row.get('urgency_level', 'unknown')
            state = row.get('state', 'unknown')
            
            if urgency and float(urgency) > 4:
                response = f"URGENT TRIAGE: Patient requires immediate attention. Symptoms: {symptoms}. Age: {age}. State: {state}. Refer to emergency department immediately. Monitor vitals closely."
            elif urgency and float(urgency) > 2:
                response = f"MODERATE PRIORITY: Patient needs prompt evaluation. Symptoms: {symptoms}. Age: {age}. State: {state}. Schedule urgent appointment. Consider specialist referral."
            else:
                response = f"ROUTINE CARE: Patient presents with {symptoms}. Age: {age}. State: {state}. Standard evaluation recommended. Follow up as needed."
        
        elif scenario == 'resource':
            department = row.get('department', 'General')
            patient_count = row.get('patient_count', 'unknown')
            staff_available = row.get('staff_available', 'unknown')
            
            response = f"RESOURCE OPTIMIZATION: Department {department} has {patient_count} patients and {staff_available} staff. Recommended: Reallocate staff based on patient load, optimize room utilization, and monitor wait times."
        
        return response
    
    def setup_enhanced_model_and_tokenizer(self):
        """Setup Llama model and tokenizer with enhanced QLoRA configuration"""
        logger.info("Setting up enhanced model and tokenizer...")
        
        try:
            # Load tokenizer
            tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            tokenizer.pad_token = tokenizer.eos_token
            tokenizer.padding_side = "right"
            
            # Load model with 4-bit quantization
            model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16,
                device_map="auto",
                load_in_4bit=True,
                quantization_config=bnb.BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
            )
            
            # Prepare model for k-bit training
            model = prepare_model_for_kbit_training(model)
            
            # Setup enhanced LoRA
            lora_config = LoraConfig(
                r=self.lora_config['r'],
                lora_alpha=self.lora_config['lora_alpha'],
                target_modules=self.lora_config['target_modules'],
                lora_dropout=self.lora_config['lora_dropout'],
                bias=self.lora_config['bias'],
                task_type=self.lora_config['task_type']
            )
            
            # Apply LoRA
            model = get_peft_model(model, lora_config)
            
            # Print trainable parameters
            model.print_trainable_parameters()
            
            logger.info("Enhanced model and tokenizer setup complete")
            return model, tokenizer
            
        except Exception as e:
            logger.error(f"Failed to setup model: {e}")
            return None, None
    
    def compute_enhanced_metrics(self, eval_pred):
        """Compute enhanced metrics for evaluation"""
        predictions, labels = eval_pred
        predictions = torch.argmax(torch.tensor(predictions), dim=-1)
        
        # Flatten arrays
        predictions = predictions.flatten()
        labels = labels.flatten()
        
        # Calculate metrics
        f1 = f1_score(labels, predictions, average='macro')
        accuracy = accuracy_score(labels, predictions)
        
        return {
            'f1': f1,
            'accuracy': accuracy
        }
    
    def train_enhanced_model(self, model, tokenizer, train_texts: List[str], val_texts: List[str]):
        """Train the model with enhanced configuration"""
        logger.info("Starting enhanced model training...")
        
        start_time = datetime.now()
        
        try:
            # Initialize W&B
            wandb.init(
                project="medi-os-llama-tune",
                config={
                    'model_name': self.model_name,
                    'lora_config': self.lora_config,
                    'training_config': self.training_config
                }
            )
            
            # Create datasets
            train_dataset = Dataset.from_list([{'text': text} for text in train_texts])
            val_dataset = Dataset.from_list([{'text': text} for text in val_texts])
            
            # Save datasets
            train_dataset.save_to_disk(os.path.join(self.output_dir, 'train_dataset'))
            val_dataset.save_to_disk(os.path.join(self.output_dir, 'val_dataset'))
            
            # Setup training arguments
            training_args = TrainingArguments(
                **self.training_config
            )
            
            # Setup SFT trainer
            trainer = SFTTrainer(
                model=model,
                args=training_args,
                train_dataset=train_dataset,
                eval_dataset=val_dataset,
                tokenizer=tokenizer,
                compute_metrics=self.compute_enhanced_metrics,
                max_seq_length=512,
                packing=False
            )
            
            # Train the model
            logger.info("Starting training with DeepSpeed and W&B monitoring...")
            trainer.train()
            
            # Evaluate
            eval_results = trainer.evaluate()
            logger.info(f"Evaluation results: {eval_results}")
            
            # Save the model
            model_path = os.path.join(self.output_dir, 'medi_os_llama_tuned')
            trainer.save_model(model_path)
            tokenizer.save_pretrained(model_path)
            
            # Save LoRA config
            model.save_pretrained(model_path)
            
            training_time = (datetime.now() - start_time).total_seconds()
            self.results['training_time'] = training_time
            self.results['model_path'] = model_path
            self.results['final_f1_score'] = eval_results.get('eval_f1', 0.0)
            
            # Close W&B
            wandb.finish()
            
            logger.info(f"Training completed in {training_time:.2f} seconds")
            logger.info(f"Final F1 Score: {self.results['final_f1_score']:.4f}")
            logger.info(f"Model saved to: {model_path}")
            
            return True
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            return False
    
    def generate_enhanced_summary_report(self):
        """Generate enhanced training summary report"""
        logger.info("Generating enhanced summary report...")
        
        report = {
            'step': 'Step 11: Enhanced Fine-tune Llama 3.1 with QLoRA',
            'timestamp': datetime.now().isoformat(),
            'results': self.results,
            'enhanced_config': {
                'base_model': self.model_name,
                'lora_config': self.lora_config,
                'training_config': self.training_config,
                'features': [
                    'QLoRA with 4-bit quantization',
                    'DeepSpeed Zero-3 optimization',
                    'W&B monitoring integration',
                    'SMOTE augmentation',
                    'Enhanced instruction format'
                ]
            },
            'success_criteria': {
                'total_records': '>500k records',
                'training_records': '>400k records',
                'validation_records': '>100k records',
                'final_f1_score': '>0.94',
                'training_time': '<6 hours'
            },
            'status': 'COMPLETE' if self.results['final_f1_score'] > 0.94 else 'INCOMPLETE'
        }
        
        # Save report
        output_path = os.path.join(self.output_dir, 'step11_enhanced_summary.json')
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Enhanced summary report saved to: {output_path}")
        return report
    
    def run_enhanced_step11(self) -> Dict[str, Any]:
        """Run complete enhanced Step 11 process"""
        logger.info("Starting Enhanced Step 11: Fine-tune Llama 3.1 with QLoRA")
        
        try:
            # Step 1: Load enhanced dataset
            df = self.load_enhanced_dataset()
            
            if df.empty:
                logger.error("No training data found!")
                return {'error': 'No training data', 'status': 'FAILED'}
            
            # Step 2: Convert to enhanced instruction format
            training_data = self.convert_to_enhanced_instruction_format(df)
            
            if not training_data:
                logger.error("No training examples created!")
                return {'error': 'No training examples', 'status': 'FAILED'}
            
            # Step 3: Prepare training dataset
            train_texts, val_texts = self.prepare_training_dataset(training_data)
            
            # Step 4: Setup enhanced model and tokenizer
            model, tokenizer = self.setup_enhanced_model_and_tokenizer()
            
            if model is None or tokenizer is None:
                logger.error("Failed to setup model!")
                return {'error': 'Model setup failed', 'status': 'FAILED'}
            
            # Step 5: Train enhanced model
            success = self.train_enhanced_model(model, tokenizer, train_texts, val_texts)
            
            if not success:
                logger.error("Training failed!")
                return {'error': 'Training failed', 'status': 'FAILED'}
            
            # Step 6: Generate enhanced summary report
            summary = self.generate_enhanced_summary_report()
            
            logger.info("Enhanced Step 11 completed successfully!")
            return summary
            
        except Exception as e:
            logger.error(f"Enhanced Step 11 failed: {e}")
            return {'error': str(e), 'status': 'FAILED'}
    
    def prepare_training_dataset(self, training_data: List[Dict[str, str]]) -> Tuple[List[str], List[str]]:
        """Prepare training dataset for Llama fine-tuning"""
        logger.info("Preparing enhanced training dataset...")
        
        # Split into train/validation (80/20)
        train_data, val_data = train_test_split(training_data, test_size=0.2, random_state=42)
        
        # Convert to Llama format
        train_texts = []
        val_texts = []
        
        for item in train_data:
            text = self._format_for_llama(item['instruction'], item['input'], item['output'])
            train_texts.append(text)
        
        for item in val_data:
            text = self._format_for_llama(item['instruction'], item['input'], item['output'])
            val_texts.append(text)
        
        self.results['training_records'] = len(train_texts)
        self.results['validation_records'] = len(val_texts)
        
        logger.info(f"Training examples: {len(train_texts)}")
        logger.info(f"Validation examples: {len(val_texts)}")
        
        return train_texts, val_texts
    
    def _format_for_llama(self, instruction: str, input_text: str, output: str) -> str:
        """Format data for Llama instruction-following"""
        if input_text:
            prompt = f"<|system|>You are a medical AI assistant specialized in Indian healthcare. Provide accurate, helpful medical information.</s><|user|>{instruction}\n{input_text}</s><|assistant|>{output}</s>"
        else:
            prompt = f"<|system|>You are a medical AI assistant specialized in Indian healthcare. Provide accurate, helpful medical information.</s><|user|>{instruction}</s><|assistant|>{output}</s>"
        
        return prompt

def main():
    """Main execution function"""
    finetuner = EnhancedLlamaFineTuner()
    results = finetuner.run_enhanced_step11()
    
    print("\n" + "="*60)
    print("ENHANCED STEP 11 RESULTS")
    print("="*60)
    print(f"Total Records: {results.get('results', {}).get('total_records', 0)}")
    print(f"Training Records: {results.get('results', {}).get('training_records', 0)}")
    print(f"Validation Records: {results.get('results', {}).get('validation_records', 0)}")
    print(f"Training Time: {results.get('results', {}).get('training_time', 0):.2f} seconds")
    print(f"Final F1 Score: {results.get('results', {}).get('final_f1_score', 0):.4f}")
    print(f"Status: {results.get('status', 'UNKNOWN')}")
    print("="*60)

if __name__ == "__main__":
    main() 