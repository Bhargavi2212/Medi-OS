#!/usr/bin/env python3
"""
Data Assessment & Exploration for HealthOS
Analyze downloaded healthcare datasets and map to HealthOS entities
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HealthOSDataAssessment:
    """
    Comprehensive data assessment for HealthOS real healthcare data
    """
    
    def __init__(self, data_dir="data/indian_healthcare"):
        self.data_dir = data_dir
        self.raw_dir = f"{data_dir}/raw"
        self.assessment_dir = f"{data_dir}/assessment"
        
        # Create assessment directory
        os.makedirs(self.assessment_dir, exist_ok=True)
        
        # HealthOS entity mapping
        self.healthos_entities = {
            'Patient': ['patient_id', 'name', 'age', 'gender', 'location', 'medical_history'],
            'Appointment': ['appointment_id', 'patient_id', 'doctor_id', 'date', 'status', 'notes'],
            'Document': ['document_id', 'patient_id', 'type', 'content', 'date'],
            'Hospital': ['hospital_id', 'name', 'location', 'specialties'],
            'User': ['user_id', 'name', 'role', 'hospital_id', 'specialization']
        }
    
    def discover_datasets(self):
        """
        Discover all available datasets in the raw directory
        """
        logger.info("🔍 Discovering available datasets...")
        
        datasets = {}
        raw_path = Path(self.raw_dir)
        
        if raw_path.exists():
            for file_path in raw_path.glob("*.csv"):
                dataset_name = file_path.stem
                file_size = file_path.stat().st_size / (1024 * 1024)  # MB
                
                logger.info(f"Found dataset: {dataset_name} ({file_size:.2f} MB)")
                
                datasets[dataset_name] = {
                    'file_path': str(file_path),
                    'file_size_mb': file_size,
                    'type': self._classify_dataset(file_path.name)
                }
        
        logger.info(f"Discovered {len(datasets)} datasets")
        return datasets
    
    def _classify_dataset(self, filename):
        """
        Classify dataset type based on filename
        """
        filename_lower = filename.lower()
        
        if 'symptom' in filename_lower or 'diagnosis' in filename_lower:
            return 'diagnostic'
        elif 'mental' in filename_lower or 'counseling' in filename_lower:
            return 'mental_health'
        elif 'lab' in filename_lower or 'test' in filename_lower:
            return 'laboratory'
        elif 'vital' in filename_lower or 'ppg' in filename_lower:
            return 'vital_signs'
        elif 'dermatology' in filename_lower or 'skin' in filename_lower:
            return 'dermatology'
        else:
            return 'general'
    
    def analyze_dataset(self, dataset_name, file_path):
        """
        Comprehensive analysis of a single dataset
        """
        logger.info(f"📊 Analyzing dataset: {dataset_name}")
        
        try:
            # Load dataset
            df = pd.read_csv(file_path)
            
            analysis = {
                'dataset_name': dataset_name,
                'file_path': file_path,
                'total_records': len(df),
                'total_columns': len(df.columns),
                'columns': list(df.columns),
                'data_types': df.dtypes.to_dict(),
                'missing_data': df.isnull().sum().to_dict(),
                'missing_percentage': (df.isnull().sum() / len(df) * 100).to_dict(),
                'unique_values': {},
                'sample_data': {},
                'healthos_mapping': {},
                'data_quality_score': 0
            }
            
            # Analyze each column
            for col in df.columns:
                # Unique values analysis
                if df[col].dtype == 'object':
                    analysis['unique_values'][col] = {
                        'count': df[col].nunique(),
                        'top_values': df[col].value_counts().head(5).to_dict()
                    }
                else:
                    analysis['unique_values'][col] = {
                        'count': df[col].nunique(),
                        'min': df[col].min(),
                        'max': df[col].max(),
                        'mean': df[col].mean(),
                        'std': df[col].std()
                    }
                
                # Sample data
                if df[col].dtype == 'object':
                    analysis['sample_data'][col] = df[col].dropna().head(3).tolist()
                else:
                    analysis['sample_data'][col] = {
                        'min': df[col].min(),
                        'max': df[col].max(),
                        'mean': df[col].mean()
                    }
            
            # Map to HealthOS entities
            analysis['healthos_mapping'] = self._map_to_healthos_entities(df)
            
            # Calculate data quality score
            analysis['data_quality_score'] = self._calculate_data_quality_score(df)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing dataset {dataset_name}: {e}")
            return None
    
    def _map_to_healthos_entities(self, df):
        """
        Map dataset columns to HealthOS entities
        """
        mapping = {}
        
        for entity, expected_fields in self.healthos_entities.items():
            entity_mapping = {}
            
            for field in expected_fields:
                # Find matching columns
                matching_cols = []
                for col in df.columns:
                    col_lower = col.lower()
                    field_lower = field.lower()
                    
                    if field_lower in col_lower or col_lower in field_lower:
                        matching_cols.append(col)
                
                if matching_cols:
                    entity_mapping[field] = matching_cols
            
            if entity_mapping:
                mapping[entity] = entity_mapping
        
        return mapping
    
    def _calculate_data_quality_score(self, df):
        """
        Calculate overall data quality score (0-100)
        """
        score = 100
        
        # Penalize for missing data
        missing_percentage = (df.isnull().sum() / len(df) * 100).mean()
        score -= missing_percentage * 0.5
        
        # Penalize for duplicate rows
        duplicate_percentage = (len(df) - len(df.drop_duplicates())) / len(df) * 100
        score -= duplicate_percentage
        
        # Bonus for good data types
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            score += 5
        
        return max(0, min(100, score))
    
    def assess_all_datasets(self):
        """
        Assess all discovered datasets
        """
        logger.info("🏥 Starting comprehensive data assessment...")
        
        # Discover datasets
        datasets = self.discover_datasets()
        
        if not datasets:
            logger.warning("No datasets found for assessment")
            return {}
        
        # Analyze each dataset
        assessments = {}
        
        for dataset_name, dataset_info in datasets.items():
            analysis = self.analyze_dataset(dataset_name, dataset_info['file_path'])
            
            if analysis:
                assessments[dataset_name] = {
                    'analysis': analysis,
                    'metadata': dataset_info
                }
                logger.info(f"✅ Completed analysis for {dataset_name}")
            else:
                logger.warning(f"❌ Failed to analyze {dataset_name}")
        
        return assessments
    
    def generate_assessment_report(self, assessments):
        """
        Generate comprehensive assessment report
        """
        logger.info("📋 Generating assessment report...")
        
        report = {
            'assessment_date': datetime.now().isoformat(),
            'total_datasets': len(assessments),
            'datasets': {},
            'summary': {
                'total_records': 0,
                'total_columns': 0,
                'average_quality_score': 0,
                'entity_coverage': {}
            }
        }
        
        total_records = 0
        total_columns = 0
        quality_scores = []
        entity_coverage = {}
        
        for dataset_name, info in assessments.items():
            analysis = info['analysis']
            metadata = info['metadata']
            
            dataset_summary = {
                'name': dataset_name,
                'type': metadata['type'],
                'file_size_mb': metadata['file_size_mb'],
                'total_records': analysis['total_records'],
                'total_columns': analysis['total_columns'],
                'data_quality_score': analysis['data_quality_score'],
                'missing_data_percentage': analysis['missing_percentage'],
                'healthos_mapping': analysis['healthos_mapping'],
                'columns': analysis['columns'],
                'sample_data': analysis['sample_data']
            }
            
            report['datasets'][dataset_name] = dataset_summary
            
            # Update summary statistics
            total_records += analysis['total_records']
            total_columns += analysis['total_columns']
            quality_scores.append(analysis['data_quality_score'])
            
            # Track entity coverage
            for entity, mapping in analysis['healthos_mapping'].items():
                if entity not in entity_coverage:
                    entity_coverage[entity] = []
                entity_coverage[entity].append(dataset_name)
        
        # Calculate summary statistics
        report['summary']['total_records'] = total_records
        report['summary']['total_columns'] = total_columns
        report['summary']['average_quality_score'] = np.mean(quality_scores) if quality_scores else 0
        report['summary']['entity_coverage'] = entity_coverage
        
        # Save report
        report_filepath = f"{self.assessment_dir}/data_assessment_report.json"
        with open(report_filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Assessment report saved: {report_filepath}")
        return report
    
    def print_summary(self, report):
        """
        Print human-readable summary of assessment
        """
        print("\n" + "="*60)
        print("🏥 HealthOS Data Assessment Summary")
        print("="*60)
        
        print(f"📊 Total Datasets: {report['summary']['total_datasets']}")
        print(f"📊 Total Records: {report['summary']['total_records']:,}")
        print(f"📊 Total Columns: {report['summary']['total_columns']}")
        print(f"📊 Average Quality Score: {report['summary']['average_quality_score']:.1f}/100")
        
        print("\n📋 Dataset Details:")
        for dataset_name, info in report['datasets'].items():
            print(f"   • {dataset_name}")
            print(f"     - Type: {info['type']}")
            print(f"     - Records: {info['total_records']:,}")
            print(f"     - Quality Score: {info['data_quality_score']:.1f}/100")
            print(f"     - Size: {info['file_size_mb']:.2f} MB")
        
        print("\n🏥 HealthOS Entity Coverage:")
        for entity, datasets in report['summary']['entity_coverage'].items():
            print(f"   • {entity}: {len(datasets)} datasets")
            for dataset in datasets:
                print(f"     - {dataset}")

def main():
    """
    Main function to run data assessment
    """
    print("🏥 HealthOS Data Assessment & Exploration")
    print("=" * 50)
    
    # Initialize assessor
    assessor = HealthOSDataAssessment()
    
    try:
        # Assess all datasets
        assessments = assessor.assess_all_datasets()
        
        if assessments:
            # Generate report
            report = assessor.generate_assessment_report(assessments)
            
            # Print summary
            assessor.print_summary(report)
            
            print(f"\n✅ Assessment completed successfully!")
            print(f"📁 Results saved in: {assessor.assessment_dir}")
        
        else:
            print("❌ No datasets were assessed.")
    
    except Exception as e:
        print(f"❌ Error during assessment: {e}")

if __name__ == "__main__":
    main() 