import { SystemArchitecture } from './types';

// In production, set VITE_BACKEND_URL to your deployed Railway URL
// e.g. VITE_BACKEND_URL=https://architectai-backend.up.railway.app
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

export async function generateArchitecture(requirements: string): Promise<SystemArchitecture> {
  const response = await fetch(`${BACKEND_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requirements })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Backend error: ${response.status}`);
  }

  return response.json() as Promise<SystemArchitecture>;
}
