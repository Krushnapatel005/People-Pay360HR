export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || data?.message || 'An API error occurred');
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  data?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiClient<T = any>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: FetchOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : '',
      ...customHeaders,
    },
    credentials: 'include', // Important for cookies (JWT auth)
    ...customConfig,
  };

  if (config.method === 'GET' && config.headers) {
    const headers = config.headers as Record<string, string>;
    if (headers['Content-Type'] === '') {
      delete headers['Content-Type'];
    }
  }

  let response: Response;
  try {
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // If baseUrl already ends with /api and endpoint starts with /api, remove it to prevent double /api
    const finalUrl = (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api')) 
      ? `${baseUrl}${cleanEndpoint.replace('/api', '')}`
      : `${baseUrl}${cleanEndpoint}`;
      
    response = await fetch(finalUrl, config);
  } catch (error) {
    throw new Error('Network error. Please try again.');
  }

  if (response.status === 401) {
    // Optionally trigger a global redirect to /login here if in browser,
    // though usually handled by TanStack Query onError globally or in route guards.
    if (typeof window !== 'undefined' && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/me')) {
      window.location.href = '/login';
    }
  }

  if (response.status === 403) {
    if (typeof window !== 'undefined') {
       window.location.href = '/403'; // Permission Denied page
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
