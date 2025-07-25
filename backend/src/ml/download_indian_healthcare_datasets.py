#!/usr/bin/env python3
"""
Download specific Indian healthcare datasets from HuggingFace
Target datasets: NidaanKosh, Spandan, DermaCon-IN
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

class IndianHealthcareDataDownloader:
    """
    Download specific Indian healthcare datasets from HuggingFace
    """
    
    def __init__(self, output_dir="data/indian_healthcare"):
        self.output_dir = output_dir
        
        # Login to HuggingFace
        try:
            login(token=HF_TOKEN)
            logger.info("✅ Successfully logged in to HuggingFace")
        except Exception as e:
            logger.error(f"❌ Failed to login to HuggingFace: {e}")
        
        self.api = HfApi()
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/raw", exist_ok=True)
        
        # Target Indian healthcare datasets
        self.target_datasets = {
            "nidaankosh": {
                "name": "NidaanKosh - Indian Lab Reports",
                "dataset_id": "ekacare/nidaankosh",
                "description": "6.8M+ lab readings from 100,000 Indian subjects",
                "type": "lab_reports"
            },
            "spandan": {
                "name": "Spandan - Cardiovascular Monitoring", 
                "dataset_id": "ekacare/spandan-1M-V1.0-raw",
                "description": "1M+ PPG signals for cardiovascular monitoring",
                "type": "vital_signs"
            },
            "dermacon": {
                "name": "DermaCon-IN - Indian Dermatology",
                "dataset_id": "ekacare/DermaCon-IN",
                "description": "Dermatology-specific Indian dataset for skin disease AI",
                "type": "dermatology"
            }
        }
    
    def download_dataset(self, dataset_id, dataset_name):
        """
        Download a specific dataset from HuggingFace
        """
        try:
            logger.info(f"📥 Downloading {dataset_name} ({dataset_id})...")
            
            # Load dataset
            dataset = load_dataset(dataset_id)
            
            # Convert to pandas DataFrames
            dataframes = {}
            if hasattr(dataset, 'items'):
                for split_name, split_data in dataset.items():
                    df = split_data.to_pandas()
                    dataframes[split_name] = df
                    
                    # Save raw data
                    filepath = f"{self.output_dir}/raw/{dataset_name}_{split_name}.csv"
                    df.to_csv(filepath, index=False)
                    logger.info(f"Saved {len(df)} records to {filepath}")
            else:
                # Handle single split datasets
                df = dataset.to_pandas()
                dataframes['train'] = df
                
                # Save raw data
                filepath = f"{self.output_dir}/raw/{dataset_name}_train.csv"
                df.to_csv(filepath, index=False)
                logger.info(f"Saved {len(df)} records to {filepath}")
            
            return dataframes
            
        except Exception as e:
            logger.error(f"Error downloading dataset {dataset_id}: {e}")
            return None
    
    def download_all_indian_datasets(self):
        """
        Download all target Indian healthcare datasets
        """
        logger.info("🏥 Starting Indian healthcare dataset download...")
        
        downloaded_datasets = {}
        
        for dataset_key, dataset_info in self.target_datasets.items():
            dataset_id = dataset_info['dataset_id']
            dataset_name = dataset_info['name'].replace(' ', '_').replace('-', '_')
            
            logger.info(f"\n📥 Downloading: {dataset_info['name']}")
            logger.info(f"   Dataset ID: {dataset_id}")
            logger.info(f"   Description: {dataset_info['description']}")
            
            dataframes = self.download_dataset(dataset_id, dataset_name)
            
            if dataframes:
                downloaded_datasets[dataset_key] = {
                    'dataframes': dataframes,
                    'metadata': dataset_info,
                    'total_records': sum(len(df) for df in dataframes.values())
                }
                logger.info(f"✅ Successfully downloaded {dataset_name}")
            else:
                logger.warning(f"❌ Failed to download {dataset_name}")
        
        return downloaded_datasets
    
    def generate_download_summary(self, downloaded_datasets):
        """
        Generate a summary of downloaded datasets
        """
        summary = {
            'download_date': datetime.now().isoformat(),
            'total_datasets': len(downloaded_datasets),
            'datasets': {}
        }
        
        for dataset_key, info in downloaded_datasets.items():
            metadata = info['metadata']
            summary['datasets'][dataset_key] = {
                'name': metadata['name'],
                'dataset_id': metadata['dataset_id'],
                'description': metadata['description'],
                'type': metadata['type'],
                'total_records': info['total_records'],
                'splits': list(info['dataframes'].keys())
            }
        
        # Save summary
        summary_filepath = f"{self.output_dir}/indian_datasets_summary.json"
        with open(summary_filepath, 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"📋 Download summary saved: {summary_filepath}")
        return summary

def main():
    """
    Main function to download Indian healthcare datasets
    """
    print("🏥 Indian Healthcare Dataset Downloader")
    print("=" * 50)
    print("Target datasets:")
    print("1. NidaanKosh - 6.8M+ lab readings from 100,000 Indian subjects")
    print("2. Spandan - 1M+ PPG signals for cardiovascular monitoring") 
    print("3. DermaCon-IN - Indian dermatology dataset")
    print("=" * 50)
    
    # Initialize downloader
    downloader = IndianHealthcareDataDownloader()
    
    try:
        # Download all datasets
        downloaded_datasets = downloader.download_all_indian_datasets()
        
        if downloaded_datasets:
            # Generate summary
            summary = downloader.generate_download_summary(downloaded_datasets)
            
            print(f"\n✅ Successfully downloaded {len(downloaded_datasets)} datasets!")
            print(f"📁 Data saved in: {downloader.output_dir}")
            
            # Print summary
            for dataset_key, info in downloaded_datasets.items():
                metadata = info['metadata']
                total_records = info['total_records']
                print(f"   📊 {metadata['name']}: {total_records:,} records")
        
        else:
            print("❌ No datasets were downloaded.")
    
    except Exception as e:
        print(f"❌ Error during download: {e}")

if __name__ == "__main__":
    main() 