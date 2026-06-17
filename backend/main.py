import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class GenerationRequest(BaseModel):
    requirements: str


# ─────────────────────────────────────────────
# STEP 1: Rule-Based Complexity Scoring Engine
# ─────────────────────────────────────────────

COMPLEXITY_SIGNALS = {
    # High complexity signals (+2)
    "real-time": 2, "realtime": 2, "websocket": 2, "socket.io": 2,
    "machine learning": 2, "ml model": 2, "ai model": 2, "deep learning": 2,
    "payment": 2, "stripe": 2, "billing": 2, "subscription": 2,
    "microservice": 2, "kubernetes": 2, "distributed": 2,
    "blockchain": 2, "smart contract": 2,
    "video streaming": 2, "live stream": 2, "webrtc": 2,
    "recommendation": 2, "search engine": 2, "elasticsearch": 2,

    # Medium complexity signals (+1)
    "authentication": 1, "auth": 1, "login": 1, "oauth": 1, "jwt": 1,
    "file upload": 1, "s3": 1, "cloud storage": 1,
    "notification": 1, "email": 1, "sms": 1, "push notification": 1,
    "third-party api": 1, "integration": 1, "webhook": 1,
    "mobile app": 1, "ios": 1, "android": 1, "react native": 1,
    "dashboard": 1, "analytics": 1, "reporting": 1, "chart": 1,
    "role": 1, "permission": 1, "rbac": 1, "admin": 1,
    "cache": 1, "redis": 1, "queue": 1, "celery": 1,
    "geolocation": 1, "map": 1, "gps": 1,
    "multi-tenant": 1, "saas": 1, "multi-language": 1,

    # Low complexity signals (0, just basic features)
    "crud": 0, "todo": 0, "blog": 0, "simple": 0,
}

BENCHMARK_CALIBRATION = """
## Calibration Benchmarks (use these as anchors):
| Project Type         | Complexity | Team Size | Timeline    |
|----------------------|------------|-----------|-------------|
| Todo / Notes App     | Low        | 1-2 devs  | 1-3 weeks   |
| Blog / CMS           | Low        | 2-3 devs  | 3-6 weeks   |
| E-commerce Store     | Medium     | 3-5 devs  | 8-14 weeks  |
| Social Media App     | High       | 6-9 devs  | 16-24 weeks |
| Slack / Chat Clone   | High       | 6-8 devs  | 14-20 weeks |
| Netflix Clone        | High       | 10+ devs  | 24-36 weeks |
| Uber / Maps App      | High       | 8-12 devs | 20-30 weeks |
| SaaS Dashboard       | Medium     | 4-6 devs  | 10-18 weeks |
| AI-powered Tool      | Medium     | 3-5 devs  | 8-14 weeks  |
"""


def analyze_complexity(text: str) -> dict:
    """
    Rule-based scoring engine that analyzes the requirements text
    and returns a grounded complexity estimate with reasoning.
    """
    text_lower = text.lower()
    score = 0
    matched_signals = []

    for signal, weight in COMPLEXITY_SIGNALS.items():
        if signal in text_lower:
            score += weight
            if weight > 0:
                matched_signals.append(f"{signal} (+{weight})")

    # Count distinct entities (tables/models mentioned)
    entity_keywords = ["user", "product", "order", "post", "comment", "message",
                       "payment", "invoice", "report", "review", "category",
                       "notification", "session", "profile", "subscription"]
    entity_count = sum(1 for e in entity_keywords if e in text_lower)
    entity_score = max(0, (entity_count - 2))  # >2 entities add score
    score += entity_score
    if entity_score > 0:
        matched_signals.append(f"{entity_count} data entities (+{entity_score})")

    # Determine final complexity bucket
    if score >= 6:
        complexity = "High"
        team_size_range = "7-10"
        team_size = 8
        timeline = "16-28 weeks"
    elif score >= 3:
        complexity = "Medium"
        team_size_range = "3-6"
        team_size = 4
        timeline = "8-16 weeks"
    else:
        complexity = "Low"
        team_size_range = "1-3"
        team_size = 2
        timeline = "2-8 weeks"

    return {
        "complexity": complexity,
        "team_size": team_size,
        "team_size_range": team_size_range,
        "timeline": timeline,
        "score": score,
        "signals": matched_signals,
        "entity_count": entity_count,
    }


