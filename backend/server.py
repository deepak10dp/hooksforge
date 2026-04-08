from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage
from collections import defaultdict
import time

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM API Key
EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

# LLM client will be created per request

# Rate limiting per IP (in-memory, simple implementation)
rate_limit_storage = defaultdict(list)
RATE_LIMIT_REQUESTS = 12  # 10 requests per minute per IP
RATE_LIMIT_WINDOW = 60  # 60 seconds

def check_rate_limit(ip_address: str) -> bool:
    """Check if IP has exceeded rate limit"""
    now = time.time()
    # Clean old requests
    rate_limit_storage[ip_address] = [
        req_time for req_time in rate_limit_storage[ip_address]
        if now - req_time < RATE_LIMIT_WINDOW
    ]
    
    if len(rate_limit_storage[ip_address]) >= RATE_LIMIT_REQUESTS:
        return False
    
    rate_limit_storage[ip_address].append(now)
    return True

# Define Models
class GenerateHooksRequest(BaseModel):
    topic: str
    category: str = "General"
    tone: Optional[str] = None

class HookItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    text: str
    viral_score: int
    estimated_views: str

class GenerateHooksResponse(BaseModel):
    hooks: List[HookItem]
    captions: List[str]
    video_ideas: List[str]

class TrendingHook(BaseModel):
    model_config = ConfigDict(extra="ignore")
    text: str
    category: str
    viral_score: int

class HookOfTheDayResponse(BaseModel):
    hook: str
    category: str
    viral_score: int

# Helper function to detect language
def detect_language(text: str) -> str:
    """Simple language detection for English vs Hinglish"""
    # Check for common Hindi words in Latin script
    hinglish_keywords = ['kya', 'hai', 'tum', 'aap', 'matlab', 'karo', 'mat', 'galti', 'sab', 'agar', 'ye', 'wo', 'mein', 'ka', 'ki']
    text_lower = text.lower()
    for keyword in hinglish_keywords:
        if keyword in text_lower:
            return "hinglish"
    return "english"

# Hook generation using AI
async def generate_hooks_with_ai(topic: str, category: str, tone: Optional[str], language: str) -> GenerateHooksResponse:
    """Generate hooks using GPT-5.2 via Emergent LLM key"""
    
    # Prepare system message
    system_message = f"""
You are a viral social media content expert. Generate highly engaging hooks, captions, and video ideas.

Rules:
- Hooks must be maximum 12 words
- Hooks must be curiosity-driven and pattern-based
- Generate content in {language.upper()} language
- Category: {category}
- Tone: {tone if tone else 'General'}
- For Hinglish: Use natural Hinglish (e.g., 'ye galti mat karna', 'aisa mat karo')
- Make hooks extremely engaging and viral-worthy
"""

    user_prompt = f"""
Generate viral social media content for topic: "{topic}"

Provide:
1. 12 viral hooks (max 12 words each)
2. 3 short captions (social-ready)
3. 2 short video ideas (1-2 lines each)

Format your response as:
HOOKS:
1. [hook text]
2. [hook text]
...

CAPTIONS:
1. [caption text]
2. [caption text]
3. [caption text]

VIDEO IDEAS:
1. [video idea]
2. [video idea]
"""

    try:
        # Initialize LLM Chat with Emergent key
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"hookforge_{uuid.uuid4().hex[:8]}",
            system_message=system_message
        )
        chat.with_model("openai", "gpt-5.2")
        
        # Create message and get response
        user_message = UserMessage(text=user_prompt)
        result_text = await chat.send_message(user_message)
        
        # Parse response
        hooks = []
        captions = []
        video_ideas = []
        
        lines = result_text.strip().split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if 'HOOKS:' in line.upper():
                current_section = 'hooks'
                continue
            elif 'CAPTIONS:' in line.upper():
                current_section = 'captions'
                continue
            elif 'VIDEO IDEAS:' in line.upper():
                current_section = 'video_ideas'
                continue
            
            if line and line[0].isdigit() and '.' in line[:3]:
                content = line.split('.', 1)[1].strip()
                if current_section == 'hooks' and len(hooks) < 10:
                    viral_score = random.randint(65, 98)
                    views = random.choice(['10K', '50K', '100K', '500K', '1M+'])
                    hooks.append(HookItem(text=content, viral_score=viral_score, estimated_views=views))
                elif current_section == 'captions' and len(captions) < 3:
                    captions.append(content)
                elif current_section == 'video_ideas' and len(video_ideas) < 2:
                    video_ideas.append(content)
        
        # Ensure we have minimum required items
        if len(hooks) < 10:
            raise ValueError("Not enough hooks generated")
        if len(captions) < 3:
            raise ValueError("Not enough captions generated")
        if len(video_ideas) < 2:
            raise ValueError("Not enough video ideas generated")
        
        return GenerateHooksResponse(
            hooks=hooks[:12],
            captions=captions[:5],
            video_ideas=video_ideas[:5]
        )
        
    except Exception as e:
        logging.error(f"Error generating hooks with AI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate hooks: {str(e)}")

