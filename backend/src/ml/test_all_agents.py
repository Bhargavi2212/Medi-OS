#!/usr/bin/env python3
"""
Test All HealthOS Agents
Comprehensive demonstration of all agents working together
"""

import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend/src/ml'))

from manage_agent import ManageAgent
from make_agent import MakeAgent
from agents.insights_agent.insights_agent import InsightsAgent
from agents.integration_agent.integration_agent import IntegrationAgent
from agents.market_agent.market_agent import MarketAgent
import json

def test_all_agents():
    """Test all HealthOS agents working together"""
    print("🚀 Testing All HealthOS Agents")
    print("=" * 80)
    
    results = {}
    
    # Test ManageAgent
    print("\n🏥 Testing ManageAgent (Operations Management):")
    print("-" * 50)
    try:
        manage_agent = ManageAgent()
        
        # Test wait time prediction
        test_queue = {
            'queue_length': 15,
            'staff_available': 8,
            'rooms_available': 12,
            'hour_of_day': 14,
            'day_of_week': 2,
            'current_wait_time': 25
        }
        wait_prediction = manage_agent.predict_wait_time(test_queue)
        
        # Test triage classification
        test_patient = {
            'age': 65,
            'urgency_level': 4,
            'department': 'Emergency',
            'medical_complexity': 7.5,
            'symptoms': ['chest pain', 'shortness of breath'],
            'pain_level': 9
        }
        triage_result = manage_agent.classify_triage(test_patient)
        
        results['manage_agent'] = {
            'status': '✅ Success',
            'wait_time_prediction': wait_prediction,
            'triage_classification': triage_result
        }
        print(f"✅ Wait Time Prediction: {wait_prediction['estimated_wait_time']}")
        print(f"✅ Triage Classification: {triage_result['urgency_description']}")
        
    except Exception as e:
        results['manage_agent'] = {'status': f'❌ Error: {str(e)}'}
        print(f"❌ ManageAgent error: {e}")
    
    # Test MakeAgent
    print("\n📝 Testing MakeAgent (AI Scribe & Records):")
    print("-" * 50)
    try:
        make_agent = MakeAgent()
        
        # Test medical conversation processing
        sample_conversation = """
        Doctor: Patient presents with chest pain and shortness of breath.
        Patient: The pain started yesterday and gets worse with activity.
        Doctor: Any family history of heart disease?
        Patient: Yes, my father had a heart attack at 60.
        Doctor: Let's order an ECG and cardiac enzymes.
        """
        
        processing_result = make_agent.process_medical_conversation(sample_conversation)
        
        results['make_agent'] = {
            'status': '✅ Success',
            'speech_recognition': processing_result['speech_recognition']['confidence_score'],
            'entity_extraction': processing_result['entity_extraction']['entity_count'],
            'summarization': processing_result['summarization']['summary_length'],
            'validation': processing_result['validation']['confidence_score']
        }
        print(f"✅ Speech Recognition: {processing_result['speech_recognition']['confidence_score']:.1%}")
        print(f"✅ Entity Extraction: {processing_result['entity_extraction']['entity_count']} entities")
        print(f"✅ Document Summarization: {processing_result['summarization']['summary_length']} words")
        print(f"✅ Transcription Validation: {processing_result['validation']['confidence_score']:.1%}")
        
    except Exception as e:
        results['make_agent'] = {'status': f'❌ Error: {str(e)}'}
        print(f"❌ MakeAgent error: {e}")
    
    # Test InsightsAgent
    print("\n🔍 Testing InsightsAgent (Data Analytics & Insights):")
    print("-" * 50)
    try:
        insights_agent = InsightsAgent()
        
        # Generate synthetic data and insights report
        data = insights_agent.generate_synthetic_healthcare_data(3000)
        insights_report = insights_agent.generate_insights_report(data)
        
        results['insights_agent'] = {
            'status': '✅ Success',
            'total_patients': insights_report['patient_trends']['trends']['total_patients'],
            'avg_length_of_stay': insights_report['patient_trends']['trends']['avg_length_of_stay'],
            'readmission_rate': insights_report['performance_metrics']['kpis']['avg_readmission_rate'],
            'action_items': len(insights_report['action_items'])
        }
        print(f"✅ Patient Analysis: {insights_report['patient_trends']['trends']['total_patients']} patients")
        print(f"✅ Avg Length of Stay: {insights_report['patient_trends']['trends']['avg_length_of_stay']:.1f} days")
        print(f"✅ Readmission Rate: {insights_report['performance_metrics']['kpis']['avg_readmission_rate']:.1%}")
        print(f"✅ Action Items: {len(insights_report['action_items'])} recommendations")
        
    except Exception as e:
        results['insights_agent'] = {'status': f'❌ Error: {str(e)}'}
        print(f"❌ InsightsAgent error: {e}")
    
    # Test IntegrationAgent
    print("\n🔗 Testing IntegrationAgent (System Integration & API):")
    print("-" * 50)
    try:
        integration_agent = IntegrationAgent()
        
        # Generate synthetic data and integration report
        data = integration_agent.generate_synthetic_integration_data(2000)
        integration_report = integration_agent.generate_integration_report(data)
        
        results['integration_agent'] = {
            'status': '✅ Success',
            'total_endpoints': integration_report['api_analysis']['api_metrics']['total_endpoints'],
            'avg_response_time': integration_report['api_analysis']['api_metrics']['avg_response_time'],
            'compatibility_score': integration_report['compatibility_check']['compatibility_score'],
            'test_result': integration_report['integration_test']['test_result']
        }
        print(f"✅ API Analysis: {integration_report['api_analysis']['api_metrics']['total_endpoints']} endpoints")
        print(f"✅ Avg Response Time: {integration_report['api_analysis']['api_metrics']['avg_response_time']:.1f}ms")
        print(f"✅ Compatibility Score: {integration_report['compatibility_check']['compatibility_score']:.1%}")
        print(f"✅ Integration Test: {integration_report['integration_test']['test_result']}")
        
    except Exception as e:
        results['integration_agent'] = {'status': f'❌ Error: {str(e)}'}
        print(f"❌ IntegrationAgent error: {e}")
    
    # Test MarketAgent
    print("\n📊 Testing MarketAgent (Market Analysis & Strategy):")
    print("-" * 50)
    try:
        market_agent = MarketAgent()
        
        # Generate synthetic data and market report
        data = market_agent.generate_synthetic_market_data(3000)
        market_report = market_agent.generate_market_report(data)
        
        results['market_agent'] = {
            'status': '✅ Success',
            'total_segments': market_report['trend_analysis']['market_metrics']['total_segments'],
            'avg_growth_rate': market_report['trend_analysis']['market_metrics']['avg_growth_rate'],
            'total_competitors': market_report['competitor_analysis']['competitive_metrics']['total_competitors'],
            'demand_growth': market_report['demand_forecast']['demand_metrics']['demand_growth']
        }
        print(f"✅ Market Segments: {market_report['trend_analysis']['market_metrics']['total_segments']}")
        print(f"✅ Avg Growth Rate: {market_report['trend_analysis']['market_metrics']['avg_growth_rate']:.1%}")
        print(f"✅ Total Competitors: {market_report['competitor_analysis']['competitive_metrics']['total_competitors']}")
        print(f"✅ Demand Growth: {market_report['demand_forecast']['demand_metrics']['demand_growth']:.1%}")
        
    except Exception as e:
        results['market_agent'] = {'status': f'❌ Error: {str(e)}'}
        print(f"❌ MarketAgent error: {e}")
    
    # Generate comprehensive summary
    print("\n" + "=" * 80)
    print("🎯 COMPREHENSIVE HEALTHOS AGENT TEST RESULTS")
    print("=" * 80)
    
    successful_agents = sum(1 for agent in results.values() if agent['status'].startswith('✅'))
    total_agents = len(results)
    
    print(f"📊 Overall Status: {successful_agents}/{total_agents} agents successful")
    print()
    
    for agent_name, result in results.items():
        status_icon = "✅" if result['status'].startswith('✅') else "❌"
        print(f"{status_icon} {agent_name.replace('_', ' ').title()}: {result['status']}")
    
    print("\n" + "=" * 80)
    print("🚀 HealthOS Agent Ecosystem Status:")
    print("=" * 80)
    
    if successful_agents == total_agents:
        print("🎉 ALL AGENTS OPERATIONAL - HealthOS is ready for deployment!")
        print("\nAgent Capabilities:")
        print("🏥 ManageAgent: Clinic operations, wait time prediction, triage classification")
        print("📝 MakeAgent: Medical transcription, NER, summarization, validation")
        print("🔍 InsightsAgent: Data analytics, outcome prediction, performance metrics")
        print("🔗 IntegrationAgent: API management, compatibility analysis, integration testing")
        print("📊 MarketAgent: Market analysis, competitive intelligence, demand forecasting")
    else:
        print(f"⚠️  {total_agents - successful_agents} agent(s) need attention")
    
    # Save comprehensive results
    with open('backend/src/ml/agents/comprehensive_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Comprehensive test results saved to: backend/src/ml/agents/comprehensive_test_results.json")
    
    return results

if __name__ == "__main__":
    results = test_all_agents()
    print("\n✅ All HealthOS agents testing completed!") 