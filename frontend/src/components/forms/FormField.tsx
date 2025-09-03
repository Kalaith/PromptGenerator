import React, { useId, type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  children: ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  id, 
  children, 
  error, 
  helpText, 
  required = false,
  className = '',
  'data-testid': testId,
}) => {
  const errorId = useId();
  const helpId = useId();
  
  return (
    <div className={`mb-4 ${className}`} data-testid={testId}>
      <label 
        className="block text-sm font-medium mb-2" 
        htmlFor={id}
      >
        {label}
        {required && <span aria-label="required" className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText && (
        <div className="mt-1 text-sm text-gray-600" id={helpId}>
          {helpText}
        </div>
      )}
      {error && (
        <div className="mt-1 text-sm text-red-600" id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};