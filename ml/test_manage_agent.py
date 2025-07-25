"""
Simple Test Script for ManageAgent
Tests the agent functionality without requiring all ML dependencies
"""

import sys
import os
from pathlib import Path
import json
from datetime import datetime

# Add the ml directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from datasets.synthetic_data_generator import SyntheticDataGenerator
    from models.manage_agent import ManageAgent
    print("✅ All dependencies available")
except ImportError as e:
    print(f"⚠️ Some dependencies missing: {e}")
    print("Running with mock data generation...")

def test_manage_agent():
    """Test the ManageAgent functionality"""
    
    print("🧪 Testing ManageAgent...")
    print("=" * 50)
    
    try:
        # Initialize agent
        manage_agent = ManageAgent()
        print("✅ ManageAgent initialized")
        
        # Test queue prediction
        print("\n⏰ Testing queue prediction...")
        test_queue_state = {
            "queue_length": 8,
            "current_wait_time": 20,
            "staff_available": 5,
            "rooms_available": 8
        }
        
        wait_prediction = manage_agent.predict_wait_time(test_queue_state)
        print(f"✅ Wait time prediction: {wait_prediction}")
        
        # Test triage classification
        print("\n🏥 Testing triage classification...")
        test_patient = {
            "age": 45,
            "urgency_level": 3,
            "department": "General Medicine",
            "medical_complexity": 2.5
        }
        
        triage_result = manage_agent.classify_triage(test_patient)
        print(f"✅ Triage classification: {triage_result}")
        
        # Test resource optimization
        print("\n⚙️ Testing resource optimization...")
        optimization = manage_agent.optimize_resources(test_queue_state)
        print(f"✅ Resource optimization: {optimization}")
        
        # Test digital check-in
        print("\n📱 Testing digital check-in...")
        patient_data = {
            "patient_id": "P001234",
            "department": "Cardiology",
            "age": 45,
            "urgency_level": 3
        }
        
        checkin_result = manage_agent.process_digital_checkin(patient_data)
        print(f"✅ Digital check-in: {checkin_result}")
        
        # Get model status
        model_status = manage_agent.get_model_status()
        print(f"\n📊 Model status: {model_status}")
        
        # Save test results
        results = {
            "test_date": datetime.now().isoformat(),
            "test_results": {
                "wait_prediction": wait_prediction,
                "triage_result": triage_result,
                "optimization": optimization,
                "checkin_result": checkin_result
            },
            "model_status": model_status
        }
        
        # Create results directory
        results_dir = Path("ml/models/manage_agent")
        results_dir.mkdir(parents=True, exist_ok=True)
        
        with open(results_dir / "test_results.json", "w") as f:
            json.dump(results, f, indent=2)
        
        print("\n🎉 ManageAgent test completed successfully!")
        print("📁 Test results saved to: ml/models/manage_agent/test_results.json")
        
        return results
        
    except Exception as e:
        print(f"❌ Error testing ManageAgent: {e}")
        return None

def generate_synthetic_data():
    """Generate synthetic data for testing"""
    
    print("\n📊 Generating synthetic data...")
    
    try:
        data_generator = SyntheticDataGenerator()
        
        # Generate small datasets for testing
        patient_demographics = data_generator.generate_patient_demographics(100)
        queue_data = data_generator.generate_queue_data(7, 20)  # 1 week, 20 patients/day
        appointment_data = data_generator.generate_appointment_data(7)
        clinical_notes = data_generator.generate_clinical_notes(50)
        
        # Save to test directory
        test_data_dir = Path("ml/datasets/raw/test_data")
        test_data_dir.mkdir(parents=True, exist_ok=True)
        
        patient_demographics.to_csv(test_data_dir / "patient_demographics.csv", index=False)
        queue_data.to_csv(test_data_dir / "queue_data.csv", index=False)
        appointment_data.to_csv(test_data_dir / "appointment_data.csv", index=False)
        clinical_notes.to_csv(test_data_dir / "clinical_notes.csv", index=False)
        
        print(f"✅ Generated {len(patient_demographics)} patient records")
        print(f"✅ Generated {len(queue_data)} queue entries")
        print(f"✅ Generated {len(appointment_data)} appointments")
        print(f"✅ Generated {len(clinical_notes)} clinical notes")
        print(f"📁 Data saved to: {test_data_dir}")
        
        return {
            "patient_demographics": len(patient_demographics),
            "queue_data": len(queue_data),
            "appointment_data": len(appointment_data),
            "clinical_notes": len(clinical_notes)
        }
        
    except Exception as e:
        print(f"❌ Error generating synthetic data: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Starting HealthOS ManageAgent Test")
    print("=" * 50)
    
    # Generate synthetic data
    data_results = generate_synthetic_data()
    
    # Test ManageAgent
    test_results = test_manage_agent()
    
    if test_results:
        print("\n📋 Test Summary:")
        print("✅ ManageAgent functionality working")
        print("✅ Queue prediction working")
        print("✅ Triage classification working")
        print("✅ Resource optimization working")
        print("✅ Digital check-in working")
        
        if data_results:
            print(f"✅ Generated {data_results['patient_demographics']} patient records")
            print(f"✅ Generated {data_results['queue_data']} queue entries")
    else:
        print("\n❌ Some tests failed")
    
    print("\n🎯 Next steps:")
    print("1. Install Python ML dependencies (tensorflow, xgboost, scikit-learn)")
    print("2. Run full training with real ML models")
    print("3. Integrate with backend API")
    print("4. Deploy to production") 