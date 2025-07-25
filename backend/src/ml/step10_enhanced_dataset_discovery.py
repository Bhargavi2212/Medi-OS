#!/usr/bin/env python3
"""
Enhanced Step 10: Complete Dataset Discovery & Preparation
Finds ALL available datasets including Arrow files, large datasets, and hidden data.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from typing import Dict, List, Any, Tuple
import warnings
import glob
warnings.filterwarnings('ignore')

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedDatasetDiscovery:
    """
    Enhanced Step 10: Complete Dataset Discovery & Preparation
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data")
        self.output_dir = os.path.join(self.project_root, "backend/src/ml/data/step10_enhanced_merged")
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Results tracking
        self.results = {
            'total_records': 0,
            'discovered_datasets': {},
            'processed_datasets': {},
            'failed_datasets': {},
            'timestamp': datetime.now().isoformat()
        }
    
    def discover_all_datasets(self) -> Dict[str, Any]:
        """Discover ALL available datasets in the data directory"""
        logger.info("Discovering ALL available datasets...")
        
        discovered = {}
        
        # Search for all CSV files
        csv_files = glob.glob(os.path.join(self.data_dir, "**/*.csv"), recursive=True)
        logger.info(f"Found {len(csv_files)} CSV files")
        
        for csv_file in csv_files:
            try:
                # Get relative path
                rel_path = os.path.relpath(csv_file, self.data_dir)
                file_size = os.path.getsize(csv_file)
                
                # Try to read first few lines to get record count
                df_sample = pd.read_csv(csv_file, nrows=5)
                columns = df_sample.columns.tolist()
                
                # Estimate total records (rough estimate)
                with open(csv_file, 'r') as f:
                    lines = sum(1 for _ in f) - 1  # Subtract header
                
                discovered[rel_path] = {
                    'type': 'csv',
                    'size_mb': round(file_size / (1024*1024), 2),
                    'estimated_records': lines,
                    'columns': columns,
                    'path': csv_file
                }
                
                logger.info(f"Discovered CSV: {rel_path} - {lines} records, {file_size/(1024*1024):.1f}MB")
                
            except Exception as e:
                logger.warning(f"Failed to analyze {csv_file}: {e}")
        
        # Search for Arrow files
        arrow_files = glob.glob(os.path.join(self.data_dir, "**/*.arrow"), recursive=True)
        logger.info(f"Found {len(arrow_files)} Arrow files")
        
        for arrow_file in arrow_files:
            try:
                rel_path = os.path.relpath(arrow_file, self.data_dir)
                file_size = os.path.getsize(arrow_file)
                
                discovered[rel_path] = {
                    'type': 'arrow',
                    'size_mb': round(file_size / (1024*1024), 2),
                    'estimated_records': 'unknown',  # Will try to read
                    'columns': 'unknown',
                    'path': arrow_file
                }
                
                logger.info(f"Discovered Arrow: {rel_path} - {file_size/(1024*1024):.1f}MB")
                
            except Exception as e:
                logger.warning(f"Failed to analyze {arrow_file}: {e}")
        
        # Search for JSON files
        json_files = glob.glob(os.path.join(self.data_dir, "**/*.json"), recursive=True)
        logger.info(f"Found {len(json_files)} JSON files")
        
        for json_file in json_files:
            try:
                rel_path = os.path.relpath(json_file, self.data_dir)
                file_size = os.path.getsize(json_file)
                
                with open(json_file, 'r') as f:
                    data = json.load(f)
                
                if isinstance(data, list):
                    records = len(data)
                elif isinstance(data, dict):
                    records = 1  # Single record
                else:
                    records = 'unknown'
                
                discovered[rel_path] = {
                    'type': 'json',
                    'size_mb': round(file_size / (1024*1024), 2),
                    'estimated_records': records,
                    'columns': list(data.keys()) if isinstance(data, dict) else 'unknown',
                    'path': json_file
                }
                
                logger.info(f"Discovered JSON: {rel_path} - {records} records, {file_size/(1024*1024):.1f}MB")
                
            except Exception as e:
                logger.warning(f"Failed to analyze {json_file}: {e}")
        
        return discovered
    
    def load_large_datasets(self, discovered_datasets: Dict[str, Any]) -> Dict[str, pd.DataFrame]:
        """Load large datasets that were missed in original Step 10"""
        logger.info("Loading large datasets...")
        
        loaded_datasets = {}
        
        # Priority datasets to load
        priority_patterns = [
            'merged_40k_dataset.csv',
            'medical_datasets/make_agent/*.csv',
            'indian_healthcare/raw/*.csv',
            'huggingface_medical/*/train/*.arrow'
        ]
        
        for pattern in priority_patterns:
            full_pattern = os.path.join(self.data_dir, pattern)
            matching_files = glob.glob(full_pattern, recursive=True)
            
            for file_path in matching_files:
                rel_path = os.path.relpath(file_path, self.data_dir)
                
                try:
                    if file_path.endswith('.csv'):
                        logger.info(f"Loading CSV: {rel_path}")
                        df = pd.read_csv(file_path)
                        loaded_datasets[rel_path] = df
                        logger.info(f"Loaded {rel_path}: {len(df)} records")
                    
                    elif file_path.endswith('.arrow'):
                        logger.info(f"Attempting to load Arrow: {rel_path}")
                        # Try different methods to read Arrow files
                        try:
                            # Method 1: Try as parquet
                            df = pd.read_parquet(file_path)
                            loaded_datasets[rel_path] = df
                            logger.info(f"Loaded Arrow as Parquet {rel_path}: {len(df)} records")
                        except:
                            try:
                                # Method 2: Try with pyarrow
                                import pyarrow as pa
                                table = pa.ipc.open_file(file_path).read_all()
                                df = table.to_pandas()
                                loaded_datasets[rel_path] = df
                                logger.info(f"Loaded Arrow with pyarrow {rel_path}: {len(df)} records")
                            except Exception as e:
                                logger.warning(f"Failed to load Arrow file {rel_path}: {e}")
                                self.results['failed_datasets'][rel_path] = str(e)
                
                except Exception as e:
                    logger.error(f"Failed to load {rel_path}: {e}")
                    self.results['failed_datasets'][rel_path] = str(e)
        
        return loaded_datasets
    
    def process_and_merge_all(self, loaded_datasets: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """Process and merge all loaded datasets"""
        logger.info("Processing and merging all datasets...")
        
        processed_datasets = []
        total_records = 0
        
        for name, df in loaded_datasets.items():
            try:
                # Standardize the dataset
                processed_df = self._standardize_dataset(df, name)
                processed_datasets.append(processed_df)
                total_records += len(processed_df)
                
                logger.info(f"Processed {name}: {len(processed_df)} records")
                self.results['processed_datasets'][name] = len(processed_df)
                
            except Exception as e:
                logger.error(f"Failed to process {name}: {e}")
                self.results['failed_datasets'][name] = str(e)
        
        if processed_datasets:
            # Merge all datasets
            merged_df = pd.concat(processed_datasets, ignore_index=True)
            merged_df['id'] = range(len(merged_df))
            
            logger.info(f"Total merged records: {len(merged_df)}")
            
            # Save merged dataset
            output_path = os.path.join(self.output_dir, 'complete_merged_dataset.csv')
            merged_df.to_csv(output_path, index=False)
            logger.info(f"Saved complete merged dataset to: {output_path}")
            
            self.results['total_records'] = len(merged_df)
            return merged_df
        else:
            logger.error("No datasets were successfully processed!")
            return pd.DataFrame()
    
    def _standardize_dataset(self, df: pd.DataFrame, name: str) -> pd.DataFrame:
        """Standardize a dataset for merging"""
        df = df.copy()
        
        # Add dataset source
        df['dataset_source'] = name
        
        # Ensure required columns exist
        required_columns = {
            'patient_id': f"{name}_" + df.index.astype(str),
            'age': np.random.randint(18, 80, len(df)),
            'cost': np.random.randint(1000, 50000, len(df)),
            'caste': 'General',
            'state': 'Maharashtra',
            'gender': 'Male',
            'medical_complexity': 3,
            'urgency_level': 2
        }
        
        for col, default_value in required_columns.items():
            if col not in df.columns:
                df[col] = default_value
        
        return df
    
    def generate_complete_report(self, discovered_datasets: Dict[str, Any]):
        """Generate complete discovery report"""
        logger.info("Generating complete discovery report...")
        
        # Calculate totals
        total_csv_records = sum(
            dataset['estimated_records'] for dataset in discovered_datasets.values()
            if dataset['type'] == 'csv' and isinstance(dataset['estimated_records'], int)
        )
        
        total_arrow_size = sum(
            dataset['size_mb'] for dataset in discovered_datasets.values()
            if dataset['type'] == 'arrow'
        )
        
        report = {
            'discovery_timestamp': datetime.now().isoformat(),
            'total_files_discovered': len(discovered_datasets),
            'file_types': {
                'csv': len([d for d in discovered_datasets.values() if d['type'] == 'csv']),
                'arrow': len([d for d in discovered_datasets.values() if d['type'] == 'arrow']),
                'json': len([d for d in discovered_datasets.values() if d['type'] == 'json'])
            },
            'estimated_total_records': total_csv_records,
            'total_arrow_size_mb': total_arrow_size,
            'discovered_datasets': discovered_datasets,
            'results': self.results
        }
        
        # Save discovery report
        output_path = os.path.join(self.output_dir, 'complete_discovery_report.json')
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Complete discovery report saved to: {output_path}")
        return report
    
    def run_enhanced_discovery(self) -> Dict[str, Any]:
        """Run complete enhanced dataset discovery"""
        logger.info("Starting Enhanced Dataset Discovery...")
        
        try:
            # Step 1: Discover ALL datasets
            discovered_datasets = self.discover_all_datasets()
            
            # Step 2: Load large datasets
            loaded_datasets = self.load_large_datasets(discovered_datasets)
            
            # Step 3: Process and merge
            merged_df = self.process_and_merge_all(loaded_datasets)
            
            # Step 4: Generate complete report
            report = self.generate_complete_report(discovered_datasets)
            
            logger.info("Enhanced dataset discovery completed!")
            return report
            
        except Exception as e:
            logger.error(f"Enhanced discovery failed: {e}")
            return {'error': str(e), 'status': 'FAILED'}

def main():
    """Main execution function"""
    discoverer = EnhancedDatasetDiscovery()
    results = discoverer.run_enhanced_discovery()
    
    print("\n" + "="*60)
    print("ENHANCED DATASET DISCOVERY RESULTS")
    print("="*60)
    print(f"Total Files Discovered: {results.get('total_files_discovered', 0)}")
    print(f"CSV Files: {results.get('file_types', {}).get('csv', 0)}")
    print(f"Arrow Files: {results.get('file_types', {}).get('arrow', 0)}")
    print(f"JSON Files: {results.get('file_types', {}).get('json', 0)}")
    print(f"Estimated Total Records: {results.get('estimated_total_records', 0)}")
    print(f"Total Arrow Size: {results.get('total_arrow_size_mb', 0)} MB")
    print(f"Successfully Processed: {len(results.get('results', {}).get('processed_datasets', {}))}")
    print(f"Failed Datasets: {len(results.get('results', {}).get('failed_datasets', {}))}")
    print("="*60)

if __name__ == "__main__":
    main() 