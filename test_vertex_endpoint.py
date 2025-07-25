#!/usr/bin/env python3
"""
Simple Vertex AI Endpoint Test - Using Dedicated Domain
"""
import os
import json
import requests
import subprocess
from google.auth import default
from google.auth.transport.requests import Request

# Endpoint details
ENDPOINT_ID = "8172833756491546624"
PROJECT_ID = "medi-os-mvp"
REGION = "us-central1"
DEDICATED_DOMAIN = f"{ENDPOINT_ID}.{REGION}-497590509824.prediction.vertexai.goog"

def get_auth_token():
    """Get authentication token"""
    try:
        credentials, project = default()
        credentials.refresh(Request())
        return credentials.token
    except Exception as e:
        print(f"❌ Failed to get auth token: {e}")
        return None

def test_dedicated_endpoint():
    """Test the endpoint using the dedicated domain with proper auth"""
    print("=== Testing Dedicated Endpoint Access ===")
    
    # Get authentication token
    token = get_auth_token()
    if not token:
        print("❌ Cannot get authentication token")
        return False
    
    # Construct the dedicated endpoint URL
    url = f"https://{DEDICATED_DOMAIN}/v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:predict"
    
    print(f"Testing URL: {url}")
    
    # Test payload - try different formats
    payloads_to_try = [
        {
            "instances": [
                {
                    "prompt": "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
                }
            ]
        },
        {
            "instances": [
                {
                    "text": "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
                }
            ]
        },
        {
            "instances": [
                {
                    "input": "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
                }
            ]
        },
        {
            "instances": [
                "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
            ]
        }
    ]
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    for i, payload in enumerate(payloads_to_try):
        try:
            print(f"\nTrying payload format {i+1}: {list(payload.keys())}")
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                print(f"✓ Success with format {i+1}")
                print(f"Response: {response.json()}")
                return True
            else:
                print(f"❌ Format {i+1} failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Format {i+1} failed: {e}")
    
    return False

def test_gcloud_dedicated():
    """Test using gcloud with dedicated domain"""
    print("\n=== Testing gcloud with Dedicated Domain ===")
    
    # Create a temporary JSON file for the request
    request_data = {
        "instances": [
            {
                "prompt": "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
            }
        ]
    }
    
    with open('temp_request.json', 'w') as f:
        json.dump(request_data, f)
    
    try:
        # Use gcloud with the dedicated domain
        cmd = [
            "gcloud", "ai", "endpoints", "predict", ENDPOINT_ID,
            "--region", REGION,
            "--project", PROJECT_ID,
            "--json-request", "temp_request.json"
        ]
        
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ gcloud command successful")
            print(f"Response: {result.stdout}")
            return True
        else:
            print(f"❌ gcloud command failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ gcloud test failed: {e}")
        return False
    finally:
        # Clean up temp file
        if os.path.exists('temp_request.json'):
            os.remove('temp_request.json')

def test_curl_dedicated():
    """Test using curl with dedicated domain"""
    print("\n=== Testing curl with Dedicated Domain ===")
    
    # Get auth token
    token = get_auth_token()
    if not token:
        return False
    
    url = f"https://{DEDICATED_DOMAIN}/v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:predict"
    
    payload = {
        "instances": [
            {
                "prompt": "Medical Assessment: Patient age 35, state Maharashtra, cost 20000, urgency 2. Provide medical assessment."
            }
        ]
    }
    
    try:
        cmd = [
            "curl", "-X", "POST", url,
            "-H", f"Authorization: Bearer {token}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(payload)
        ]
        
        print(f"Running curl command...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ curl command successful")
            print(f"Response: {result.stdout}")
            return True
        else:
            print(f"❌ curl command failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ curl test failed: {e}")
        return False

def main():
    print("=== Vertex AI Dedicated Endpoint Connection Test ===")
    print(f"Endpoint ID: {ENDPOINT_ID}")
    print(f"Project: {PROJECT_ID}")
    print(f"Region: {REGION}")
    print(f"Dedicated Domain: {DEDICATED_DOMAIN}")
    
    # Test 1: Direct HTTP with dedicated domain
    http_success = test_dedicated_endpoint()
    
    # Test 2: gcloud with dedicated domain
    gcloud_success = test_gcloud_dedicated()
    
    # Test 3: curl with dedicated domain
    curl_success = test_curl_dedicated()
    
    print("\n=== Test Results ===")
    print(f"HTTP Test: {'✓ Success' if http_success else '❌ Failed'}")
    print(f"gcloud Test: {'✓ Success' if gcloud_success else '❌ Failed'}")
    print(f"curl Test: {'✓ Success' if curl_success else '❌ Failed'}")
    
    if http_success or gcloud_success or curl_success:
        print("\n✓ Endpoint is accessible via dedicated domain!")
        print("We can now update the main training script to use this approach.")
    else:
        print("\n❌ All connection methods failed")
        print("Check:")
        print("1. Endpoint is deployed and running")
        print("2. Authentication is set up correctly")
        print("3. Network connectivity to Vertex AI")
        print("4. Endpoint is in the correct region")

if __name__ == "__main__":
    main() 