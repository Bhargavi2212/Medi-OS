#!/usr/bin/env python3
"""
Download and process Indian healthcare data from OGD Platform
Open Government Data (OGD) Platform India: https://data.gov.in/keywords/healthcare
"""

import requests
import pandas as pd
import json
import os
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OGDIndianDataDownloader:
    """
    Download Indian healthcare data from OGD Platform
    """
    
    def __init__(self, output_dir="data/indian_healthcare"):
        self.output_dir = output_dir
        self.base_url = "https://data.gov.in"
        self.api_url = "https://data.gov.in/api/v1"
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/raw", exist_ok=True)
        os.makedirs(f"{output_dir}/processed", exist_ok=True)
        
        # Indian healthcare datasets to download
        self.datasets = {
            "hospital_infrastructure": {
                "name": "Hospital Infrastructure Data",
                "keywords": ["hospital", "infrastructure", "facility"],
                "expected_columns": ["state", "district", "hospital_name", "hospital_type", "bed_count"]
            },
            "health_statistics": {
                "name": "Health Statistics Data", 
                "keywords": ["health", "statistics", "indicators"],
                "expected_columns": ["state", "district", "indicator", "value", "year"]
            },
            "disease_patterns": {
                "name": "Disease Pattern Data",
                "keywords": ["disease", "pattern", "incidence"],
                "expected_columns": ["state", "district", "disease", "cases", "year"]
            },
            "wait_times": {
                "name": "Wait Time Data",
                "keywords": ["wait", "time", "queue", "patient"],
                "expected_columns": ["facility", "department", "wait_time", "patient_count"]
            }
        }
    
    def search_ogd_datasets(self, keywords):
        """
        Search for datasets on OGD platform
        """
        try:
            # Search API endpoint
            search_url = f"{self.api_url}/search"
            params = {
                "keyword": " ".join(keywords),
                "format": "json",
                "limit": 50
            }
            
            response = requests.get(search_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return data.get("data", [])
            
        except Exception as e:
            logger.error(f"Error searching OGD datasets: {e}")
            return []
    
    def download_dataset(self, dataset_id, filename):
        """
        Download a specific dataset from OGD
        """
        try:
            # Download API endpoint
            download_url = f"{self.api_url}/resource/{dataset_id}"
            
            response = requests.get(download_url, timeout=30)
            response.raise_for_status()
            
            # Save raw data
            filepath = f"{self.output_dir}/raw/{filename}"
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"Downloaded: {filename}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error downloading dataset {dataset_id}: {e}")
            return None
    
    def process_hospital_data(self, df):
        """
        Process hospital infrastructure data
        """
        if df.empty:
            return df
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Clean state and district names
        if 'state' in df.columns:
            df['state'] = df['state'].str.strip().str.title()
        if 'district' in df.columns:
            df['district'] = df['district'].str.strip().str.title()
        
        # Add regional features
        df['region'] = self.map_state_to_region(df.get('state', ''))
        df['rural_urban'] = self.classify_rural_urban(df.get('district', ''))
        
        # Calculate infrastructure metrics
        if 'bed_count' in df.columns:
            df['bed_density'] = df['bed_count'] / df.groupby('state')['bed_count'].transform('sum')
        
        return df
    
    def process_health_statistics(self, df):
        """
        Process health statistics data
        """
        if df.empty:
            return df
        
        # Standardize column names
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Clean state and district names
        if 'state' in df.columns:
            df['state'] = df['state'].str.strip().str.title()
        if 'district' in df.columns:
            df['district'] = df['district'].str.strip().str.title()
        
        # Add time features
        if 'year' in df.columns:
            df['year'] = pd.to_numeric(df['year'], errors='coerce')
        
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
        df['hour_of_day'] = pd.to_datetime(df.get('timestamp', pd.Timestamp.now())).dt.hour
        df['day_of_week'] = pd.to_datetime(df.get('timestamp', pd.Timestamp.now())).dt.dayofweek
        
        return df
    
    def map_state_to_region(self, state):
        """
        Map Indian states to regions
        """
        region_mapping = {
            'north': ['delhi', 'haryana', 'punjab', 'rajasthan', 'uttar pradesh', 'uttarakhand'],
            'south': ['andhra pradesh', 'karnataka', 'kerala', 'tamil nadu', 'telangana'],
            'east': ['bihar', 'jharkhand', 'odisha', 'west bengal'],
            'west': ['gujarat', 'maharashtra', 'goa'],
            'central': ['chhattisgarh', 'madhya pradesh'],
            'northeast': ['assam', 'arunachal pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura']
        }
        
        state_lower = state.lower() if isinstance(state, str) else ''
        for region, states in region_mapping.items():
            if state_lower in states:
                return region
        return 'other'
    
    def classify_rural_urban(self, district):
        """
        Classify districts as rural or urban based on name patterns
        """
        if not isinstance(district, str):
            return 'unknown'
        
        district_lower = district.lower()
        
        # Urban indicators
        urban_indicators = ['city', 'municipal', 'corporation', 'metro']
        if any(indicator in district_lower for indicator in urban_indicators):
            return 'urban'
        
        # Rural indicators
        rural_indicators = ['village', 'rural', 'gram']
        if any(indicator in district_lower for indicator in rural_indicators):
            return 'rural'
        
        return 'mixed'
    
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
                # Extract hours and convert to minutes
                import re
                hours = re.findall(r'(\d+)', wait_str)
                if hours:
                    return int(hours[0]) * 60
            
            elif 'min' in wait_str or 'minute' in wait_str:
                # Extract minutes
                import re
                minutes = re.findall(r'(\d+)', wait_str)
                if minutes:
                    return int(minutes[0])
            
            else:
                # Try to convert directly to number
                try:
                    return int(float(wait_str))
                except:
                    return 30  # Default
            
            return 30  # Default
        
        return wait_time_series.apply(convert_single_time)
    
    def download_all_datasets(self):
        """
        Download all Indian healthcare datasets
        """
        logger.info("🏥 Starting Indian healthcare data download from OGD Platform...")
        
        downloaded_datasets = {}
        
        for dataset_type, config in self.datasets.items():
            logger.info(f"📊 Searching for {config['name']}...")
            
            # Search for datasets
            datasets = self.search_ogd_datasets(config['keywords'])
            
            if datasets:
                logger.info(f"Found {len(datasets)} datasets for {dataset_type}")
                
                # Download the first relevant dataset
                for dataset in datasets:
                    dataset_id = dataset.get('id')
                    if dataset_id:
                        filename = f"{dataset_type}_{dataset_id}.csv"
                        filepath = self.download_dataset(dataset_id, filename)
                        
                        if filepath:
                            downloaded_datasets[dataset_type] = {
                                'filepath': filepath,
                                'metadata': dataset
                            }
                            break
            else:
                logger.warning(f"No datasets found for {dataset_type}")
        
        return downloaded_datasets
    
    def process_downloaded_data(self, downloaded_datasets):
        """
        Process all downloaded datasets
        """
        logger.info("🔄 Processing downloaded datasets...")
        
        processed_data = {}
        
        for dataset_type, info in downloaded_datasets.items():
            filepath = info['filepath']
            
            try:
                # Read the data
                df = pd.read_csv(filepath)
                logger.info(f"Loaded {len(df)} records from {dataset_type}")
                
                # Process based on dataset type
                if dataset_type == "hospital_infrastructure":
                    df_processed = self.process_hospital_data(df)
                elif dataset_type == "health_statistics":
                    df_processed = self.process_health_statistics(df)
                elif dataset_type == "wait_times":
                    df_processed = self.process_wait_time_data(df)
                else:
                    df_processed = df
                
                # Save processed data
                processed_filepath = f"{self.output_dir}/processed/{dataset_type}_processed.csv"
                df_processed.to_csv(processed_filepath, index=False)
                
                processed_data[dataset_type] = {
                    'data': df_processed,
                    'filepath': processed_filepath,
                    'record_count': len(df_processed)
                }
                
                logger.info(f"✅ Processed {dataset_type}: {len(df_processed)} records")
                
            except Exception as e:
                logger.error(f"❌ Error processing {dataset_type}: {e}")
        
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
        
        for dataset_type, info in processed_data.items():
            df = info['data']
            
            dataset_summary = {
                'record_count': len(df),
                'columns': list(df.columns),
                'missing_data': df.isnull().sum().to_dict(),
                'data_types': df.dtypes.to_dict()
            }
            
            # Add specific summaries based on dataset type
            if dataset_type == "hospital_infrastructure":
                if 'state' in df.columns:
                    dataset_summary['states_covered'] = df['state'].nunique()
                if 'hospital_type' in df.columns:
                    dataset_summary['hospital_types'] = df['hospital_type'].value_counts().to_dict()
            
            elif dataset_type == "wait_times":
                if 'wait_time_minutes' in df.columns:
                    dataset_summary['avg_wait_time'] = df['wait_time_minutes'].mean()
                    dataset_summary['max_wait_time'] = df['wait_time_minutes'].max()
            
            report['datasets'][dataset_type] = dataset_summary
        
        # Save report
        report_filepath = f"{self.output_dir}/download_summary.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Summary report saved: {report_filepath}")
        return report

def main():
    """
    Main function to download and process Indian healthcare data
    """
    print("🏥 Indian Healthcare Data Downloader")
    print("=" * 50)
    
    # Initialize downloader
    downloader = OGDIndianDataDownloader()
    
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
            for dataset_type, info in processed_data.items():
                print(f"   📊 {dataset_type}: {info['record_count']} records")
        
        else:
            print("❌ No datasets were downloaded. Check internet connection and OGD platform availability.")
    
    except Exception as e:
        print(f"❌ Error during download: {e}")
        print("💡 Alternative: Use manual data collection or web scraping")

if __name__ == "__main__":
    main() 