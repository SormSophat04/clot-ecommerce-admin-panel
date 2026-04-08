import { API_CONFIG } from './config';

// Token storage key
const TOKEN_KEY = 'auth_token';

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token
export const removeToken = (): void => {
  if (localStorage.getItem(TOKEN_KEY)) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// API Error class
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Request options type
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

interface ApiEnvelope<T> {
  data: T;
  success?: boolean;
  message?: string;
  error?: unknown;
}

const isApiEnvelope = <T>(value: unknown): value is ApiEnvelope<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return (
    'data' in value &&
    ('success' in value || 'message' in value || 'error' in value)
  );
};

const getErrorMessage = (status: number, payload: unknown): string => {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as { message?: unknown }).message === 'string'
  ) {
    return (payload as { message: string }).message;
  }

  return `HTTP ${status}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const rawText = await response.text();
  if (!rawText) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawText);
    } catch {
      return rawText;
    }
  }

  return rawText;
};

// Base API client
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers = new Headers(fetchOptions.headers);
    const isMultipartBody = fetchOptions.body instanceof FormData;
    if (!isMultipartBody && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add auth token if not skipped
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
        }
        const errorData = await parseResponseBody(response);
        throw new ApiError(
          response.status,
          getErrorMessage(response.status, errorData),
          errorData
        );
      }

      const payload = await parseResponseBody(response);
      if (isApiEnvelope<T>(payload)) {
        return payload.data;
      }

      return payload as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }

      throw new ApiError(500, 'Network error. Please try again.');
    }
  },

  // HTTP methods
  get<T>(endpoint: string, options?: RequestOptions) {
    return apiClient.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body,
    });
  },

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return apiClient.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