# Routes
@api_router.post("/generate-hooks", response_model=GenerateHooksResponse)
async def generate_hooks(request: GenerateHooksRequest, req: Request):
    """Generate viral hooks, captions, and video ideas"""
    
    # Get client IP for rate limiting
    client_ip = req.client.host
    
    # Check rate limit
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a moment before trying again."
        )
    
    # Validate input
    if not request.topic or len(request.topic.strip()) == 0:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    # Trim long inputs
    topic = request.topic[:200]
    
    # Detect language
    language = detect_language(topic)
    
    # Generate hooks using AI
    result = await generate_hooks_with_ai(topic, request.category, request.tone, language)
    
    return result

@api_router.get("/trending-hooks/{category}", response_model=List[TrendingHook])
async def get_trending_hooks(category: str = "General"):
    """Get trending hooks for specific category"""
    
    trending_by_category = {
        "General": [
            TrendingHook(text="Nobody tells you this about {topic}", category="General", viral_score=95),
            TrendingHook(text="I wasted years doing this wrong", category="General", viral_score=92),
            TrendingHook(text="This changed everything for me", category="General", viral_score=88),
            TrendingHook(text="Stop doing this immediately", category="General", viral_score=90),
            TrendingHook(text="The truth nobody wants you to know", category="General", viral_score=87),
        ],
        "Money": [
            TrendingHook(text="I made money while sleeping—here's how", category="Money", viral_score=96),
            TrendingHook(text="This side hustle changed my bank account", category="Money", viral_score=94),
            TrendingHook(text="Stop trading time for money", category="Money", viral_score=91),
            TrendingHook(text="Passive income secret nobody shares", category="Money", viral_score=93),
            TrendingHook(text="How I 10x my income in 6 months", category="Money", viral_score=89),
        ],
        "Gym": [
            TrendingHook(text="This workout mistake kills your gains", category="Gym", viral_score=94),
            TrendingHook(text="I transformed my body in 90 days", category="Gym", viral_score=92),
            TrendingHook(text="Stop doing cardio like this", category="Gym", viral_score=88),
            TrendingHook(text="The real secret to muscle growth", category="Gym", viral_score=90),
            TrendingHook(text="Why your workout isn't working", category="Gym", viral_score=87),
        ],
        "Tech": [
            TrendingHook(text="This AI tool replaced my entire workflow", category="Tech", viral_score=95),
            TrendingHook(text="Stop coding like this immediately", category="Tech", viral_score=91),
            TrendingHook(text="The tech skill nobody's teaching you", category="Tech", viral_score=89),
            TrendingHook(text="I automated my job in 3 hours", category="Tech", viral_score=93),
            TrendingHook(text="This coding mistake cost me months", category="Tech", viral_score=88),
        ],
        "Relationships": [
            TrendingHook(text="This saved my relationship overnight", category="Relationships", viral_score=94),
            TrendingHook(text="Stop doing this in your relationship", category="Relationships", viral_score=92),
            TrendingHook(text="The truth about modern dating", category="Relationships", viral_score=90),
            TrendingHook(text="Why your relationships keep failing", category="Relationships", viral_score=88),
            TrendingHook(text="This one habit strengthens any bond", category="Relationships", viral_score=91),
        ],
        "Study": [
            TrendingHook(text="I aced exams without studying 12 hours", category="Study", viral_score=93),
            TrendingHook(text="This study technique is game-changing", category="Study", viral_score=91),
            TrendingHook(text="Stop studying like this—it doesn't work", category="Study", viral_score=89),
            TrendingHook(text="How I memorize anything in minutes", category="Study", viral_score=90),
            TrendingHook(text="The study secret toppers hide from you", category="Study", viral_score=88),
        ],
    }
    
    return trending_by_category.get(category, trending_by_category["General"])

@api_router.get("/hook-of-the-day", response_model=HookOfTheDayResponse)
async def get_hook_of_the_day():
    """Get hook of the day"""
    hooks = [
        HookOfTheDayResponse(hook="This one mistake is costing you everything", category="General", viral_score=96),
        HookOfTheDayResponse(hook="Why everyone is doing this wrong", category="General", viral_score=94),
        HookOfTheDayResponse(hook="The secret nobody wants you to know", category="General", viral_score=93),
    ]
    # Return based on day of year for consistency
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    return hooks[day_of_year % len(hooks)]

@api_router.get("/")
async def root():
    return {"message": "Hooksforge API", "status": "online"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
