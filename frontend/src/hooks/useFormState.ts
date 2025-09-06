import { useState, useCallback, useMemo } from 'react';
import { ValidationUtils, ValidationResult } from '../utils/validation';
import { AppError } from '../types/errors';

export interface FormField<T = any> {
  value: T;
  error?: string | undefined;
  touched: boolean;
  validator?: ((value: T) => ValidationResult) | undefined;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitError?: AppError | undefined;
}

export interface FormActions<T extends Record<string, any>> {
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  touchField: <K extends keyof T>(field: K) => void;
  touchAll: () => void;
  validateField: <K extends keyof T>(field: K) => ValidationResult;
  validateAll: () => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitError: (error?: AppError | undefined) => void;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error?: string | undefined;
    'aria-invalid': boolean;
    'aria-describedby'?: string | undefined;
  };
}

export interface UseFormStateOptions<T extends Record<string, any>> {
  initialValues: T;
  validators?: { [K in keyof T]?: (value: T[K]) => ValidationResult };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormState<T extends Record<string, any>>({
  initialValues,
  validators = {},
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormStateOptions<T>): FormState<T> & FormActions<T> {
  const [state, setState] = useState<FormState<T>>(() => ({
    fields: Object.entries(initialValues).reduce((acc, [key, value]) => {
      acc[key as keyof T] = {
        value,
        touched: false,
        validator: validators[key as keyof T],
      };
      return acc;
    }, {} as FormState<T>['fields']),
    isValid: true,
    isSubmitting: false,
  }));

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => {
      const newFields = { ...prev.fields };
      newFields[field] = { ...newFields[field], value };

      // Validate on change if enabled
      if (validateOnChange && newFields[field].validator) {
        const validation = newFields[field].validator!(value);
        newFields[field].error = validation.isValid ? undefined : validation.error?.message;
      }

      // Recalculate form validity
      const isValid = Object.values(newFields).every(f => !f.error);

      return {
        ...prev,
        fields: newFields,
        isValid,
      };
    });
  }, [validateOnChange]);

  const setFieldError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          error,
        },
      },
      isValid: false,
    }));
  }, []);

  const touchField = useCallback(<K extends keyof T>(field: K) => {
    setState(prev => {
      const newFields = { ...prev.fields };
      newFields[field] = { ...newFields[field], touched: true };

      // Validate on blur if enabled
      if (validateOnBlur && newFields[field].validator) {
        const validation = newFields[field].validator!(newFields[field].value);
        newFields[field].error = validation.isValid ? undefined : validation.error?.message;
      }

      // Recalculate form validity
      const isValid = Object.values(newFields).every(f => !f.error);

      return {
        ...prev,
        fields: newFields,
        isValid,
      };
    });
  }, [validateOnBlur]);

  const touchAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      fields: Object.entries(prev.fields).reduce((acc, [key, field]) => {
        acc[key as keyof T] = { ...field, touched: true };
        return acc;
      }, {} as FormState<T>['fields']),
    }));
  }, []);

  const validateField = useCallback(<K extends keyof T>(field: K): ValidationResult => {
    const fieldState = state.fields[field];
    if (fieldState.validator) {
      return fieldState.validator(fieldState.value);
    }
    return { isValid: true };
  }, [state.fields]);

  const validateAll = useCallback((): boolean => {
    let allValid = true;
    const newFields = { ...state.fields };

    Object.keys(newFields).forEach(key => {
      const field = newFields[key as keyof T];
      if (field.validator) {
        const validation = field.validator(field.value);
        if (!validation.isValid) {
          allValid = false;
          newFields[key as keyof T] = {
            ...field,
            error: validation.error?.message,
            touched: true,
          };
        }
      }
    });

    setState(prev => ({
      ...prev,
      fields: newFields,
      isValid: allValid,
    }));

    return allValid;
  }, [state.fields]);

  const resetForm = useCallback(() => {
    setState({
      fields: Object.entries(initialValues).reduce((acc, [key, value]) => {
        acc[key as keyof T] = {
          value,
          touched: false,
          validator: validators[key as keyof T],
        };
        return acc;
      }, {} as FormState<T>['fields']),
      isValid: true,
      isSubmitting: false,
    });
  }, [initialValues, validators]);

  const setSubmitting = useCallback((submitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const setSubmitError = useCallback((error?: AppError) => {
    setState(prev => ({ ...prev, submitError: error }));
  }, []);

  const getFieldProps = useCallback(<K extends keyof T>(field: K) => {
    const fieldState = state.fields[field];
    return {
      value: fieldState.value,
      onChange: (value: T[K]) => setField(field, value),
      onBlur: () => touchField(field),
      error: fieldState.touched ? fieldState.error : undefined,
      'aria-invalid': !!(fieldState.touched && fieldState.error),
      'aria-describedby': fieldState.error ? `${String(field)}-error` : undefined,
    };
  }, [state.fields, setField, touchField]);

  const formValues = useMemo(() => {
    return Object.entries(state.fields).reduce((acc, [key, field]) => {
      acc[key as keyof T] = field.value;
      return acc;
    }, {} as T);
  }, [state.fields]);

  return {
    ...state,
    setField,
    setFieldError,
    touchField,
    touchAll,
    validateField,
    validateAll,
    resetForm,
    setSubmitting,
    setSubmitError,
    getFieldProps,
  };
}