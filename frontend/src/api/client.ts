import { config } from '../config/app';
import { AppErrorHandler, ErrorType } from '../types/errors';

interface ApiResponse<T> {
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
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw AppErrorHandler.createError(
          ErrorType.API,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
          { status: response.status, statusText: response.statusText }
        );
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', text);
        throw AppErrorHandler.createError(
          ErrorType.UNKNOWN,
          `Invalid JSON response: ${text}`,
          'PARSE_ERROR'
        );
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw AppErrorHandler.createError(ErrorType.TIMEOUT, 'Request timed out');
      }
      
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }
      
      throw AppErrorHandler.fromApiError(error);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(config.getApi());

export type { ApiResponse };