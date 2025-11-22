"""
RISKCAST v16 - Direct Claude API Test
Test Claude API connection directly
"""

from anthropic import Anthropic
import os
from dotenv import load_dotenv

load_dotenv()

def test_claude_api():
    """Test Claude API directly"""
    print("=" * 60)
    print("  DIRECT CLAUDE API TEST")
    print("=" * 60)
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found in environment")
        print("   Please set it in .env file")
        return False
    
    if api_key == "your_anthropic_api_key_here":
        print("❌ ANTHROPIC_API_KEY is still placeholder")
        return False
    
    print(f"✅ API Key found: {api_key[:15]}...")
    
    try:
        client = Anthropic(api_key=api_key)
        
        print("\nCalling Claude API...")
        response = client.messages.create(
            model="claude-3-sonnet-20250214",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=50
        )
        
        print("✅ Claude API call successful!")
        print(f"Response: {response.content[0].text}")
        return True
        
    except Exception as e:
        print(f"❌ Claude API error: {str(e)}")
        return False

if __name__ == "__main__":
    import sys
    success = test_claude_api()
    sys.exit(0 if success else 1)




