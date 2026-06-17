import { SystemArchitecture } from './types';

// On Vercel: calls /api/generate (same domain, no CORS)
// Locally: falls back to the Python dev server on port 8001
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export async function generateArchitecture(requirements: string): Promise<SystemArchitecture> {
  const url = BACKEND_URL
    ? `${BACKEND_URL}/generate`   // local dev → http://localhost:8001/generate
    : '/api/generate';             // Vercel production → /api/generate

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requirements }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Backend error: ${response.status}`);
  }

  return response.json() as Promise<SystemArchitecture>;
}
