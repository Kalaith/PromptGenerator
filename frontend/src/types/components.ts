import { ReactNode } from 'react';
import { AppError } from './errors';
import { Template } from '../api/types';

// Base component props
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

// Form field props
export interface BaseFieldProps extends BaseComponentProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

// Select field specific props
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  emptyOption?: string;
}

// Number field specific props
export interface NumberFieldProps extends BaseFieldProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Text field specific props
export interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password' | 'url';
  placeholder?: string;
  maxLength?: number;
}

// Template selector props
export interface TemplateSelectorProps extends BaseComponentProps {
  selectedTemplate: Template | null;
  onTemplateChange: (template: Template | null) => void;
  templates: Template[];
  loading?: boolean;
  error?: AppError | null;
  type?: 'anime' | 'alien' | 'adventurer';
}

// Generator form props
export interface GeneratorFormProps extends BaseComponentProps {
  title: string;
  children: ReactNode;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  error: AppError | null;
  submitText?: string;
  submitLoadingText?: string;
  disabled?: boolean;
  resetButton?: boolean;
  onReset?: () => void;
}

// Generation parameters
export interface BaseGenerationParams {
  count: number;
}

export interface AnimeGenerationParams extends BaseGenerationParams {
  type: 'animalGirl' | 'monster' | 'monsterGirl';
  species?: string;
}

export interface AlienGenerationParams extends BaseGenerationParams {
  species_class?: string;
  climate?: string;
  environment?: string;
  style?: string;
  positive_trait?: string;
  negative_trait?: string;
  gender?: string;
}

export interface AdventurerGenerationParams extends BaseGenerationParams {
  adventurer_type?: string;
  background?: string;
  equipment?: string;
  personality?: string;
}

// Form state types
export interface FormFieldState<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  valid: boolean;
}

export interface GeneratorFormState {
  promptCount: FormFieldState<number>;
  isValid: boolean;
  isSubmitting: boolean;
  submitError?: AppError;
}

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number; // 0-100
}

// Data fetching state
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  lastUpdated?: Date;
}

// Common component state patterns
export interface ComponentState {
  mounted: boolean;
  initializing: boolean;
  error?: AppError;
}

// Event handler types
export type ChangeHandler<T> = (value: T) => void;
export type BlurHandler = () => void;
export type SubmitHandler = (event: React.FormEvent) => void | Promise<void>;
export type ErrorHandler = (error: AppError) => void;

// Accessibility props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Combined props for complex components
export interface FormControlProps extends BaseFieldProps, AccessibilityProps {
  children: ReactNode;
}

// Generator panel specific types
export interface GeneratorPanelState<T extends BaseGenerationParams> {
  formData: T;
  formState: GeneratorFormState;
  templates: DataState<Template[]>;
  availableOptions: DataState<string[]>;
  selectedTemplate: Template | null;
}

export interface GeneratorPanelActions<T extends BaseGenerationParams> {
  updateFormField: <K extends keyof T>(field: K, value: T[K]) => void;
  selectTemplate: (template: Template | null) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  validateForm: () => boolean;
}