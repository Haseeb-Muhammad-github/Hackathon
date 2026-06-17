import { SystemArchitecture } from './types';

const SYSTEM_PROMPT = `You are a senior software architect. Given a requirements document, generate a complete system design in valid JSON format only. No markdown, no explanation outside the JSON.
Return exactly this structure:
{
  "overview": {
    "projectName": string,
    "summary": string (2-3 sentences),
    "techStack": string[],
    "complexity": "Low" | "Medium" | "High",
    "estimatedTeamSize": number,
    "estimatedTimeline": string
  },
  "architecture": {
    "components": [
      {
        "id": string,
        "name": string,
        "type": "frontend" | "backend" | "database" | "service" | "external",
        "description": string,
        "connections": string[] (ids this connects to)
      }
    ],
    "layers": ["Presentation", "Business Logic", "Data", "Infrastructure"]
  },
  "database": {
    "tables": [
      {
        "name": string,
        "fields": [
          { "name": string, "type": string, "constraints": string }
        ],
        "relationships": string[]
      }
    ]
  },
  "api": {
    "baseUrl": string,
    "endpoints": [
      {
        "method": "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        "path": string,
        "description": string,
        "auth": boolean,
        "requestBody": string | null,
        "response": string
      }
    ]
  },
  "sprints": [
    {
      "number": number,
      "name": string,
      "duration": string,
      "goals": string[],
      "tasks": [
        { "task": string, "points": number, "priority": "High" | "Medium" | "Low" }
      ]
    }
  ],
  "risks": [
    {
      "title": string,
      "description": string,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "mitigation": string
    }
  ]
}`;

export async function generateArchitecture(requirements: string): Promise<SystemArchitecture> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY environment variable is missing.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: requirements }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to generate architecture');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content) as SystemArchitecture;
}
