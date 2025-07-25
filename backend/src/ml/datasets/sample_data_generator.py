#!/usr/bin/env python3
"""
Sample data generator for healthcare ML training
Creates realistic datasets for testing the ManageAgent
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import random

class SampleDataGenerator:
    """
    Generates realistic sample healthcare datasets for ML training
    """
    
    def __init__(self, output_dir: str = "data"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Set random seed for reproducibility
        np.random.seed(42)
        random.seed(42)
    
    def generate_wait_time_data(self, days: int = 30, hospitals: int = 3) -> pd.DataFrame:
        """
        Generate realistic emergency department wait time data
        """
        departments = ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology', 'General Medicine']
        
        data = []
        start_date = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            
            for hour in range(24):
                for dept in departments:
                    # Generate realistic patterns
                    base_queue = np.random.poisson(8)  # Poisson distribution for arrivals
                    
                    # Peak hours (10-14, 18-22)
                    if 10 <= hour <= 14 or 18 <= hour <= 22:
                        base_queue *= 1.5
                    
                    # Weekend effect
                    if current_date.weekday() >= 5:  # Weekend
                        base_queue *= 0.7
                    
                    # Department-specific patterns
                    if dept == 'Emergency':
                        base_queue *= 1.2
                    elif dept == 'Cardiology':
                        base_queue *= 0.8
                    
                    staff_count = max(1, int(base_queue / 3) + np.random.randint(1, 4))
                    wait_time = max(5, int(base_queue * 15 / staff_count) + np.random.randint(-10, 20))
                    
                    data.append({
                        'timestamp': current_date.replace(hour=hour).isoformat(),
                        'department': dept,
                        'queue_length': max(0, int(base_queue)),
                        'staff_count': staff_count,
                        'wait_time': wait_time,
                        'patient_count': int(base_queue * 0.8),
                        'hour_of_day': hour,
                        'day_of_week': current_date.weekday()
                    })
        
        df = pd.DataFrame(data)
        return df
    
    def generate_triage_data(self, patients: int = 1000) -> pd.DataFrame:
        """
        Generate realistic patient triage data
        """
        symptoms_list = [
            'chest pain', 'shortness of breath', 'headache', 'fever',
            'abdominal pain', 'back pain', 'dizziness', 'nausea',
            'cough', 'sore throat', 'joint pain', 'fatigue',
            'bleeding', 'swelling', 'rash', 'vision problems'
        ]
        
        departments = ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology', 'General Medicine']
        
        data = []
        
        for i in range(patients):
            age = np.random.normal(45, 20)
            age = max(1, min(100, int(age)))
            
            # Generate symptoms
            num_symptoms = np.random.poisson(2) + 1
            symptoms = random.sample(symptoms_list, min(num_symptoms, len(symptoms_list)))
            
            # Determine urgency based on age, symptoms, and medical complexity
            urgency_level = 3  # Default medium urgency
            
            # Age factor
            if age > 65:
                urgency_level += 1
            elif age < 18:
                urgency_level += 0.5
            
            # Symptom factor
            urgent_symptoms = ['chest pain', 'shortness of breath', 'bleeding', 'vision problems']
            if any(symptom in symptoms for symptom in urgent_symptoms):
                urgency_level += 1
            
            # Medical complexity
            medical_complexity = np.random.normal(3, 1.5)
            medical_complexity = max(1, min(10, int(medical_complexity)))
            
            if medical_complexity > 6:
                urgency_level += 1
            
            urgency_level = max(1, min(5, int(urgency_level)))
            
            # Determine department based on symptoms
            if 'chest' in str(symptoms) or 'heart' in str(symptoms):
                department = 'Cardiology'
            elif 'head' in str(symptoms) or 'brain' in str(symptoms):
                department = 'Neurology'
            elif 'bone' in str(symptoms) or 'joint' in str(symptoms):
                department = 'Orthopedics'
            elif any(symptom in symptoms for symptom in urgent_symptoms):
                department = 'Emergency'
            else:
                department = random.choice(departments)
            
            wait_time = urgency_level * 15 + np.random.randint(-10, 20)
            wait_time = max(5, wait_time)
            
            data.append({
                'patient_id': f'P{i:06d}',
                'age': age,
                'symptoms': ','.join(symptoms),
                'urgency_level': urgency_level,
                'department': department,
                'medical_complexity': medical_complexity,
                'wait_time': wait_time
            })
        
        df = pd.DataFrame(data)
        return df
    
    def generate_resource_data(self, days: int = 30, hospitals: int = 3) -> pd.DataFrame:
        """
        Generate realistic resource utilization data
        """
        departments = ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology', 'General Medicine']
        
        data = []
        start_date = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            
            for hour in range(24):
                for dept in departments:
                    # Base resource availability
                    staff_available = np.random.randint(2, 8)
                    rooms_available = np.random.randint(3, 12)
                    
                    # Patient count based on time and department
                    base_patients = np.random.poisson(6)
                    
                    # Peak hours
                    if 10 <= hour <= 14 or 18 <= hour <= 22:
                        base_patients *= 1.3
                    
                    # Department-specific patterns
                    if dept == 'Emergency':
                        base_patients *= 1.4
                    elif dept == 'Cardiology':
                        base_patients *= 0.9
                    
                    patient_count = max(0, int(base_patients))
                    
                    # Calculate efficiency score
                    staff_utilization = patient_count / max(staff_available, 1)
                    room_utilization = patient_count / max(rooms_available, 1)
                    
                    # Efficiency score (0-1, higher is better)
                    efficiency_score = 1.0 - (staff_utilization * 0.4 + room_utilization * 0.3)
                    efficiency_score = max(0.1, min(1.0, efficiency_score))
                    
                    # Resource utilization percentage
                    resource_utilization = (staff_utilization + room_utilization) / 2
                    resource_utilization = min(1.0, resource_utilization)
                    
                    data.append({
                        'timestamp': current_date.replace(hour=hour).isoformat(),
                        'department': dept,
                        'staff_available': staff_available,
                        'rooms_available': rooms_available,
                        'patient_count': patient_count,
                        'efficiency_score': efficiency_score,
                        'resource_utilization': resource_utilization,
                        'hour_of_day': hour
                    })
        
        df = pd.DataFrame(data)
        return df
    
    def generate_all_datasets(self, days: int = 30, patients: int = 1000):
        """
        Generate all sample datasets
        """
        print("🚀 Generating sample healthcare datasets...")
        
        # Generate wait time data
        print("📊 Generating wait time data...")
        wait_time_df = self.generate_wait_time_data(days)
        wait_time_path = os.path.join(self.output_dir, 'sample_wait_time_data.csv')
        wait_time_df.to_csv(wait_time_path, index=False)
        print(f"✅ Wait time data saved: {wait_time_path} ({len(wait_time_df)} records)")
        
        # Generate triage data
        print("🏥 Generating triage data...")
        triage_df = self.generate_triage_data(patients)
        triage_path = os.path.join(self.output_dir, 'sample_triage_data.csv')
        triage_df.to_csv(triage_path, index=False)
        print(f"✅ Triage data saved: {triage_path} ({len(triage_df)} records)")
        
        # Generate resource data
        print("⚙️ Generating resource utilization data...")
        resource_df = self.generate_resource_data(days)
        resource_path = os.path.join(self.output_dir, 'sample_resource_data.csv')
        resource_df.to_csv(resource_path, index=False)
        print(f"✅ Resource data saved: {resource_path} ({len(resource_df)} records)")
        
        # Print summary
        print("\n📋 Dataset Summary:")
        print(f"  Wait Time Data: {len(wait_time_df)} records")
        print(f"  Triage Data: {len(triage_df)} records")
        print(f"  Resource Data: {len(resource_df)} records")
        print(f"  Total Records: {len(wait_time_df) + len(triage_df) + len(resource_df)}")
        
        return {
            'wait_time': wait_time_path,
            'triage': triage_path,
            'resource': resource_path
        }

def main():
    """Generate sample datasets for testing"""
    generator = SampleDataGenerator()
    
    print("🎯 Healthcare-OS Sample Data Generator")
    print("=" * 40)
    
    # Generate all datasets
    data_files = generator.generate_all_datasets(days=30, patients=1000)
    
    print("\n🎉 Sample data generation complete!")
    print("\n📋 Next steps:")
    print("1. Review the generated CSV files in the 'data' directory")
    print("2. Use these files to train your ML models:")
    print(f"   python train_with_real_data.py --wait-time-data {data_files['wait_time']} --triage-data {data_files['triage']} --resource-data {data_files['resource']}")
    print("3. Or validate the data format:")
    print(f"   python train_with_real_data.py --wait-time-data {data_files['wait_time']} --validate-only")

if __name__ == "__main__":
    main() 