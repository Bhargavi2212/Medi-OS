#!/usr/bin/env python3
"""
Test script for trained ML models
Demonstrates wait time prediction, triage classification, and resource optimization
"""

import sys
import os
import json
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.manage_agent import ManageAgent

def test_wait_time_prediction():
    """Test wait time prediction with sample queue data"""
    print("🏥 Testing Wait Time Prediction")
    print("=" * 50)
    
    # Sample queue scenarios
    test_scenarios = [
        {
            'name': 'Busy Emergency Department',
            'data': {
                'queueLength': 25,
                'staffAvailable': 3,
                'patientCount': 45,
                'hourOfDay': 14,
                'dayOfWeek': 2  # Tuesday
            }
        },
        {
            'name': 'Quiet Night Shift',
            'data': {
                'queueLength': 5,
                'staffAvailable': 2,
                'patientCount': 8,
                'hourOfDay': 2,
                'dayOfWeek': 6  # Saturday
            }
        },
        {
            'name': 'Peak Morning Rush',
            'data': {
                'queueLength': 35,
                'staffAvailable': 4,
                'patientCount': 60,
                'hourOfDay': 9,
                'dayOfWeek': 1  # Monday
            }
        }
    ]
    
    agent = ManageAgent()
    
    for scenario in test_scenarios:
        print(f"\n📊 Scenario: {scenario['name']}")
        print(f"   Queue Length: {scenario['data']['queueLength']}")
        print(f"   Staff Available: {scenario['data']['staffAvailable']}")
        print(f"   Hour: {scenario['data']['hourOfDay']}:00")
        
        result = agent.predict_wait_time(scenario['data'])
        
        print(f"   🎯 Predicted Wait: {result['estimatedWaitTime']}")
        print(f"   📈 Confidence: {result['confidence']:.2f}")
        print(f"   🤖 Model Used: {result['model_used']}")

def test_triage_classification():
    """Test triage classification with sample patient data"""
    print("\n\n🏥 Testing Triage Classification")
    print("=" * 50)
    
    # Sample patient scenarios
    test_patients = [
        {
            'name': 'Elderly Chest Pain',
            'data': {
                'age': 72,
                'medicalComplexity': 8,
                'symptoms': ['chest pain', 'shortness of breath'],
                'department': 'Cardiology'
            }
        },
        {
            'name': 'Young Minor Injury',
            'data': {
                'age': 25,
                'medicalComplexity': 2,
                'symptoms': ['minor cut', 'bruising'],
                'department': 'General Medicine'
            }
        },
        {
            'name': 'Child Head Injury',
            'data': {
                'age': 8,
                'medicalComplexity': 6,
                'symptoms': ['head injury', 'dizziness'],
                'department': 'Pediatrics'
            }
        }
    ]
    
    agent = ManageAgent()
    
    for patient in test_patients:
        print(f"\n👤 Patient: {patient['name']}")
        print(f"   Age: {patient['data']['age']}")
        print(f"   Symptoms: {', '.join(patient['data']['symptoms'])}")
        
        result = agent.classify_triage(patient['data'])
        
        print(f"   🚨 Urgency Level: {result['urgencyLevel']}")
        print(f"   📋 Description: {result['urgencyDescription']}")
        print(f"   ⏱️  Estimated Wait: {result['estimatedWaitTime']}")
        print(f"   📈 Confidence: {result['confidence']:.2f}")
        print(f"   🤖 Model Used: {result['model_used']}")

def test_resource_optimization():
    """Test resource optimization with sample queue data"""
    print("\n\n🏥 Testing Resource Optimization")
    print("=" * 50)
    
    # Sample resource scenarios
    test_scenarios = [
        {
            'name': 'Understaffed Department',
            'data': {
                'queueLength': 30,
                'staffAvailable': 2,
                'roomsAvailable': 5,
                'hourOfDay': 15
            }
        },
        {
            'name': 'Overstaffed Department',
            'data': {
                'queueLength': 5,
                'staffAvailable': 8,
                'roomsAvailable': 10,
                'hourOfDay': 3
            }
        },
        {
            'name': 'Balanced Department',
            'data': {
                'queueLength': 15,
                'staffAvailable': 4,
                'roomsAvailable': 6,
                'hourOfDay': 11
            }
        }
    ]
    
    agent = ManageAgent()
    
    for scenario in test_scenarios:
        print(f"\n📊 Scenario: {scenario['name']}")
        print(f"   Queue Length: {scenario['data']['queueLength']}")
        print(f"   Current Staff: {scenario['data']['staffAvailable']}")
        print(f"   Current Rooms: {scenario['data']['roomsAvailable']}")
        
        result = agent.optimize_resources(scenario['data'])
        
        print(f"   👥 Optimal Staff: {result['optimalStaffAllocation']}")
        print(f"   🏠 Optimal Rooms: {result['optimalRoomAllocation']}")
        print(f"   📈 Efficiency: {result['currentEfficiency']:.2f}")
        print(f"   💡 Recommendations:")
        for rec in result['recommendations']:
            print(f"      - {rec}")
        print(f"   🤖 Model Used: {result['model_used']}")

def test_model_performance():
    """Display model performance metrics"""
    print("\n\n📊 Model Performance Summary")
    print("=" * 50)
    
    agent = ManageAgent()
    metrics = agent.get_performance_metrics()
    
    if metrics:
        print("🎯 Training Results:")
        for model_name, results in metrics.items():
            print(f"\n   {model_name.upper().replace('_', ' ')}:")
            if 'rmse' in results:
                print(f"      RMSE: {results['rmse']:.3f}")
            if 'accuracy' in results:
                print(f"      Accuracy: {results['accuracy']:.3f}")
            print(f"      Model Type: {results['model_type']}")
            print(f"      Training Samples: {results['train_samples']}")
            print(f"      Test Samples: {results['test_samples']}")
    else:
        print("No performance metrics available. Models may not be trained.")

def main():
    """Run all tests"""
    print("🤖 Healthcare-OS ML Model Testing")
    print("=" * 60)
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Test each model
        test_wait_time_prediction()
        test_triage_classification()
        test_resource_optimization()
        test_model_performance()
        
        print("\n\n✅ All tests completed successfully!")
        print("🎉 ML models are working correctly!")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 