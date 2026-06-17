import { SystemArchitecture } from './types';

export async function generateArchitecture(requirements: string): Promise<SystemArchitecture> {
  const response = await fetch('http://localhost:8001/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requirements
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate architecture from backend');
  }

  const data = await response.json();
  return data as SystemArchitecture;
}
