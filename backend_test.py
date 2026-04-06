import requests
import sys
import json
from datetime import datetime

class HookForgeAPITester:
    def __init__(self, base_url="https://content-spark-87.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response preview: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({
                'test': name,
                'error': f'Timeout after {timeout}s'
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_trending_hooks(self):
        """Test trending hooks endpoint"""
        success, response = self.run_test("Trending Hooks", "GET", "trending-hooks", 200)
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} trending hooks")
            # Validate structure
            first_hook = response[0]
            required_fields = ['text', 'category', 'viral_score']
            for field in required_fields:
                if field not in first_hook:
                    print(f"   ⚠️  Missing field '{field}' in trending hook")
                    return False
            print(f"   Sample hook: {first_hook['text'][:50]}...")
            return True
        return success

    def test_hook_of_the_day(self):
        """Test hook of the day endpoint"""
        success, response = self.run_test("Hook of the Day", "GET", "hook-of-the-day", 200)
        if success and isinstance(response, dict):
            required_fields = ['hook', 'category', 'viral_score']
            for field in required_fields:
                if field not in response:
                    print(f"   ⚠️  Missing field '{field}' in hook of the day")
                    return False
            print(f"   Hook: {response['hook'][:50]}...")
            print(f"   Category: {response['category']}, Score: {response['viral_score']}")
            return True
        return success

    def test_generate_hooks_basic(self):
        """Test basic hook generation"""
        data = {
            "topic": "productivity tips",
            "category": "General"
        }
        success, response = self.run_test("Generate Hooks - Basic", "POST", "generate-hooks", 200, data, timeout=60)
        if success and isinstance(response, dict):
            required_fields = ['hooks', 'captions', 'video_ideas']
            for field in required_fields:
                if field not in response:
                    print(f"   ⚠️  Missing field '{field}' in response")
                    return False
            
            # Validate hooks structure
            hooks = response.get('hooks', [])
            if len(hooks) != 10:
                print(f"   ⚠️  Expected 10 hooks, got {len(hooks)}")
                return False
            
            # Check first hook structure
            if hooks:
                first_hook = hooks[0]
                hook_fields = ['text', 'viral_score', 'estimated_views']
                for field in hook_fields:
                    if field not in first_hook:
                        print(f"   ⚠️  Missing field '{field}' in hook")
                        return False
                print(f"   Sample hook: {first_hook['text']}")
                print(f"   Viral score: {first_hook['viral_score']}, Views: {first_hook['estimated_views']}")
            
            # Validate captions and video ideas
            captions = response.get('captions', [])
            video_ideas = response.get('video_ideas', [])
            
            if len(captions) != 3:
                print(f"   ⚠️  Expected 3 captions, got {len(captions)}")
                return False
            
            if len(video_ideas) != 2:
                print(f"   ⚠️  Expected 2 video ideas, got {len(video_ideas)}")
                return False
            
            print(f"   Generated {len(hooks)} hooks, {len(captions)} captions, {len(video_ideas)} video ideas")
            return True
        return success

    def test_generate_hooks_with_category_and_tone(self):
        """Test hook generation with specific category and tone"""
        data = {
            "topic": "building muscle",
            "category": "Gym",
            "tone": "Motivational"
        }
        success, response = self.run_test("Generate Hooks - Category & Tone", "POST", "generate-hooks", 200, data, timeout=60)
        if success and isinstance(response, dict):
            hooks = response.get('hooks', [])
            if hooks:
                print(f"   Sample gym hook: {hooks[0]['text']}")
            return True
        return success

    def test_generate_hooks_hinglish(self):
        """Test hook generation with Hinglish detection"""
        data = {
            "topic": "paisa kamane ke tarike",
            "category": "Money"
        }
        success, response = self.run_test("Generate Hooks - Hinglish", "POST", "generate-hooks", 200, data, timeout=60)
        if success and isinstance(response, dict):
            hooks = response.get('hooks', [])
            if hooks:
                print(f"   Sample Hinglish hook: {hooks[0]['text']}")
            return True
        return success

    def test_generate_hooks_empty_topic(self):
        """Test hook generation with empty topic (should fail)"""
        data = {
            "topic": "",
            "category": "General"
        }
        success, response = self.run_test("Generate Hooks - Empty Topic", "POST", "generate-hooks", 400, data)
        return success

    def test_generate_hooks_long_topic(self):
        """Test hook generation with very long topic"""
        data = {
            "topic": "a" * 300,  # Very long topic
            "category": "General"
        }
        success, response = self.run_test("Generate Hooks - Long Topic", "POST", "generate-hooks", 200, data, timeout=60)
        return success

def main():
    print("🚀 Starting HookForge API Tests...")
    print("=" * 50)
    
    tester = HookForgeAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_trending_hooks,
        tester.test_hook_of_the_day,
        tester.test_generate_hooks_basic,
        tester.test_generate_hooks_with_category_and_tone,
        tester.test_generate_hooks_hinglish,
        tester.test_generate_hooks_empty_topic,
        tester.test_generate_hooks_long_topic,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
            tester.failed_tests.append({
                'test': test.__name__,
                'error': f'Test crashed: {str(e)}'
            })
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"   - {failure['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())