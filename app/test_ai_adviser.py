"""
RISKCAST v16 - AI Adviser Module Test Script
Run this to verify your integration is working correctly
"""

import requests
import json
import os
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
API_ENDPOINT = f"{BASE_URL}/api/ai/adviser"
HEALTH_ENDPOINT = f"{BASE_URL}/api/ai/health"

# Test data - Sample shipment
SAMPLE_SHIPMENT = {
    "risk_data": {
        "origin": "Shanghai, China",
        "destination": "Los Angeles, USA",
        "product": "Electronics (Smartphones)",
        "value": 250000.00,
        "weight": 5000,
        "total_risk_score": 72,
        "weather_risk": 65,
        "route_risk": 58,
        "seasonal_risk": 75,
        "geopolitical_risk": 82,
        "carrier": "Maersk Line",
        "departure_date": "2024-12-15",
        "estimated_arrival": "2025-01-05",
        "route_details": {
            "distance_km": 11000,
            "transit_days": 21,
            "ports_of_call": ["Shanghai", "Busan", "Tokyo", "Los Angeles"]
        },
        "weather_data": {
            "current_conditions": "Typhoon season active",
            "forecast": "High seas expected",
            "enso_phase": "El Niño"
        },
        "geopolitical_factors": [
            "Trade tensions",
            "Port congestion",
            "Customs delays possible"
        ]
    }
}


def print_section(title: str):
    """Print formatted section header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def check_environment():
    """Check if environment is properly configured"""
    print_section("STEP 1: Environment Check")
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found in environment")
        print("   Please set your API key in .env file")
        return False
    
    if api_key == "your_anthropic_api_key_here":
        print("❌ ANTHROPIC_API_KEY is still the placeholder value")
        print("   Please replace with your actual API key")
        return False
    
    print("✅ ANTHROPIC_API_KEY is configured")
    print(f"   Key starts with: {api_key[:15]}...")
    return True


def test_health_endpoint():
    """Test the health check endpoint"""
    print_section("STEP 2: Health Check")
    
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get("status") == "ok":
                print("✅ Health check passed")
                return True
            else:
                print(f"⚠️  Health check returned status: {data.get('status')}")
                if data.get("status") == "error":
                    print(f"   Message: {data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to health endpoint: {str(e)}")
        print("   Make sure your FastAPI server is running")
        return False


def test_ai_adviser():
    """Test the AI Adviser endpoint with sample data"""
    print_section("STEP 3: AI Adviser Test")
    
    try:
        # Use correct payload format: {"prompt": "..."}
        test_prompt = "Phân tích rủi ro logistics cho shipment từ Shanghai đến Los Angeles. Giá trị: $250,000"
        
        print("Sending request to AI Adviser...")
        print(f"Endpoint: {API_ENDPOINT}")
        print(f"Prompt: {test_prompt[:100]}...")
        
        response = requests.post(
            API_ENDPOINT,
            json={"prompt": test_prompt},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("✅ AI Adviser request successful")
            
            if "reply" in data:
                reply = data.get("reply", "")
                print(f"\nAI Reply Preview (first 500 chars):")
                print("-" * 60)
                print(reply[:500])
                print("\n..." if len(reply) > 500 else "")
                print("-" * 60)
                
                if len(reply) > 50:
                    print("✅ Reply has substantial content")
                else:
                    print("⚠️  Reply seems too short")
            else:
                print("⚠️  Response missing 'reply' field")
                print(f"Response keys: {list(data.keys())}")
            
            return True
            
        elif response.status_code == 500:
            error_data = response.json()
            print(f"❌ Server error: {error_data.get('detail', 'Unknown error')}")
            return False
        else:
            print(f"❌ Request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out (>30 seconds)")
        print("   This might indicate an issue with Claude API")
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False


def run_integration_test():
    """Run complete integration test"""
    print("\n" + "═" * 60)
    print("  RISKCAST v16 - AI ADVISER INTEGRATION TEST")
    print("═" * 60)
    
    results = {
        "environment": False,
        "health": False,
        "ai_adviser": False
    }
    
    # Step 1: Check environment
    results["environment"] = check_environment()
    
    if not results["environment"]:
        print_section("TEST FAILED")
        print("❌ Environment is not properly configured")
        print("   Please set ANTHROPIC_API_KEY in your .env file")
        return False
    
    # Step 2: Test health endpoint
    results["health"] = test_health_endpoint()
    
    if not results["health"]:
        print_section("TEST FAILED")
        print("❌ Health check failed")
        print("   Please ensure:")
        print("   1. FastAPI server is running (uvicorn app.main:app --reload)")
        print("   2. AI router is registered in app/main.py")
        print("   3. api_ai.py is in the correct location")
        return False
    
    # Step 3: Test AI Adviser
    results["ai_adviser"] = test_ai_adviser()
    
    # Final results
    print_section("TEST RESULTS")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("✅ ALL TESTS PASSED!")
        print("\nYour AI Adviser module is fully functional:")
        print("  ✅ Environment configured")
        print("  ✅ API endpoints accessible")
        print("  ✅ Claude integration working")
        print("\n🎉 Ready for production!")
    else:
        print("❌ SOME TESTS FAILED")
        print("\nFailed components:")
        for component, passed in results.items():
            if not passed:
                print(f"  ❌ {component}")
        print("\nPlease review the error messages above and fix the issues.")
    
    print("\n" + "═" * 60)
    return all_passed


if __name__ == "__main__":
    import sys
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("⚠️  python-dotenv not installed, relying on system environment variables")
    
    success = run_integration_test()
    sys.exit(0 if success else 1)
