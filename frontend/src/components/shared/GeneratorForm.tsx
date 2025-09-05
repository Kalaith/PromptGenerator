import React from 'react';
import { APP_CONSTANTS } from '../../constants/app';
import { ValidationUtils } from '../../utils/validation';
import { SelectField } from '../forms/SelectField';
import { NumberField } from '../forms/NumberField';
import { TextField } from '../forms/TextField';

interface GeneratorFormProps {
  onSubmit: (event: React.FormEvent) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onSubmit,
  disabled = false,
  children,
  className = '',
  'data-testid': testId,
}) => {
  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!disabled) {
      onSubmit(event);
    }
  };

  return (
    <form 
      className={`space-y-4 ${className}`}
      data-testid={testId}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
};

export {
  GeneratorForm,
  SelectField,
  NumberField,
  TextField,
  APP_CONSTANTS,
  ValidationUtils,
};