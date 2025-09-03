import React from 'react';
import { FormField } from './FormField';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password' | 'url';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
  'data-testid'?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  disabled = false,
  required = false,
  error,
  helpText,
  placeholder,
  maxLength,
  minLength,
  className = '',
  'data-testid': testId,
}) => (
  <FormField
    className={className}
    data-testid={testId}
    error={error}
    helpText={helpText}
    id={id}
    label={label}
    required={required}
  >
    <input
      className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      disabled={disabled}
      id={id}
      maxLength={maxLength}
      minLength={minLength}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  </FormField>
);