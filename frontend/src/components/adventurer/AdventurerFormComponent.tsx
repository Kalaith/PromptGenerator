import React from 'react';
import { ADVENTURER_FORM_FIELDS } from '../../constants/adventurerConstants';
import type { AdventurerOptions, AdventurerFormData } from '../../types/adventurer';

interface AdventurerFormComponentProps {
  formData: AdventurerFormData;
  options: AdventurerOptions;
  onUpdateField: <K extends keyof AdventurerFormData>(key: K, value: AdventurerFormData[K]) => void;
}

export const AdventurerFormComponent: React.FC<AdventurerFormComponentProps> = ({
  formData,
  options,
  onUpdateField,
}) => (
  <div className="grid grid-cols-2 gap-4">
    {ADVENTURER_FORM_FIELDS.map(field => {
      const fieldOptions = options[field.optionsKey as keyof AdventurerOptions] as string[];
      const fieldValue = formData[field.key as keyof AdventurerFormData] as string;

      return (
        <div key={field.key}>
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(event) => onUpdateField(field.key as keyof AdventurerFormData, event.target.value)}
            value={fieldValue}
          >
            <option value="random">Random</option>
            {fieldOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    })}
  </div>
);