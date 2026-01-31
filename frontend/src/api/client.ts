import { config } from '../config/app';
import { AppErrorHandler, ErrorType } from '../types/errors';

interface InternalApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  errors?: string[];
  image_prompts?: T[];
}

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.makeRequest(endpoint, options, controller.signal);
      clearTimeout(timeoutId);
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleRequestError(error);
    }
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    signal: AbortSignal
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Use simple request headers to avoid preflight OPTIONS
    const headers: Record<string, string> = {};
    
    // Only add Content-Type for requests with body
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add Authorization header if token exists
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('API Client: Adding Authorization header with token:', token.substring(0, 20) + '...');
    } else {
      console.log('API Client: No auth token found');
    }
    
    // Add other headers if specified
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    return fetch(url, {
      ...options,
      signal,
      headers,
    });
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    
    return this.parseJsonResponse<T>(text);
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));
    throw AppErrorHandler.createError(
      ErrorType.API,
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status.toString(),
      { status: response.status, statusText: response.statusText }
    );
  }

  private parseJsonResponse<T>(text: string): T {
    try {
      return JSON.parse(text);
    } catch {
      throw AppErrorHandler.createError(
        ErrorType.UNKNOWN,
        `Invalid JSON response: ${text}`,
        'PARSE_ERROR'
      );
    }
  }

  private handleRequestError(error: unknown): never {
    if (error instanceof Error && error.name === 'AbortError') {
      throw AppErrorHandler.createError(ErrorType.TIMEOUT, 'Request timed out');
    }
    
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    
    throw AppErrorHandler.fromApiError(error);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'DELETE'
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(config.getApi());

export type { InternalApiResponse as ApiResponse };