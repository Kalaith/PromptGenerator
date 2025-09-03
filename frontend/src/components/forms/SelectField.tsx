import React, { useId } from 'react';
import { FormField } from './FormField';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  emptyOption?: string;
  className?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  disabled = false,
  required = false,
  error,
  helpText,
  emptyOption = "Select an option",
  className = '',
  'data-testid': testId,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}) => {
  const errorId = useId();
  const helpId = useId();
  const describedBy = [
    ariaDescribedBy,
    error ? errorId : undefined,
    helpText ? helpId : undefined,
  ].filter(Boolean).join(' ');

  return (
    <FormField
      className={className}
      data-testid={testId}
      error={error}
      helpText={helpText}
      id={id}
      label={label}
      required={required}
    >
      <select
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        id={id}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        {emptyOption && (
          <option disabled value="">
            {emptyOption}
          </option>
        )}
        {options.map(option => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};