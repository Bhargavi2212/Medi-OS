import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os
import json
from typing import Dict, List, Tuple, Optional
import logging

class RealDataManager:
    """
    Manages real healthcare datasets for ML training
    Supports multiple data sources and formats
    """
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.scalers = {}
        self.encoders = {}
        self.logger = logging.getLogger(__name__)
        
        # Create data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
    def load_emergency_wait_times(self, file_path: str) -> pd.DataFrame:
        """
        Load emergency department wait time data
        Expected columns: timestamp, department, queue_length, staff_count, 
                        wait_time, patient_count, hour_of_day, day_of_week
        """
        try:
            df = pd.read_csv(file_path)
            self.logger.info(f"Loaded emergency wait times: {len(df)} records")
            return df
        except Exception as e:
            self.logger.error(f"Error loading emergency data: {e}")
            return pd.DataFrame()
    
    def load_triage_data(self, file_path: str) -> pd.DataFrame:
        """
        Load patient triage data
        Expected columns: patient_id, age, symptoms, urgency_level, 
                        department, medical_complexity, wait_time
        """
        try:
            df = pd.read_csv(file_path)
            self.logger.info(f"Loaded triage data: {len(df)} records")
            return df
        except Exception as e:
            self.logger.error(f"Error loading triage data: {e}")
            return pd.DataFrame()
    
    def load_resource_utilization(self, file_path: str) -> pd.DataFrame:
        """
        Load resource utilization data
        Expected columns: timestamp, department, staff_available, rooms_available,
                        patient_count, efficiency_score, resource_utilization
        """
        try:
            df = pd.read_csv(file_path)
            self.logger.info(f"Loaded resource utilization: {len(df)} records")
            return df
        except Exception as e:
            self.logger.error(f"Error loading resource data: {e}")
            return pd.DataFrame()
    
    def preprocess_wait_time_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess wait time data for ML training
        """
        if df.empty:
            return np.array([]), np.array([])
        
        # Feature engineering
        df['hour_sin'] = np.sin(2 * np.pi * df['hour_of_day'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour_of_day'] / 24)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        
        # Select features
        feature_columns = [
            'queue_length', 'staff_count', 'patient_count',
            'hour_sin', 'hour_cos', 'day_sin', 'day_cos'
        ]
        
        # Encode categorical variables
        if 'department' in df.columns:
            le = LabelEncoder()
            df['department_encoded'] = le.fit_transform(df['department'])
            feature_columns.append('department_encoded')
            self.encoders['department'] = le
        
        X = df[feature_columns].values
        y = df['wait_time'].values
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        self.scalers['wait_time'] = scaler
        
        return X_scaled, y
    
    def preprocess_triage_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess triage data for ML training
        """
        if df.empty:
            return np.array([]), np.array([])
        
        # Feature engineering
        df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 50, 65, 100], 
                                labels=[0, 1, 2, 3, 4])
        df['age_group'] = df['age_group'].astype(int)
        
        # Process symptoms (assuming comma-separated symptoms)
        if 'symptoms' in df.columns:
            # Create symptom features
            all_symptoms = set()
            for symptoms in df['symptoms'].dropna():
                if isinstance(symptoms, str):
                    all_symptoms.update(symptoms.lower().split(','))
            
            for symptom in all_symptoms:
                df[f'symptom_{symptom.strip()}'] = df['symptoms'].str.contains(
                    symptom.strip(), case=False, na=False
                ).astype(int)
        
        # Select features
        feature_columns = ['age', 'age_group', 'medical_complexity']
        
        # Add symptom features
        symptom_columns = [col for col in df.columns if col.startswith('symptom_')]
        feature_columns.extend(symptom_columns)
        
        # Encode department
        if 'department' in df.columns:
            le = LabelEncoder()
            df['department_encoded'] = le.fit_transform(df['department'])
            feature_columns.append('department_encoded')
            self.encoders['triage_department'] = le
        
        X = df[feature_columns].fillna(0).values
        y = df['urgency_level'].values
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        self.scalers['triage'] = scaler
        
        return X_scaled, y
    
    def preprocess_resource_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess resource utilization data for ML training
        """
        if df.empty:
            return np.array([]), np.array([])
        
        # Feature engineering
        df['staff_utilization'] = df['patient_count'] / df['staff_available']
        df['room_utilization'] = df['patient_count'] / df['rooms_available']
        
        # Time features
        df['hour_sin'] = np.sin(2 * np.pi * df['hour_of_day'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour_of_day'] / 24)
        
        # Select features
        feature_columns = [
            'staff_available', 'rooms_available', 'patient_count',
            'staff_utilization', 'room_utilization', 'hour_sin', 'hour_cos'
        ]
        
        # Encode department
        if 'department' in df.columns:
            le = LabelEncoder()
            df['department_encoded'] = le.fit_transform(df['department'])
            feature_columns.append('department_encoded')
            self.encoders['resource_department'] = le
        
        X = df[feature_columns].values
        y = df['efficiency_score'].values
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        self.scalers['resource'] = scaler
        
        return X_scaled, y
    
    def split_data(self, X: np.ndarray, y: np.ndarray, 
                  test_size: float = 0.2, random_state: int = 42) -> Tuple:
        """
        Split data into train/test sets
        """
        if len(X) == 0:
            return np.array([]), np.array([]), np.array([]), np.array([])
        
        return train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    def save_preprocessing_artifacts(self, output_dir: str = "models"):
        """
        Save scalers and encoders for later use
        """
        os.makedirs(output_dir, exist_ok=True)
        
        # Save scalers
        for name, scaler in self.scalers.items():
            import joblib
            joblib.dump(scaler, os.path.join(output_dir, f"{name}_scaler.pkl"))
        
        # Save encoders
        for name, encoder in self.encoders.items():
            import joblib
            joblib.dump(encoder, os.path.join(output_dir, f"{name}_encoder.pkl"))
        
        self.logger.info(f"Saved preprocessing artifacts to {output_dir}")
    
    def load_preprocessing_artifacts(self, input_dir: str = "models"):
        """
        Load saved scalers and encoders
        """
        import joblib
        
        # Load scalers
        for name in ['wait_time', 'triage', 'resource']:
            try:
                self.scalers[name] = joblib.load(os.path.join(input_dir, f"{name}_scaler.pkl"))
            except FileNotFoundError:
                self.logger.warning(f"Scaler {name} not found")
        
        # Load encoders
        for name in ['department', 'triage_department', 'resource_department']:
            try:
                self.encoders[name] = joblib.load(os.path.join(input_dir, f"{name}_encoder.pkl"))
            except FileNotFoundError:
                self.logger.warning(f"Encoder {name} not found")
    
    def get_data_summary(self) -> Dict:
        """
        Get summary statistics of loaded data
        """
        summary = {
            'wait_time_records': 0,
            'triage_records': 0,
            'resource_records': 0,
            'features_processed': 0,
            'preprocessing_artifacts': len(self.scalers) + len(self.encoders)
        }
        
        return summary
    
    def validate_data_quality(self, df: pd.DataFrame, data_type: str) -> Dict:
        """
        Validate data quality and return issues
        """
        issues = []
        
        # Check for missing values
        missing_pct = df.isnull().sum().sum() / (len(df) * len(df.columns)) * 100
        if missing_pct > 10:
            issues.append(f"High missing values: {missing_pct:.1f}%")
        
        # Check for duplicates
        duplicates = df.duplicated().sum()
        if duplicates > 0:
            issues.append(f"Duplicate records: {duplicates}")
        
        # Check data types
        for col in df.columns:
            if df[col].dtype == 'object' and col not in ['department', 'symptoms']:
                issues.append(f"Unexpected object type in column: {col}")
        
        return {
            'data_type': data_type,
            'total_records': len(df),
            'total_columns': len(df.columns),
            'missing_percentage': missing_pct,
            'duplicate_records': duplicates,
            'issues': issues,
            'quality_score': max(0, 100 - len(issues) * 10)
        } 