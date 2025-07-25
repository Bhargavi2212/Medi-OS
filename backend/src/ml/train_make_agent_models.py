import os
import json
import pickle
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, cross_val_score

class TrainMakeAgentModels:
    def __init__(self, models_dir):
        self.models_dir = models_dir

    def train_validation_model(self, df):
        """Train validation model with improved regularization to reduce overfitting"""
        logger.info("🔍 Training validation model...")
        
        # Prepare features and labels
        X = df[['error_count', 'original_length', 'error_length', 'medical_terms_original', 
                'medical_terms_error', 'symptoms_count', 'diagnoses_count', 'medications_count']]
        y = df['is_valid']
        
        # Split data with stratification
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        
        # Use more conservative model with regularization
        model = RandomForestClassifier(
            n_estimators=50,  # Reduced from 100
            max_depth=4,       # Reduced from 8
            min_samples_leaf=10,  # Increased from 1
            min_samples_split=20,  # Added
            class_weight='balanced',  # Handle class imbalance
            random_state=42
        )
        
        # Train model
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        # Cross-validation for more robust evaluation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
        
        logger.info(f"✅ Validation model accuracy: {accuracy:.3f}")
        logger.info(f"✅ CV Accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        logger.info(f"✅ F1 Score: {f1:.3f}")
        
        # Save model and metrics
        model_data = {
            'model': model,
            'accuracy': accuracy,
            'f1_score': f1,
            'cv_scores': cv_scores.tolist(),
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'training_date': datetime.now().isoformat(),
            'training_samples': X_train.shape[0],
            'test_samples': X_test.shape[0],
            'feature_importance': dict(zip(X.columns, model.feature_importances_))
        }
        
        # Save model
        model_file = f"{self.models_dir}/validation/validation_model.pkl"
        os.makedirs(os.path.dirname(model_file), exist_ok=True)
        with open(model_file, 'wb') as f:
            pickle.dump(model_data, f)
        
        # Save metrics
        metrics_file = f"{self.models_dir}/validation/validation_metrics.json"
        with open(metrics_file, 'w') as f:
            json.dump(model_data, f, indent=2, default=str)
        
        logger.info(f"💾 Validation model saved: {model_file}")
        return model_data 