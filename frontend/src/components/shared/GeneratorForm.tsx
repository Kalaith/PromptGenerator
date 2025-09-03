import React, { ReactNode } from 'react';
import { APP_CONSTANTS } from '../../constants/app';
import { ValidationUtils } from '../../utils/validation';
import { AppError, AppErrorHandler } from '../../types/errors';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, children, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
  </div>
);

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  value,
  onChange,
  options,
  disabled = false,
  placeholder,
}) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
    disabled={disabled}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
    disabled={disabled}
  />
);

interface NumberFieldProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  value,
  onChange,
  min = APP_CONSTANTS.PROMPT_COUNT.MIN,
  max = APP_CONSTANTS.PROMPT_COUNT.MAX,
  disabled = false,
}) => (
  <input
    id={id}
    type="number"
    min={min}
    max={max}
    value={value}
    onChange={(e) => onChange(ValidationUtils.sanitizePromptCount(e.target.value))}
    className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
    disabled={disabled}
  />
);

interface GeneratorFormProps {
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  loading: boolean;
  error: AppError | null;
  submitText?: string;
  submitLoadingText?: string;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  title,
  children,
  onSubmit,
  loading,
  error,
  submitText = 'Generate',
  submitLoadingText = 'Generating...',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onSubmit();
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {error && (
        <div className="mb-4 text-red-600">
          {AppErrorHandler.getDisplayMessage(error)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {children}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? submitLoadingText : submitText}
        </button>
      </form>
    </div>
  );
};

export { FormField };