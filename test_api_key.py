#!/usr/bin/env python3
"""
RISKCAST v16 - Test Anthropic API Key
Kiểm tra xem API key có hợp lệ không
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from anthropic import Anthropic, APIError

def test_api_key():
    """Test API key validity"""
    print("=" * 60)
    print("  RISKCAST v16 - API Key Test")
    print("=" * 60)
    print()
    
    # Load .env
    project_root = Path(__file__).parent
    env_path = project_root / ".env"
    
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
        print(f"[OK] Loaded .env from: {env_path}")
    else:
        load_dotenv()
        print("[WARNING] Using default .env location")
    
    # Get API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        print()
        print("[ERROR] ANTHROPIC_API_KEY not found in environment")
        print()
        print("Please:")
        print("1. Open file: .env")
        print("2. Add line: ANTHROPIC_API_KEY=your_api_key_here")
        print("3. Get API key from: https://console.anthropic.com/")
        return False
    
    if api_key == "your_anthropic_api_key_here" or api_key.startswith("your_"):
        print()
        print("[ERROR] ANTHROPIC_API_KEY is still placeholder")
        print("Please replace with actual API key")
        return False
    
    print()
    print(f"[OK] API Key found: {api_key[:20]}...")
    print(f"      Length: {len(api_key)} characters")
    print()
    
    # Test API key
    print("Testing API key with Anthropic API...")
    print()
    
    try:
        client = Anthropic(api_key=api_key)
        
        # Try a simple API call
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=10,
            messages=[{"role": "user", "content": "Say hello"}]
        )
        
        print("[SUCCESS] API key is VALID!")
        print(f"Response: {response.content[0].text}")
        print()
        print("=" * 60)
        print("  [OK] API Key is working correctly!")
        print("=" * 60)
        return True
        
    except APIError as e:
        print()
        print("[ERROR] API key is INVALID or EXPIRED")
        print()
        
        if hasattr(e, 'status_code'):
            if e.status_code == 401:
                print("Error: Authentication failed (401)")
                print("This means:")
                print("  - API key is incorrect")
                print("  - API key has expired")
                print("  - API key has been revoked")
            elif e.status_code == 429:
                print("Error: Rate limit exceeded (429)")
                print("Please wait a moment and try again")
            else:
                print(f"Error: HTTP {e.status_code}")
        else:
            print(f"Error: {str(e)}")
        
        print()
        print("To fix this:")
        print("1. Go to: https://console.anthropic.com/")
        print("2. Navigate to Settings -> API Keys")
        print("3. Create a new API key")
        print("4. Copy the new API key")
        print("5. Update .env file:")
        print("   ANTHROPIC_API_KEY=your_new_api_key_here")
        print("6. Restart the server")
        print()
        print("=" * 60)
        print("  [ERROR] API Key needs to be updated")
        print("=" * 60)
        return False
        
    except Exception as e:
        print()
        print(f"[ERROR] Unexpected error: {str(e)}")
        print()
        print("Please check:")
        print("  - Internet connection")
        print("  - API key format")
        print("  - Anthropic service status")
        return False

if __name__ == "__main__":
    success = test_api_key()
    exit(0 if success else 1)
