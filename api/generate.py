"""
ArchitectAI — Vercel Serverless Python Agent
Endpoint: POST /api/generate
"""

import json
import os
from http.server import BaseHTTPRequestHandler
from openai import OpenAI

# ─────────────────────────────────────────────
# STEP 1: Rule-Based Complexity Scoring Engine
# ─────────────────────────────────────────────

COMPLEXITY_SIGNALS = {
    # High complexity (+2)
    "real-time": 2, "realtime": 2, "websocket": 2, "socket.io": 2,
    "machine learning": 2, "ml model": 2, "ai model": 2, "deep learning": 2,
    "payment": 2, "stripe": 2, "billing": 2, "subscription": 2,
    "microservice": 2, "kubernetes": 2, "distributed": 2,
    "blockchain": 2, "smart contract": 2,
    "video streaming": 2, "live stream": 2, "webrtc": 2,
    "recommendation": 2, "search engine": 2, "elasticsearch": 2,
    # Medium complexity (+1)
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
    # Baseline (0)
    "crud": 0, "todo": 0, "blog": 0, "simple": 0,
}

ENTITY_KEYWORDS = [
    "user", "product", "order", "post", "comment", "message",
    "payment", "invoice", "report", "review", "category",
    "notification", "session", "profile", "subscription"
]

BENCHMARK_CALIBRATION = """
## Calibration Benchmarks (use as anchors):
| Project Type         | Complexity | Team Size | Timeline    |
|----------------------|------------|-----------|-------------|
| Todo / Notes App     | Low        | 1-2 devs  | 1-3 weeks   |
| Blog / CMS           | Low        | 2-3 devs  | 3-6 weeks   |
| E-commerce Store     | Medium     | 3-5 devs  | 8-14 weeks  |
| Social Media App     | High       | 6-9 devs  | 16-24 weeks |
| Slack / Chat Clone   | High       | 6-8 devs  | 14-20 weeks |
| Netflix Clone        | High       | 10+ devs  | 24-36 weeks |
| SaaS Dashboard       | Medium     | 4-6 devs  | 10-18 weeks |
| AI-powered Tool      | Medium     | 3-5 devs  | 8-14 weeks  |
"""


def analyze_complexity(text: str) -> dict:
    text_lower = text.lower()
    score = 0
    signals = []

    for keyword, weight in COMPLEXITY_SIGNALS.items():
        if keyword in text_lower:
            score += weight
            if weight > 0:
                signals.append(f"{keyword} (+{weight})")

    entity_count = sum(1 for e in ENTITY_KEYWORDS if e in text_lower)
    entity_score = max(0, entity_count - 2)
    score += entity_score
    if entity_score > 0:
        signals.append(f"{entity_count} data entities (+{entity_score})")

    if score >= 6:
        return {"complexity": "High",   "team_size": 8, "team_range": "7-10", "timeline": "16-28 weeks", "score": score, "signals": signals}
    elif score >= 3:
        return {"complexity": "Medium", "team_size": 4, "team_range": "3-6",  "timeline": "8-16 weeks",  "score": score, "signals": signals}
    else:
        return {"complexity": "Low",    "team_size": 2, "team_range": "1-3",  "timeline": "2-8 weeks",   "score": score, "signals": signals}


def build_system_prompt(a: dict) -> str:
    signals_text = ", ".join(a["signals"]) if a["signals"] else "basic features only"
    return f"""You are a senior software architect. Given a requirements document, generate a complete system design in valid JSON format only. No markdown, no explanation outside the JSON.

## Pre-computed Complexity Analysis (LOCKED — do NOT override):
- Complexity Level: {a['complexity']}
- Team Size: {a['team_size']} engineers (range: {a['team_range']})
- Timeline: {a['timeline']}
- Detected signals: {signals_text}

{BENCHMARK_CALIBRATION}

## Chain-of-Thought (reason before generating):
1. What are the core features?
2. Which detected signals drive complexity?
3. What architectural patterns best fit this complexity level?
4. What are the top 3 risks for this project?
5. How should sprints be structured given the timeline?

Return exactly this JSON structure:
{{
  "overview": {{
    "projectName": "string",
    "summary": "2-3 sentence description",
    "techStack": ["string"],
    "complexity": "{a['complexity']}",
    "estimatedTeamSize": {a['team_size']},
    "estimatedTimeline": "{a['timeline']}"
  }},
  "architecture": {{
    "components": [
      {{"id": "string", "name": "string", "type": "frontend|backend|database|service|external", "description": "string", "connections": ["string"]}}
    ],
    "layers": ["Presentation", "Business Logic", "Data", "Infrastructure"]
  }},
  "database": {{
    "tables": [
      {{"name": "string", "fields": [{{"name": "string", "type": "string", "constraints": "string"}}], "relationships": ["string"]}}
    ]
  }},
  "api": {{
    "baseUrl": "string",
    "endpoints": [
      {{"method": "GET|POST|PUT|DELETE|PATCH", "path": "string", "description": "string", "auth": true, "requestBody": "string|null", "response": "string"}}
    ]
  }},
  "sprints": [
    {{"number": 1, "name": "string", "duration": "string", "goals": ["string"], "tasks": [{{"task": "string", "points": 1, "priority": "High|Medium|Low"}}]}}
  ],
  "risks": [
    {{"title": "string", "description": "string", "severity": "Critical|High|Medium|Low", "mitigation": "string"}}
  ]
}}"""


# ─────────────────────────────────────────────
# Vercel Serverless Handler
# ─────────────────────────────────────────────

class handler(BaseHTTPRequestHandler):

    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        """Health check"""
        self.send_response(200)
        self._cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "agent": "ArchitectAI v2"}).encode())

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            requirements = body.get('requirements', '').strip()

            if not requirements:
                raise ValueError("requirements field is empty")

            api_key = os.environ.get('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OPENAI_API_KEY is not configured")

            client = OpenAI(api_key=api_key)

            # Run complexity scorer
            analysis = analyze_complexity(requirements)
            system_prompt = build_system_prompt(analysis)

            # Call OpenAI
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": requirements}
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )

            result = json.loads(response.choices[0].message.content)

            # Hard-override with Python-computed values (model cannot hallucinate these)
            result["overview"]["complexity"]         = analysis["complexity"]
            result["overview"]["estimatedTeamSize"]  = analysis["team_size"]
            result["overview"]["estimatedTimeline"]  = analysis["timeline"]

            # Attach debug metadata
            result["_meta"] = {
                "complexity_score": analysis["score"],
                "detected_signals": analysis["signals"],
            }

            self.send_response(200)
            self._cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self._cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"detail": str(e)}).encode())
