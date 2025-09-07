import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import TypeEditFormInputs from './TypeEditFormInputs';

interface TypeEditFormProps {
  type: GeneratorTypeConfig;
  onUpdate: (id: string, updates: Partial<GeneratorTypeConfig>) => void;
}

const TypeEditForm: React.FC<TypeEditFormProps> = ({ type, onUpdate }) => {
  return (
    <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
      <TypeEditFormInputs type={type} onUpdate={onUpdate} />
    </div>
  );
};

export default TypeEditForm;