# ─────────────────────────────────────────────
# STEP 2: Build the Grounded System Prompt
# ─────────────────────────────────────────────

def build_system_prompt(analysis: dict) -> str:
    signals_text = ", ".join(analysis["signals"]) if analysis["signals"] else "basic features only"

    return f"""You are a senior software architect. Given a requirements document, generate a complete system design in valid JSON format only. No markdown, no explanation outside the JSON.

## Pre-computed Complexity Analysis (use this as ground truth — DO NOT override these values):
- Complexity Score: {analysis['score']} points
- Detected Signals: {signals_text}
- Data Entities Detected: {analysis['entity_count']}
- **Complexity Level: {analysis['complexity']}** (LOCKED — do not change)
- **Estimated Team Size: {analysis['team_size']} engineers** (range: {analysis['team_size_range']}) (LOCKED)
- **Estimated Timeline: {analysis['timeline']}** (LOCKED)

{BENCHMARK_CALIBRATION}

## Chain-of-Thought Reasoning (reason through this before generating):
1. What are the core features described? List them mentally.
2. Which of the detected signals drive the complexity?
3. What architectural patterns are most appropriate given the complexity level?
4. What are the top 3 technical risks for this specific project?
5. How would you break this into sprints given the timeline?

Now generate the complete architecture JSON using the LOCKED complexity/team/timeline values above.

Return exactly this structure:
{{
  "overview": {{
    "projectName": "string",
    "summary": "string (2-3 sentences)",
    "techStack": ["string"],
    "complexity": "{analysis['complexity']}",
    "estimatedTeamSize": {analysis['team_size']},
    "estimatedTimeline": "{analysis['timeline']}"
  }},
  "architecture": {{
    "components": [
      {{
        "id": "string",
        "name": "string",
        "type": "frontend" | "backend" | "database" | "service" | "external",
        "description": "string",
        "connections": ["string"]
      }}
    ],
    "layers": ["Presentation", "Business Logic", "Data", "Infrastructure"]
  }},
  "database": {{
    "tables": [
      {{
        "name": "string",
        "fields": [
          {{ "name": "string", "type": "string", "constraints": "string" }}
        ],
        "relationships": ["string"]
      }}
    ]
  }},
  "api": {{
    "baseUrl": "string",
    "endpoints": [
      {{
        "method": "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        "path": "string",
        "description": "string",
        "auth": true,
        "requestBody": "string | null",
        "response": "string"
      }}
    ]
  }},
  "sprints": [
    {{
      "number": 1,
      "name": "string",
      "duration": "string",
      "goals": ["string"],
      "tasks": [
        {{ "task": "string", "points": 1, "priority": "High" | "Medium" | "Low" }}
      ]
    }}
  ],
  "risks": [
    {{
      "title": "string",
      "description": "string",
      "severity": "Critical" | "High" | "Medium" | "Low",
      "mitigation": "string"
    }}
  ]
}}"""


# ─────────────────────────────────────────────
# STEP 3: API Endpoint
# ─────────────────────────────────────────────

@app.post("/generate")
async def generate_architecture(req: GenerationRequest):
    if not client.api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")

    # Run rule-based scoring first
    analysis = analyze_complexity(req.requirements)

    # Build grounded prompt with locked values
    system_prompt = build_system_prompt(analysis)

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.requirements}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        result = json.loads(content)

        # Safety: Force our computed values into the response
        # so the model can't override them even if it tries
        result["overview"]["complexity"] = analysis["complexity"]
        result["overview"]["estimatedTeamSize"] = analysis["team_size"]
        result["overview"]["estimatedTimeline"] = analysis["timeline"]

        # Attach debug info for transparency (optional, can remove)
        result["_meta"] = {
            "complexity_score": analysis["score"],
            "detected_signals": analysis["signals"],
            "entity_count": analysis["entity_count"]
        }

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "model": "gpt-4o", "agent": "ArchitectAI v2"}
