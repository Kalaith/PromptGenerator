export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  API = 'API',
  TIMEOUT = 'TIMEOUT',
  AUTH = 'AUTH',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export class AppErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    code?: string,
    details?: Record<string, unknown>
  ): AppError {
    const error: AppError = {
      type,
      message,
      timestamp: new Date(),
    };
    
    if (code !== undefined) {
      error.code = code;
    }
    
    if (details !== undefined) {
      error.details = details;
    }
    
    return error;
  }

  static fromApiError(error: unknown): AppError {
    const errorMessage = this.extractErrorMessage(error);
    
    if (error instanceof Error) {
      return this.handleKnownError(error);
    }
    
    return this.createError(
      ErrorType.UNKNOWN,
      errorMessage,
      undefined,
      { originalError: error }
    );
  }

  private static extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return 'An unknown error occurred';
  }

  private static handleKnownError(error: Error): AppError {
    if (error.name === 'AbortError') {
      return this.createError(ErrorType.TIMEOUT, 'Request timed out');
    }
    
    if (error.message.includes('fetch')) {
      return this.createError(ErrorType.NETWORK, 'Network error occurred');
    }
    
    if (error.message.includes('API Error')) {
      return this.createError(ErrorType.API, error.message);
    }
    
    return this.createError(
      ErrorType.UNKNOWN,
      error.message || 'An unknown error occurred',
      undefined,
      { originalError: error }
    );
  }

  static getDisplayMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Network connection failed. Please check your internet connection.';
      case ErrorType.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.API:
        return error.message.replace('API Error: ', '');
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return 'An unknown error occurred';
  }
}