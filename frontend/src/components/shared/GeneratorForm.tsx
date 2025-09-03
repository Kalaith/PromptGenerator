import React, { ReactNode, useId } from 'react';
import { APP_CONSTANTS } from '../../constants/app';
import { ValidationUtils } from '../../utils/validation';
import { AppError, AppErrorHandler } from '../../types/errors';
import type {
  BaseFieldProps,
  SelectFieldProps,
  NumberFieldProps,
  TextFieldProps,
  GeneratorFormProps,
} from '../../types/components';

interface FormFieldProps extends BaseFieldProps {
  children: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
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
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      {children}
      {helpText && (
        <div id={helpId} className="mt-1 text-sm text-gray-600">
          {helpText}
        </div>
      )}
      {error && (
        <div id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

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
  placeholder,
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
      id={id}
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      className={className}
      data-testid={testId}
    >
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        required={required}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid || !!error}
      >
        {placeholder && <option value="">{emptyOption}</option>}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  helpText,
  maxLength,
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
      id={id}
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      className={className}
      data-testid={testId}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid || !!error}
      />
    </FormField>
  );
};

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  min = APP_CONSTANTS.PROMPT_COUNT.MIN,
  max = APP_CONSTANTS.PROMPT_COUNT.MAX,
  step = 1,
  disabled = false,
  required = false,
  error,
  helpText,
  placeholder,
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
      id={id}
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      className={className}
      data-testid={testId}
    >
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(ValidationUtils.sanitizePromptCount(e.target.value))}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
        required={required}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid || !!error}
      />
    </FormField>
  );
};

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  title,
  children,
  onSubmit,
  loading,
  error,
  submitText = 'Generate',
  submitLoadingText = 'Generating...',
  disabled = false,
  resetButton = false,
  onReset,
  className = '',
  'data-testid': testId,
}) => {
  const formId = useId();
  const errorId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && !disabled) {
      onSubmit(e);
    }
  };

  const handleReset = () => {
    if (onReset && !loading) {
      onReset();
    }
  };

  return (
    <div 
      className={`p-4 bg-gray-100 rounded-md shadow-md ${className}`}
      data-testid={testId}
    >
      <h2 className="text-lg font-semibold mb-4" id={`${formId}-title`}>
        {title}
      </h2>
      
      {error && (
        <div 
          id={errorId}
          className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-3"
          role="alert"
          aria-live="polite"
        >
          {AppErrorHandler.getDisplayMessage(error)}
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit}
        id={formId}
        aria-labelledby={`${formId}-title`}
        aria-describedby={error ? errorId : undefined}
        noValidate
      >
        <fieldset disabled={disabled || loading} className="border-0 p-0 m-0">
          <legend className="sr-only">{title} Form Fields</legend>
          {children}
        </fieldset>
        
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading || disabled}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-describedby={loading ? `${formId}-status` : undefined}
          >
            {loading ? submitLoadingText : submitText}
          </button>
          
          {resetButton && onReset && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        
        {loading && (
          <div 
            id={`${formId}-status`}
            className="mt-2 text-sm text-blue-600"
            role="status"
            aria-live="polite"
          >
            {submitLoadingText}
          </div>
        )}
      </form>
    </div>
  );
};

export { FormField };