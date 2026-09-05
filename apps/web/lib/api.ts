const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function apiHealth() {
  const response = await fetch(`${API_URL}/health`, { cache: 'no-store' });
  if (!response.ok) throw new Error('API health check failed');
  return response.json() as Promise<{ status: string; service: string }>;
}
