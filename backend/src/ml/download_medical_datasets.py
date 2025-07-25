#!/usr/bin/env python3
"""
Download High-Quality Medical Datasets for Custom AI Agents
Download datasets for MakeAgent, InsightsAgent, IntegrationAgent, and MarketAgent
"""

import os
import json
import pandas as pd
from datetime import datetime
import logging
from datasets import load_dataset
from huggingface_hub import HfApi, login

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# HuggingFace API Token
HF_TOKEN = "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"

class MedicalDatasetDownloader:
    """
    Download comprehensive medical datasets for custom AI agent training
    """
    
    def __init__(self, output_dir="data/medical_datasets"):
        self.output_dir = output_dir
        
        # Login to HuggingFace
        try:
            login(token=HF_TOKEN)
            logger.info("✅ Successfully logged in to HuggingFace")
        except Exception as e:
            logger.error(f"❌ Failed to login to HuggingFace: {e}")
        
        self.api = HfApi()
        
        # Create output directories
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/make_agent", exist_ok=True)
        os.makedirs(f"{output_dir}/insights_agent", exist_ok=True)
        os.makedirs(f"{output_dir}/integration_agent", exist_ok=True)
        os.makedirs(f"{output_dir}/market_agent", exist_ok=True)
        
        # Comprehensive medical datasets for each agent
        self.datasets = {
            # MakeAgent Datasets (AI Scribe & Records)
            "make_agent": {
                "med_dataset": {
                    "name": "Med_Dataset - Medical Q&A & Conversations",
                    "dataset_id": "Med-dataset/Med_Dataset",
                    "description": "Massive collection of medical Q&A, doctor-patient conversations, instructions, medication QA",
                    "use_case": "Medical Q&A, dialogue, clinical reasoning, patient education, NER, summarization"
                },
                "clinical_ie": {
                    "name": "Clinical Information Extraction",
                    "dataset_id": "mitclinicalml/clinical-ie",
                    "description": "Clinical information extraction tasks from real clinical notes",
                    "use_case": "Clinical NLP, entity extraction, summarization, medication extraction"
                },
                "medmcqa": {
                    "name": "Medical Multiple Choice QA",
                    "dataset_id": "openlifescienceai/medmcqa",
                    "description": "Large-scale medical multiple-choice QA dataset (real medical exam questions)",
                    "use_case": "Diagnostic reasoning, clinical decision support, medical education"
                },
                "head_qa": {
                    "name": "Healthcare Exam Dataset",
                    "dataset_id": "dvilares/head_qa",
                    "description": "Multi-choice healthcare exam dataset (medicine, nursing, psychology)",
                    "use_case": "QA, reasoning, clinical knowledge assessment"
                }
            },
            
            # InsightsAgent Datasets (Analytics & Insights)
            "insights_agent": {
                "pubhealth": {
                    "name": "Public Health Fact-Checking",
                    "dataset_id": "bigbio/pubhealth",
                    "description": "11,832 public health fact-checking claims, biomedical and policy topics",
                    "use_case": "Fact-checking, public health NLP, claim verification"
                },
                "life_science_datasets": {
                    "name": "Life Science Health Datasets",
                    "dataset_id": "openlifescienceai/life-science-health-and-medical-datasets-for-ml",
                    "description": "Collection of diverse medical/health datasets for ML",
                    "use_case": "General medical ML/NLP/computer vision"
                }
            },
            
            # IntegrationAgent Datasets (System Integration)
            "integration_agent": {
                "ehrsql": {
                    "name": "EHR SQL Dataset",
                    "dataset_id": "EHRSQL",
                    "description": "Text-to-SQL dataset for EHRs, includes complex queries and time expressions",
                    "use_case": "Structured EHR QA, clinical database querying, clinical NLP"
                }
            },
            
            # MarketAgent Datasets (Patient Engagement)
            "market_agent": {
                "clinical_trials": {
                    "name": "Clinical Trial Dataset",
                    "dataset_id": "ML2Healthcare/ClinicalTrialDataset",
                    "description": "Data for multiple clinical trial prediction tasks",
                    "use_case": "Clinical trial analytics, prediction, research support"
                }
            }
        }
    
    def download_dataset(self, dataset_id, dataset_name, agent_type):
        """
        Download a specific dataset from HuggingFace
        """
        try:
            logger.info(f"📥 Downloading {dataset_name} ({dataset_id}) for {agent_type}...")
            
            # Load dataset
            dataset = load_dataset(dataset_id)
            
            # Convert to pandas DataFrames
            dataframes = {}
            if hasattr(dataset, 'items'):
                for split_name, split_data in dataset.items():
                    df = split_data.to_pandas()
                    dataframes[split_name] = df
                    
                    # Save raw data
                    filepath = f"{self.output_dir}/{agent_type}/{dataset_name}_{split_name}.csv"
                    df.to_csv(filepath, index=False)
                    logger.info(f"Saved {len(df)} records to {filepath}")
            else:
                # Handle single split datasets
                df = dataset.to_pandas()
                dataframes['train'] = df
                
                # Save raw data
                filepath = f"{self.output_dir}/{agent_type}/{dataset_name}_train.csv"
                df.to_csv(filepath, index=False)
                logger.info(f"Saved {len(df)} records to {filepath}")
            
            return dataframes
            
        except Exception as e:
            logger.error(f"Error downloading dataset {dataset_id}: {e}")
            return None
    
    def download_all_datasets(self):
        """
        Download all medical datasets for all agents
        """
        logger.info("🏥 Starting comprehensive medical dataset download...")
        
        downloaded_datasets = {}
        
        for agent_type, agent_datasets in self.datasets.items():
            logger.info(f"\n🤖 Downloading datasets for {agent_type.upper()}...")
            
            agent_downloads = {}
            
            for dataset_key, dataset_info in agent_datasets.items():
                dataset_id = dataset_info['dataset_id']
                dataset_name = dataset_info['name'].replace(' ', '_').replace('-', '_')
                
                logger.info(f"\n📥 Downloading: {dataset_info['name']}")
                logger.info(f"   Dataset ID: {dataset_id}")
                logger.info(f"   Description: {dataset_info['description']}")
                logger.info(f"   Use Case: {dataset_info['use_case']}")
                
                dataframes = self.download_dataset(dataset_id, dataset_name, agent_type)
                
                if dataframes:
                    agent_downloads[dataset_key] = {
                        'dataframes': dataframes,
                        'metadata': dataset_info,
                        'total_records': sum(len(df) for df in dataframes.values())
                    }
                    logger.info(f"✅ Successfully downloaded {dataset_name}")
                else:
                    logger.warning(f"❌ Failed to download {dataset_name}")
            
            downloaded_datasets[agent_type] = agent_downloads
        
        return downloaded_datasets
    
    def generate_download_summary(self, downloaded_datasets):
        """
        Generate comprehensive download summary
        """
        logger.info("📋 Generating download summary...")
        
        summary = {
            'download_date': datetime.now().isoformat(),
            'total_agents': len(downloaded_datasets),
            'agents': {}
        }
        
        total_datasets = 0
        total_records = 0
        
        for agent_type, agent_datasets in downloaded_datasets.items():
            agent_summary = {
                'name': agent_type,
                'datasets': {},
                'total_datasets': len(agent_datasets),
                'total_records': 0
            }
            
            for dataset_key, info in agent_datasets.items():
                metadata = info['metadata']
                total_records_agent = info['total_records']
                
                dataset_summary = {
                    'name': metadata['name'],
                    'dataset_id': metadata['dataset_id'],
                    'description': metadata['description'],
                    'use_case': metadata['use_case'],
                    'total_records': total_records_agent,
                    'splits': list(info['dataframes'].keys())
                }
                
                agent_summary['datasets'][dataset_key] = dataset_summary
                agent_summary['total_records'] += total_records_agent
            
            summary['agents'][agent_type] = agent_summary
            total_datasets += len(agent_datasets)
            total_records += agent_summary['total_records']
        
        summary['total_datasets'] = total_datasets
        summary['total_records'] = total_records
        
        # Save summary
        summary_filepath = f"{self.output_dir}/medical_datasets_summary.json"
        with open(summary_filepath, 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"📋 Download summary saved: {summary_filepath}")
        return summary
    
    def print_summary(self, summary):
        """
        Print comprehensive download summary
        """
        print("\n" + "="*80)
        print("🏥 Medical Datasets Download Summary")
        print("="*80)
        
        print(f"📊 Total Agents: {summary['total_agents']}")
        print(f"📊 Total Datasets: {summary['total_datasets']}")
        print(f"📊 Total Records: {summary['total_records']:,}")
        
        print("\n🤖 Agent Details:")
        for agent_type, agent_info in summary['agents'].items():
            print(f"\n   🎯 {agent_type.upper()}")
            print(f"      📊 Datasets: {agent_info['total_datasets']}")
            print(f"      📊 Records: {agent_info['total_records']:,}")
            
            for dataset_key, dataset_info in agent_info['datasets'].items():
                print(f"         • {dataset_info['name']}")
                print(f"           - Records: {dataset_info['total_records']:,}")
                print(f"           - Use: {dataset_info['use_case']}")

def main():
    """
    Main function to download medical datasets
    """
    print("🏥 Medical Datasets Downloader for Custom AI Agents")
    print("=" * 60)
    print("Downloading datasets for:")
    print("• MakeAgent (AI Scribe & Records)")
    print("• InsightsAgent (Analytics & Insights)")
    print("• IntegrationAgent (System Integration)")
    print("• MarketAgent (Patient Engagement)")
    print("=" * 60)
    
    # Initialize downloader
    downloader = MedicalDatasetDownloader()
    
    try:
        # Download all datasets
        downloaded_datasets = downloader.download_all_datasets()
        
        if downloaded_datasets:
            # Generate summary
            summary = downloader.generate_download_summary(downloaded_datasets)
            
            # Print summary
            downloader.print_summary(summary)
            
            print(f"\n✅ Medical datasets download completed successfully!")
            print(f"📁 Data saved in: {downloader.output_dir}")
        
        else:
            print("❌ No datasets were downloaded.")
    
    except Exception as e:
        print(f"❌ Error during download: {e}")

if __name__ == "__main__":
    main() 