#!/usr/bin/env python3
"""
Download Indian healthcare datasets from HuggingFace
Using HuggingFace datasets library to get AI-ready Indian healthcare data
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

class HuggingFaceIndianDataDownloader:
    """
    Download Indian healthcare datasets from HuggingFace
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
        
        # Indian healthcare datasets available on HuggingFace
        self.datasets = {
            "nidaankosh": {
                "name": "NidaanKosh - Indian Lab Reports",
                "dataset_id": "ekacare/nidaankosh",
                "description": "6.8M+ lab readings from 100,000 Indian subjects",
                "type": "lab_reports"
            },
            "spandan": {
                "name": "Spandan - Cardiovascular Monitoring",
                "dataset_id": "ekacare/spandan", 
                "description": "1M+ PPG signals for cardiovascular monitoring",
                "type": "vital_signs"
            },
            "indian_healthcare": {
                "name": "Indian Healthcare Dataset",
                "dataset_id": "mstz/healthcare",
                "description": "General healthcare data with Indian context",
                "type": "general"
            },
            "hospital_wait_times": {
                "name": "Hospital Wait Times",
                "dataset_id": "healthcare/wait_times",
                "description": "Hospital wait time data",
                "type": "wait_times"
            }
        }
    
    def search_indian_healthcare_datasets(self):
        """
        Search for Indian healthcare datasets on HuggingFace
        """
        logger.info("🔍 Searching for Indian healthcare datasets on HuggingFace...")
        
        try:
            # Search for Indian healthcare datasets
            search_results = self.api.list_datasets(
                search="india healthcare",
                limit=20
            )
            
            found_datasets = []
            for dataset in search_results:
                if dataset.id not in [d['dataset_id'] for d in self.datasets.values()]:
                    found_datasets.append({
                        'id': dataset.id,
                        'name': dataset.dataset_name,
                        'description': dataset.description or 'No description available'
                    })
            
            logger.info(f"Found {len(found_datasets)} additional Indian healthcare datasets")
            return found_datasets
            
        except Exception as e:
            logger.error(f"Error searching HuggingFace datasets: {e}")
            return []
    
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
            for split_name, split_data in dataset.items():
                df = split_data.to_pandas()
                dataframes[split_name] = df
                
                # Save raw data
                filepath = f"{self.output_dir}/raw/{dataset_name}_{split_name}.csv"
                df.to_csv(filepath, index=False)
                logger.info(f"Saved {len(df)} records to {filepath}")
            
            return dataframes
            
        except Exception as e:
            logger.error(f"Error downloading dataset {dataset_id}: {e}")
            return None
    
    def process_nidaankosh_data(self, df):
        """
        Process NidaanKosh lab report data
        """
        if df.empty:
            return df
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Add lab test categories
        if 'test_name' in df.columns:
            df['test_category'] = self.categorize_lab_tests(df['test_name'])
        
        # Add normal range indicators
        if 'result' in df.columns and 'normal_range' in df.columns:
            df['is_normal'] = self.check_normal_range(df['result'], df['normal_range'])
        
        # Add age groups
        if 'age' in df.columns:
            df['age_group'] = pd.cut(df['age'], 
                                   bins=[0, 18, 35, 50, 65, 100], 
                                   labels=['child', 'young_adult', 'adult', 'middle_age', 'elderly'])
        
        return df
    
    def process_spandan_data(self, df):
        """
        Process Spandan cardiovascular data
        """
        if df.empty:
            return df
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Add cardiovascular risk indicators
        if 'heart_rate' in df.columns:
            df['hr_category'] = self.categorize_heart_rate(df['heart_rate'])
        
        if 'blood_pressure' in df.columns:
            df['bp_category'] = self.categorize_blood_pressure(df['blood_pressure'])
        
        # Add time-based features
        if 'timestamp' in df.columns:
            df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
            df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        
        return df
    
    def process_wait_time_data(self, df):
        """
        Process wait time data
        """
        if df.empty:
            return df
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Convert wait times to minutes
        if 'wait_time' in df.columns:
            df['wait_time_minutes'] = self.convert_wait_time_to_minutes(df['wait_time'])
        
        # Add time-based features
        if 'timestamp' in df.columns:
            df['hour_of_day'] = pd.to_datetime(df['timestamp']).dt.hour
            df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        
        # Add regional features for Indian context
        if 'location' in df.columns:
            df['region'] = self.map_location_to_region(df['location'])
            df['rural_urban'] = self.classify_rural_urban(df['location'])
        
        return df
    
    def categorize_lab_tests(self, test_names):
        """
        Categorize lab tests into groups
        """
        def categorize_single_test(test_name):
            if pd.isna(test_name):
                return 'unknown'
            
            test_lower = str(test_name).lower()
            
            if any(word in test_lower for word in ['glucose', 'sugar', 'diabetes']):
                return 'diabetes'
            elif any(word in test_lower for word in ['cholesterol', 'lipid']):
                return 'cardiac'
            elif any(word in test_lower for word in ['hemoglobin', 'hb', 'blood']):
                return 'hematology'
            elif any(word in test_lower for word in ['creatinine', 'urea', 'kidney']):
                return 'renal'
            elif any(word in test_lower for word in ['liver', 'bilirubin', 'alt', 'ast']):
                return 'liver'
            elif any(word in test_lower for word in ['thyroid', 'tsh', 't3', 't4']):
                return 'endocrine'
            else:
                return 'other'
        
        return test_names.apply(categorize_single_test)
    
    def check_normal_range(self, result, normal_range):
        """
        Check if lab result is within normal range
        """
        def check_single_result(res, norm):
            if pd.isna(res) or pd.isna(norm):
                return 'unknown'
            
            try:
                res_val = float(str(res))
                norm_str = str(norm)
                
                # Parse normal range (e.g., "70-100", "<140", ">90")
                if '-' in norm_str:
                    low, high = map(float, norm_str.split('-'))
                    return 'normal' if low <= res_val <= high else 'abnormal'
                elif norm_str.startswith('<'):
                    threshold = float(norm_str[1:])
                    return 'normal' if res_val < threshold else 'abnormal'
                elif norm_str.startswith('>'):
                    threshold = float(norm_str[1:])
                    return 'normal' if res_val > threshold else 'abnormal'
                else:
                    return 'unknown'
            except:
                return 'unknown'
        
        return pd.Series([check_single_result(r, n) for r, n in zip(result, normal_range)])
    
    def categorize_heart_rate(self, heart_rates):
        """
        Categorize heart rates
        """
        def categorize_single_hr(hr):
            if pd.isna(hr):
                return 'unknown'
            
            try:
                hr_val = float(hr)
                if hr_val < 60:
                    return 'bradycardia'
                elif hr_val <= 100:
                    return 'normal'
                else:
                    return 'tachycardia'
            except:
                return 'unknown'
        
        return heart_rates.apply(categorize_single_hr)
    
    def categorize_blood_pressure(self, blood_pressures):
        """
        Categorize blood pressure readings
        """
        def categorize_single_bp(bp):
            if pd.isna(bp):
                return 'unknown'
            
            try:
                # Assuming format like "120/80"
                systolic, diastolic = map(int, str(bp).split('/'))
                
                if systolic < 120 and diastolic < 80:
                    return 'normal'
                elif systolic < 130 and diastolic < 80:
                    return 'elevated'
                elif systolic < 140 and diastolic < 90:
                    return 'stage1_hypertension'
                else:
                    return 'stage2_hypertension'
            except:
                return 'unknown'
        
        return blood_pressures.apply(categorize_single_bp)
    
    def convert_wait_time_to_minutes(self, wait_time_series):
        """
        Convert various wait time formats to minutes
        """
        def convert_single_time(wait_time):
            if pd.isna(wait_time):
                return 30  # Default 30 minutes
            
            wait_str = str(wait_time).lower()
            
            # Handle different formats
            if 'hour' in wait_str or 'hr' in wait_str:
                import re
                hours = re.findall(r'(\d+)', wait_str)
                if hours:
                    return int(hours[0]) * 60
            
            elif 'min' in wait_str or 'minute' in wait_str:
                import re
                minutes = re.findall(r'(\d+)', wait_str)
                if minutes:
                    return int(minutes[0])
            
            else:
                try:
                    return int(float(wait_str))
                except:
                    return 30  # Default
            
            return 30  # Default
        
        return wait_time_series.apply(convert_single_time)
    
    def map_location_to_region(self, locations):
        """
        Map Indian locations to regions
        """
        region_mapping = {
            'north': ['delhi', 'haryana', 'punjab', 'rajasthan', 'uttar pradesh', 'uttarakhand'],
            'south': ['andhra pradesh', 'karnataka', 'kerala', 'tamil nadu', 'telangana'],
            'east': ['bihar', 'jharkhand', 'odisha', 'west bengal'],
            'west': ['gujarat', 'maharashtra', 'goa'],
            'central': ['chhattisgarh', 'madhya pradesh'],
            'northeast': ['assam', 'arunachal pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura']
        }
        
        def map_single_location(location):
            if pd.isna(location):
                return 'unknown'
            
            location_lower = str(location).lower()
            for region, states in region_mapping.items():
                if any(state in location_lower for state in states):
                    return region
            return 'other'
        
        return locations.apply(map_single_location)
    
    def classify_rural_urban(self, locations):
        """
        Classify locations as rural or urban
        """
        def classify_single_location(location):
            if pd.isna(location):
                return 'unknown'
            
            location_lower = str(location).lower()
            
            # Urban indicators
            urban_indicators = ['city', 'municipal', 'corporation', 'metro', 'urban']
            if any(indicator in location_lower for indicator in urban_indicators):
                return 'urban'
            
            # Rural indicators
            rural_indicators = ['village', 'rural', 'gram', 'panchayat']
            if any(indicator in location_lower for indicator in rural_indicators):
                return 'rural'
            
            return 'mixed'
        
        return locations.apply(classify_single_location)
    
    def download_all_datasets(self):
        """
        Download all available Indian healthcare datasets
        """
        logger.info("🏥 Starting Indian healthcare data download from HuggingFace...")
        
        downloaded_datasets = {}
        
        # First, search for additional datasets
        additional_datasets = self.search_indian_healthcare_datasets()
        logger.info(f"Found {len(additional_datasets)} additional datasets")
        
        # Download predefined datasets
        for dataset_key, config in self.datasets.items():
            try:
                dataframes = self.download_dataset(config['dataset_id'], dataset_key)
                
                if dataframes:
                    downloaded_datasets[dataset_key] = {
                        'dataframes': dataframes,
                        'config': config,
                        'record_count': sum(len(df) for df in dataframes.values())
                    }
                    logger.info(f"✅ Downloaded {dataset_key}: {downloaded_datasets[dataset_key]['record_count']} total records")
                else:
                    logger.warning(f"❌ Failed to download {dataset_key}")
                    
            except Exception as e:
                logger.error(f"❌ Error downloading {dataset_key}: {e}")
        
        return downloaded_datasets
    
    def process_downloaded_data(self, downloaded_datasets):
        """
        Process all downloaded datasets
        """
        logger.info("🔄 Processing downloaded datasets...")
        
        processed_data = {}
        
        for dataset_key, info in downloaded_datasets.items():
            dataframes = info['dataframes']
            config = info['config']
            
            processed_dataframes = {}
            
            for split_name, df in dataframes.items():
                try:
                    # Process based on dataset type
                    if config['type'] == 'lab_reports':
                        df_processed = self.process_nidaankosh_data(df)
                    elif config['type'] == 'vital_signs':
                        df_processed = self.process_spandan_data(df)
                    elif config['type'] == 'wait_times':
                        df_processed = self.process_wait_time_data(df)
                    else:
                        df_processed = df  # General processing
                    
                    # Save processed data
                    processed_filepath = f"{self.output_dir}/processed/{dataset_key}_{split_name}_processed.csv"
                    df_processed.to_csv(processed_filepath, index=False)
                    
                    processed_dataframes[split_name] = {
                        'data': df_processed,
                        'filepath': processed_filepath,
                        'record_count': len(df_processed)
                    }
                    
                    logger.info(f"✅ Processed {dataset_key}_{split_name}: {len(df_processed)} records")
                    
                except Exception as e:
                    logger.error(f"❌ Error processing {dataset_key}_{split_name}: {e}")
            
            processed_data[dataset_key] = {
                'dataframes': processed_dataframes,
                'config': config,
                'total_records': sum(info['record_count'] for info in processed_dataframes.values())
            }
        
        return processed_data
    
    def generate_summary_report(self, processed_data):
        """
        Generate a summary report of the downloaded data
        """
        report = {
            'download_date': datetime.now().isoformat(),
            'total_datasets': len(processed_data),
            'datasets': {}
        }
        
        for dataset_key, info in processed_data.items():
            config = info['config']
            dataframes = info['dataframes']
            
            dataset_summary = {
                'name': config['name'],
                'type': config['type'],
                'description': config['description'],
                'total_records': info['total_records'],
                'splits': {}
            }
            
            for split_name, split_info in dataframes.items():
                df = split_info['data']
                
                split_summary = {
                    'record_count': len(df),
                    'columns': list(df.columns),
                    'missing_data': df.isnull().sum().to_dict(),
                    'data_types': df.dtypes.to_dict()
                }
                
                # Add specific summaries based on dataset type
                if config['type'] == 'lab_reports':
                    if 'test_category' in df.columns:
                        split_summary['test_categories'] = df['test_category'].value_counts().to_dict()
                    if 'is_normal' in df.columns:
                        split_summary['normal_abnormal_ratio'] = df['is_normal'].value_counts().to_dict()
                
                elif config['type'] == 'vital_signs':
                    if 'hr_category' in df.columns:
                        split_summary['heart_rate_categories'] = df['hr_category'].value_counts().to_dict()
                    if 'bp_category' in df.columns:
                        split_summary['blood_pressure_categories'] = df['bp_category'].value_counts().to_dict()
                
                elif config['type'] == 'wait_times':
                    if 'wait_time_minutes' in df.columns:
                        split_summary['avg_wait_time'] = df['wait_time_minutes'].mean()
                        split_summary['max_wait_time'] = df['wait_time_minutes'].max()
                
                dataset_summary['splits'][split_name] = split_summary
            
            report['datasets'][dataset_key] = dataset_summary
        
        # Save report
        report_filepath = f"{self.output_dir}/huggingface_summary.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Summary report saved: {report_filepath}")
        return report

def main():
    """
    Main function to download and process Indian healthcare data from HuggingFace
    """
    print("🏥 Indian Healthcare Data Downloader (HuggingFace)")
    print("=" * 60)
    
    # Initialize downloader
    downloader = HuggingFaceIndianDataDownloader()
    
    try:
        # Download datasets
        downloaded_datasets = downloader.download_all_datasets()
        
        if downloaded_datasets:
            # Process downloaded data
            processed_data = downloader.process_downloaded_data(downloaded_datasets)
            
            # Generate summary report
            report = downloader.generate_summary_report(processed_data)
            
            print(f"\n✅ Successfully downloaded and processed {len(processed_data)} datasets!")
            print(f"📁 Data saved in: {downloader.output_dir}")
            
            # Print summary
            for dataset_key, info in processed_data.items():
                print(f"   📊 {dataset_key}: {info['total_records']} total records")
        
        else:
            print("❌ No datasets were downloaded. Check HuggingFace API access.")
    
    except Exception as e:
        print(f"❌ Error during download: {e}")
        print("💡 Make sure you have HuggingFace API access configured")

if __name__ == "__main__":
    main() 