"""
Training Script for ManageAgent
Generates synthetic data and trains queue prediction and triage models
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datasets.synthetic_data_generator import SyntheticDataGenerator
from models.manage_agent import ManageAgent
import pandas as pd
from pathlib import Path
import json
from datetime import datetime

def train_manage_agent():
    """Train the ManageAgent with synthetic data"""
    
    print("🤖 Training ManageAgent...")
    print("=" * 50)
    
    # Initialize data generator and agent
    data_generator = SyntheticDataGenerator()
    manage_agent = ManageAgent()
    
    # Generate synthetic data
    print("📊 Generating synthetic data...")
    output_path = Path("ml/datasets/raw/synthetic_data")
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Generate datasets
    patient_demographics = data_generator.generate_patient_demographics(1000)
    queue_data = data_generator.generate_queue_data(30, 50)
    appointment_data = data_generator.generate_appointment_data(30)
    clinical_notes = data_generator.generate_clinical_notes(500)
    
    # Save datasets
    patient_demographics.to_csv(output_path / "patient_demographics.csv", index=False)
    queue_data.to_csv(output_path / "queue_data.csv", index=False)
    appointment_data.to_csv(output_path / "appointment_data.csv", index=False)
    clinical_notes.to_csv(output_path / "clinical_notes.csv", index=False)
    
    print(f"✅ Generated {len(patient_demographics)} patient records")
    print(f"✅ Generated {len(queue_data)} queue entries")
    print(f"✅ Generated {len(appointment_data)} appointments")
    print(f"✅ Generated {len(clinical_notes)} clinical notes")
    
    # Train queue predictor
    print("\n🏥 Training queue predictor (LSTM)...")
    try:
        history = manage_agent.train_queue_predictor(queue_data)
        print("✅ Queue predictor trained successfully")
    except Exception as e:
        print(f"❌ Error training queue predictor: {e}")
        print("Using mock predictions for now")
    
    # Train triage classifier
    print("\n🏥 Training triage classifier (XGBoost)...")
    try:
        # Prepare patient data for triage training
        triage_data = patient_demographics.copy()
        triage_data['department'] = queue_data['department'].sample(len(triage_data)).values
        triage_data['urgency_level'] = queue_data['urgency_level'].sample(len(triage_data)).values
        
        accuracy = manage_agent.train_triage_classifier(triage_data)
        print(f"✅ Triage classifier trained successfully (Accuracy: {accuracy:.3f})")
    except Exception as e:
        print(f"❌ Error training triage classifier: {e}")
        print("Using mock classifications for now")
    
    # Save models
    manage_agent.save_models()
    
    # Test the agent
    print("\n🧪 Testing ManageAgent...")
    test_queue_state = {
        "queue_length": 8,
        "current_wait_time": 20,
        "staff_available": 5,
        "rooms_available": 8
    }
    
    wait_prediction = manage_agent.predict_wait_time(test_queue_state)
    print(f"⏰ Wait time prediction: {wait_prediction}")
    
    test_patient = {
        "age": 45,
        "urgency_level": 3,
        "department": "General Medicine",
        "medical_complexity": 2.5
    }
    
    triage_result = manage_agent.classify_triage(test_patient)
    print(f"🏥 Triage classification: {triage_result}")
    
    optimization = manage_agent.optimize_resources(test_queue_state)
    print(f"⚙️ Resource optimization: {optimization}")
    
    # Save training results
    results = {
        "training_date": datetime.now().isoformat(),
        "datasets_generated": {
            "patient_demographics": len(patient_demographics),
            "queue_data": len(queue_data),
            "appointment_data": len(appointment_data),
            "clinical_notes": len(clinical_notes)
        },
        "model_status": manage_agent.get_model_status(),
        "test_results": {
            "wait_prediction": wait_prediction,
            "triage_result": triage_result,
            "optimization": optimization
        }
    }
    
    with open(Path("ml/models/manage_agent/training_results.json"), "w") as f:
        json.dump(results, f, indent=2)
    
    print("\n🎉 ManageAgent training completed!")
    print("📁 Models saved to: ml/models/manage_agent/")
    print("📊 Training results saved to: ml/models/manage_agent/training_results.json")
    
    return results

if __name__ == "__main__":
    results = train_manage_agent()
    print("\n📋 Training Summary:")
    print(f"- Generated {results['datasets_generated']['patient_demographics']} patient records")
    print(f"- Generated {results['datasets_generated']['queue_data']} queue entries")
    print(f"- Queue predictor: {'✅ Trained' if results['model_status']['queue_predictor'] else '❌ Failed'}")
    print(f"- Triage classifier: {'✅ Trained' if results['model_status']['triage_classifier'] else '❌ Failed'}") 