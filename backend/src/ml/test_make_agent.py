#!/usr/bin/env python3
"""
Test MakeAgent functionality with sample medical text
"""

import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend/src/ml'))

from make_agent import MakeAgent
import json

def test_make_agent():
    """Test MakeAgent with sample medical text"""
    print("🧪 Testing MakeAgent (AI Scribe & Records Agent)")
    print("=" * 60)
    
    # Initialize MakeAgent
    agent = MakeAgent()
    
    # Sample medical conversation
    sample_conversation = """
    Doctor: Good morning, Mrs. Johnson. What brings you in today?
    
    Patient: I've been having chest pain for the past three days. It's worse when I take a deep breath.
    
    Doctor: I see. Can you describe the pain? Is it sharp, dull, or pressure-like?
    
    Patient: It's more like pressure, and it radiates to my left arm sometimes.
    
    Doctor: Any other symptoms? Shortness of breath, nausea, sweating?
    
    Patient: Yes, I've been feeling short of breath, especially when I walk up stairs.
    
    Doctor: Any history of heart disease, diabetes, or high blood pressure?
    
    Patient: My father had a heart attack at 55, and I have high blood pressure.
    
    Doctor: Let me check your vital signs. Blood pressure is 160/95, heart rate 92.
    I'm concerned about possible angina or even a heart attack. We need to run some tests.
    
    Patient: What tests do you recommend?
    
    Doctor: I'll order an ECG, cardiac enzymes, and a chest X-ray. We should also consider a stress test.
    For now, I'll prescribe nitroglycerin for the chest pain and aspirin.
    """
    
    print("📝 Sample Medical Conversation:")
    print(sample_conversation)
    print("\n" + "=" * 60)
    
    # Test speech-to-text processing
    print("🎤 Testing Speech Recognition:")
    speech_result = agent.speech_to_text(sample_conversation)
    print(f"✅ Speech Recognition: {speech_result['confidence_score']:.2%} confidence")
    print(f"📄 Processed Text: {speech_result['validated_text'][:200]}...")
    
    # Test medical entity extraction
    print("\n🏥 Testing Medical NER:")
    ner_result = agent.extract_medical_entities_advanced(sample_conversation)
    print(f"✅ Extracted Entities:")
    for category, entities in ner_result['entities'].items():
        if entities:
            print(f"   {category.title()}: {', '.join(entities)}")
    
    # Test document summarization
    print("\n📋 Testing Document Summarization:")
    summary_result = agent.summarize_clinical_document(sample_conversation, max_length=150)
    print(f"✅ Summary: {summary_result['summary']}")
    print(f"📊 Quality Score: {summary_result['confidence_score']:.2%}")
    
    # Test transcription validation
    print("\n🔍 Testing Transcription Validation:")
    # Create a version with some errors
    error_text = sample_conversation.replace("chest pain", "chest pane").replace("heart attack", "heart attak")
    validation_result = agent.validate_transcription(sample_conversation, error_text)
    print(f"✅ Validation Score: {validation_result['confidence_score']:.2%}")
    print(f"🔧 Suggested Corrections: {validation_result['corrections'][:3]}")
    
    # Test complete conversation processing
    print("\n🔄 Testing Complete Conversation Processing:")
    complete_result = agent.process_medical_conversation(sample_conversation)
    print(f"✅ Overall Processing Score: {complete_result['entity_extraction']['confidence_score']:.2%}")
    print(f"📊 Confidence: {complete_result['speech_recognition']['confidence_score']:.2%}")
    
    # Show model status
    print("\n📊 Model Status:")
    status = agent.get_model_status()
    print(f"   Total Models: {status['total_models']}")
    print(f"   Loaded Models: {status['loaded_models']}")
    for model_name, model_info in status['model_status'].items():
        status_text = "✅ Loaded" if model_info['loaded'] else "❌ Not Loaded"
        print(f"   {model_name}: {status_text}")
    
    print("\n" + "=" * 60)
    print("✅ MakeAgent testing completed successfully!")
    
    return {
        'speech_recognition': speech_result,
        'ner': ner_result,
        'summarization': summary_result,
        'validation': validation_result,
        'complete_processing': complete_result,
        'model_status': status
    }

if __name__ == "__main__":
    results = test_make_agent()
    
    # Save test results
    with open('backend/src/ml/models/make_agent/test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print("\n💾 Test results saved to: backend/src/ml/models/make_agent/test_results.json") 