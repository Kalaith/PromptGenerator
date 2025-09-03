import { APP_CONSTANTS } from '../constants/app';
import { ErrorType, AppError, AppErrorHandler } from '../types/errors';

export interface ValidationResult {
  isValid: boolean;
  error?: AppError;
}

export class ValidationUtils {
  static validatePromptCount(count: number): ValidationResult {
    const { MIN, MAX } = APP_CONSTANTS.PROMPT_COUNT;
    
    if (!Number.isInteger(count)) {
      return {
        isValid: false,
        error: AppErrorHandler.createError(
          ErrorType.VALIDATION,
          'Prompt count must be a whole number'
        ),
      };
    }
    
    if (count < MIN || count > MAX) {
      return {
        isValid: false,
        error: AppErrorHandler.createError(
          ErrorType.VALIDATION,
          `Prompt count must be between ${MIN} and ${MAX}`
        ),
      };
    }
    
    return { isValid: true };
  }

  static validateStringInput(
    value: string,
    fieldName: string,
    required = false
  ): ValidationResult {
    if (required && (!value || value.trim().length === 0)) {
      return {
        isValid: false,
        error: AppErrorHandler.createError(
          ErrorType.VALIDATION,
          `${fieldName} is required`
        ),
      };
    }
    
    if (value && value.length > APP_CONSTANTS.VALIDATION.MAX_STRING_LENGTH) {
      return {
        isValid: false,
        error: AppErrorHandler.createError(
          ErrorType.VALIDATION,
          `${fieldName} must be less than ${APP_CONSTANTS.VALIDATION.MAX_STRING_LENGTH} characters`
        ),
      };
    }
    
    return { isValid: true };
  }

  static sanitizePromptCount(input: string | number): number {
    const num = typeof input === 'string' ? Number(input) : input;
    
    if (!Number.isFinite(num)) {
      return APP_CONSTANTS.PROMPT_COUNT.DEFAULT;
    }
    
    return Math.max(
      APP_CONSTANTS.PROMPT_COUNT.MIN,
      Math.min(APP_CONSTANTS.PROMPT_COUNT.MAX, Math.floor(num))
    );
  }

  static sanitizeStringInput(input: string): string {
    return input.trim().slice(0, APP_CONSTANTS.VALIDATION.MAX_STRING_LENGTH);
  }

  static isValidOption(value: string, validOptions: readonly string[]): boolean {
    return validOptions.includes(value);
  }
}