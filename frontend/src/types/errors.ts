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
  details?: Record<string, any>;
  timestamp: Date;
}

export class AppErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    code?: string,
    details?: Record<string, any>
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

  static fromApiError(error: any): AppError {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return this.createError(ErrorType.TIMEOUT, 'Request timed out');
      }
      
      if (error.message.includes('fetch')) {
        return this.createError(ErrorType.NETWORK, 'Network error occurred');
      }
      
      if (error.message.includes('API Error')) {
        return this.createError(ErrorType.API, error.message);
      }
    }
    
    return this.createError(
      ErrorType.UNKNOWN,
      error?.message || 'An unknown error occurred',
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
}