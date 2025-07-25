#!/usr/bin/env python3
"""
Training script for ManageAgent using real healthcare datasets
"""

import os
import sys
import logging
import argparse
from pathlib import Path

# Add the ML directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.manage_agent import ManageAgent
from datasets.real_data_manager import RealDataManager

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('training.log'),
            logging.StreamHandler()
        ]
    )

def validate_data_files(data_files: dict) -> dict:
    """Validate that data files exist and are readable"""
    valid_files = {}
    
    for data_type, file_path in data_files.items():
        if file_path and os.path.exists(file_path):
            try:
                # Try to read the first few lines to validate
                with open(file_path, 'r') as f:
                    f.readline()  # Read header
                valid_files[data_type] = file_path
                print(f"✅ Validated {data_type} data: {file_path}")
            except Exception as e:
                print(f"❌ Error reading {data_type} data: {e}")
        elif file_path:
            print(f"⚠️  {data_type} data file not found: {file_path}")
    
    return valid_files

def main():
    parser = argparse.ArgumentParser(description='Train ManageAgent with real healthcare data')
    parser.add_argument('--wait-time-data', help='Path to wait time CSV file')
    parser.add_argument('--triage-data', help='Path to triage CSV file')
    parser.add_argument('--resource-data', help='Path to resource utilization CSV file')
    parser.add_argument('--models-dir', default='models', help='Directory to save trained models')
    parser.add_argument('--data-dir', default='data', help='Directory for data files')
    parser.add_argument('--validate-only', action='store_true', help='Only validate data files')
    
    args = parser.parse_args()
    
    setup_logging()
    logger = logging.getLogger(__name__)
    
    print("🚀 Healthcare-OS ML Training with Real Data")
    print("=" * 50)
    
    # Validate data files
    data_files = {
        'wait_time': args.wait_time_data,
        'triage': args.triage_data,
        'resource': args.resource_data
    }
    
    valid_files = validate_data_files(data_files)
    
    if not valid_files:
        print("❌ No valid data files provided!")
        print("\n📋 Expected data formats:")
        print("\nWait Time Data (CSV):")
        print("  timestamp,department,queue_length,staff_count,wait_time,patient_count,hour_of_day,day_of_week")
        print("\nTriage Data (CSV):")
        print("  patient_id,age,symptoms,urgency_level,department,medical_complexity,wait_time")
        print("\nResource Data (CSV):")
        print("  timestamp,department,staff_available,rooms_available,patient_count,efficiency_score,resource_utilization")
        return
    
    if args.validate_only:
        print("✅ Data validation complete!")
        return
    
    # Initialize ManageAgent
    print("\n🤖 Initializing ManageAgent...")
    agent = ManageAgent(models_dir=args.models_dir, data_dir=args.data_dir)
    
    # Load real datasets
    print("\n📊 Loading real healthcare datasets...")
    datasets = agent.load_real_data(
        wait_time_file=valid_files.get('wait_time'),
        triage_file=valid_files.get('triage'),
        resource_file=valid_files.get('resource')
    )
    
    # Validate data quality
    print("\n🔍 Validating data quality...")
    for data_type, df in datasets.items():
        if not df.empty:
            quality_report = agent.data_manager.validate_data_quality(df, data_type)
            print(f"\n{data_type.upper()} Data Quality Report:")
            print(f"  Records: {quality_report['total_records']}")
            print(f"  Columns: {quality_report['total_columns']}")
            print(f"  Missing: {quality_report['missing_percentage']:.1f}%")
            print(f"  Duplicates: {quality_report['duplicate_records']}")
            print(f"  Quality Score: {quality_report['quality_score']}/100")
            
            if quality_report['issues']:
                print("  Issues:")
                for issue in quality_report['issues']:
                    print(f"    - {issue}")
    
    # Train models
    print("\n🎯 Training ML models...")
    training_results = agent.train_models(datasets)
    
    # Display results
    print("\n📈 Training Results:")
    print("=" * 30)
    
    for model_type, results in training_results.items():
        print(f"\n{model_type.upper()} Model:")
        print(f"  Model Type: {results['model_type']}")
        print(f"  Train Samples: {results['train_samples']}")
        print(f"  Test Samples: {results['test_samples']}")
        
        if 'rmse' in results:
            print(f"  RMSE: {results['rmse']:.2f}")
            print(f"  MSE: {results['mse']:.2f}")
        elif 'accuracy' in results:
            print(f"  Accuracy: {results['accuracy']:.3f}")
        
        if 'feature_importance' in results:
            print("  Top Features:")
            sorted_features = sorted(results['feature_importance'].items(), 
                                  key=lambda x: x[1], reverse=True)[:5]
            for feature, importance in sorted_features:
                print(f"    {feature}: {importance:.3f}")
    
    # Save summary
    summary = {
        'training_date': str(Path().cwd()),
        'data_files_used': valid_files,
        'training_results': training_results,
        'data_summary': agent.get_data_summary()
    }
    
    with open(os.path.join(args.models_dir, 'training_summary.json'), 'w') as f:
        import json
        json.dump(summary, f, indent=2)
    
    print(f"\n💾 Models saved to: {args.models_dir}")
    print(f"📋 Training summary saved to: {args.models_dir}/training_summary.json")
    print("\n✅ Training complete! Your ML models are ready for use.")

if __name__ == "__main__":
    main() 