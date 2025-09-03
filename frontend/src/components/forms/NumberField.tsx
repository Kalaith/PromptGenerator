import React from 'react';
import { FormField } from './FormField';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  step = 1,
  disabled = false,
  required = false,
  error,
  helpText,
  placeholder,
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
      max={max}
      min={min}
      onBlur={onBlur}
      onChange={(event) => onChange(Number.parseInt(event.target.value, 10))}
      placeholder={placeholder}
      required={required}
      step={step}
      type="number"
      value={value}
    />
  </FormField>
);