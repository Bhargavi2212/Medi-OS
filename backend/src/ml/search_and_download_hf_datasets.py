#!/usr/bin/env python3
"""
Search for and download actual Indian healthcare datasets from HuggingFace
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

class HuggingFaceDatasetSearcher:
    """
    Search for and download Indian healthcare datasets from HuggingFace
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
        os.makedirs(f"{output_dir}/processed", exist_ok=True)
    
    def search_healthcare_datasets(self):
        """
        Search for healthcare-related datasets on HuggingFace
        """
        logger.info("🔍 Searching for healthcare datasets on HuggingFace...")
        
        search_terms = [
            "healthcare",
            "medical",
            "hospital",
            "patient",
            "clinical",
            "health",
            "medicine",
            "diagnosis",
            "treatment"
        ]
        
        all_datasets = []
        
        for term in search_terms:
            try:
                logger.info(f"Searching for: {term}")
                search_results = list(self.api.list_datasets(
                    search=term,
                    limit=10
                ))
                
                for dataset in search_results:
                    dataset_info = {
                        'id': dataset.id,
                        'name': dataset.id,
                        'description': getattr(dataset, 'description', 'No description'),
                        'downloads': getattr(dataset, 'downloads', 0),
                        'likes': getattr(dataset, 'likes', 0),
                        'search_term': term
                    }
                    all_datasets.append(dataset_info)
                
                logger.info(f"Found {len(search_results)} datasets for '{term}'")
                
            except Exception as e:
                logger.error(f"Error searching for '{term}': {e}")
        
        # Remove duplicates and sort by popularity
        unique_datasets = {}
        for dataset in all_datasets:
            if dataset['id'] not in unique_datasets:
                unique_datasets[dataset['id']] = dataset
            else:
                # Keep the one with more downloads
                if dataset['downloads'] > unique_datasets[dataset['id']]['downloads']:
                    unique_datasets[dataset['id']] = dataset
        
        # Sort by downloads (popularity)
        sorted_datasets = sorted(
            unique_datasets.values(), 
            key=lambda x: x['downloads'] or 0, 
            reverse=True
        )
        
        logger.info(f"Found {len(sorted_datasets)} unique healthcare datasets")
        return sorted_datasets
    
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
    
    def analyze_dataset_structure(self, df, dataset_name):
        """
        Analyze the structure of a downloaded dataset
        """
        analysis = {
            'dataset_name': dataset_name,
            'total_records': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': df.dtypes.to_dict(),
            'missing_data': df.isnull().sum().to_dict(),
            'sample_data': {}
        }
        
        # Add sample data for first few columns
        for col in df.columns[:5]:
            if df[col].dtype == 'object':
                analysis['sample_data'][col] = df[col].dropna().head(3).tolist()
            else:
                analysis['sample_data'][col] = {
                    'min': df[col].min(),
                    'max': df[col].max(),
                    'mean': df[col].mean()
                }
        
        return analysis
    
    def download_top_datasets(self, top_n=5):
        """
        Download the top N most popular healthcare datasets
        """
        logger.info("🏥 Starting healthcare dataset search and download...")
        
        # Search for datasets
        datasets = self.search_healthcare_datasets()
        
        if not datasets:
            logger.error("No datasets found")
            return {}
        
        # Show top datasets
        logger.info(f"\n📊 Top {min(top_n, len(datasets))} Healthcare Datasets:")
        for i, dataset in enumerate(datasets[:top_n]):
            logger.info(f"{i+1}. {dataset['name']} ({dataset['id']})")
            logger.info(f"   Downloads: {dataset['downloads']}, Likes: {dataset['likes']}")
            logger.info(f"   Description: {dataset['description'][:100]}...")
        
        # Download top datasets
        downloaded_datasets = {}
        
        for i, dataset in enumerate(datasets[:top_n]):
            dataset_id = dataset['id']
            dataset_name = dataset['name'].replace('/', '_').replace('-', '_')
            
            logger.info(f"\n📥 Downloading dataset {i+1}/{top_n}: {dataset_name}")
            
            dataframes = self.download_dataset(dataset_id, dataset_name)
            
            if dataframes:
                downloaded_datasets[dataset_name] = {
                    'dataframes': dataframes,
                    'metadata': dataset,
                    'analysis': {}
                }
                
                # Analyze each split
                for split_name, df in dataframes.items():
                    analysis = self.analyze_dataset_structure(df, f"{dataset_name}_{split_name}")
                    downloaded_datasets[dataset_name]['analysis'][split_name] = analysis
                
                logger.info(f"✅ Successfully downloaded {dataset_name}")
            else:
                logger.warning(f"❌ Failed to download {dataset_name}")
        
        return downloaded_datasets
    
    def generate_summary_report(self, downloaded_datasets):
        """
        Generate a summary report of the downloaded data
        """
        report = {
            'download_date': datetime.now().isoformat(),
            'total_datasets': len(downloaded_datasets),
            'datasets': {}
        }
        
        for dataset_name, info in downloaded_datasets.items():
            metadata = info['metadata']
            analysis = info['analysis']
            
            dataset_summary = {
                'name': metadata['name'],
                'id': metadata['id'],
                'description': metadata['description'],
                'downloads': metadata['downloads'],
                'likes': metadata['likes'],
                'splits': {}
            }
            
            for split_name, split_analysis in analysis.items():
                dataset_summary['splits'][split_name] = {
                    'record_count': split_analysis['total_records'],
                    'columns': split_analysis['columns'],
                    'missing_data': split_analysis['missing_data'],
                    'data_types': split_analysis['data_types'],
                    'sample_data': split_analysis['sample_data']
                }
            
            report['datasets'][dataset_name] = dataset_summary
        
        # Save report
        report_filepath = f"{self.output_dir}/huggingface_search_summary.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Summary report saved: {report_filepath}")
        return report

def main():
    """
    Main function to search and download healthcare datasets
    """
    print("🏥 Healthcare Dataset Searcher (HuggingFace)")
    print("=" * 60)
    
    # Initialize searcher
    searcher = HuggingFaceDatasetSearcher()
    
    try:
        # Download top datasets
        downloaded_datasets = searcher.download_top_datasets(top_n=3)
        
        if downloaded_datasets:
            # Generate summary report
            report = searcher.generate_summary_report(downloaded_datasets)
            
            print(f"\n✅ Successfully downloaded {len(downloaded_datasets)} datasets!")
            print(f"📁 Data saved in: {searcher.output_dir}")
            
            # Print summary
            for dataset_name, info in downloaded_datasets.items():
                total_records = sum(len(df) for df in info['dataframes'].values())
                print(f"   📊 {dataset_name}: {total_records} total records")
        
        else:
            print("❌ No datasets were downloaded.")
    
    except Exception as e:
        print(f"❌ Error during search/download: {e}")

if __name__ == "__main__":
    main() 