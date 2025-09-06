import React from 'react';
import { AppError, ErrorType } from '../../types/errors';

interface ErrorDisplayProps {
  error: AppError | null;
  onDismiss?: () => void;
  variant?: 'inline' | 'toast' | 'modal';
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  variant = 'inline',
  size = 'md',
}) => {
  if (!error) return null;

  const getErrorIcon = (type: ErrorType): string => {
    switch (type) {
      case ErrorType.VALIDATION:
        return '⚠️';
      case ErrorType.API:
        return '🔌';
      case ErrorType.TIMEOUT:
        return '⏱️';
      case ErrorType.NETWORK:
        return '📡';
      case ErrorType.AUTH:
        return '🔐';
      default:
        return '❌';
    }
  };

  const getErrorSeverityClass = (type: ErrorType): string => {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case ErrorType.API:
      case ErrorType.NETWORK:
        return 'bg-red-50 border-red-200 text-red-800';
      case ErrorType.TIMEOUT:
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case ErrorType.AUTH:
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getSizeClass = (size: string): string => {
    switch (size) {
      case 'sm':
        return 'p-2 text-sm';
      case 'lg':
        return 'p-6 text-lg';
      default:
        return 'p-4 text-base';
    }
  };

  const getVariantClass = (variant: string): string => {
    switch (variant) {
      case 'toast':
        return 'fixed top-4 right-4 z-50 max-w-md shadow-lg';
      case 'modal':
        return 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
      default:
        return 'mb-6';
    }
  };

  const baseClass = `
    ${getErrorSeverityClass(error.type)}
    ${getSizeClass(size)}
    ${getVariantClass(variant)}
    border rounded-xl flex items-start gap-3 animate-fade-in
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <div className={baseClass} role="alert" aria-live="assertive">
      <span className="text-xl flex-shrink-0">{getErrorIcon(error.type)}</span>
      <div className="flex-1">
        <div className="font-medium">{error.message}</div>
        {error.details && (
          <div className="text-sm mt-1 opacity-75">
            {typeof error.details === 'string' 
              ? error.details 
              : JSON.stringify(error.details, null, 2)
            }
          </div>
        )}
        {error.code && (
          <div className="text-xs mt-2 opacity-50">Error Code: {error.code}</div>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className={getVariantClass(variant)}>
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return content;
};