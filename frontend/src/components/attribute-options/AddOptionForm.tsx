import React from 'react';
import { NewOptionData } from './types';

interface AddOptionFormProps {
  category: string;
  newOption: NewOptionData;
  onOptionChange: (field: keyof NewOptionData, value: string | number) => void;
  onSubmit: (category: string) => Promise<void>;
  onCancel: () => void;
}

export const AddOptionForm: React.FC<AddOptionFormProps> = ({
  category,
  newOption,
  onOptionChange,
  onSubmit,
  onCancel
}) => {
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit(category);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
      <h3 className="font-semibold mb-4 text-lg">Add New Option to "{category}"</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value *
            </label>
            <input
              type="text"
              value={newOption.value}
              onChange={(e) => onOptionChange('value', e.target.value)}
              placeholder="e.g., red"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Used internally and in API calls
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={newOption.name}
              onChange={(e) => onOptionChange('name', e.target.value)}
              placeholder="e.g., Red"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Shown to users in the interface
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="number"
              value={newOption.weight}
              onChange={(e) => onOptionChange('weight', parseFloat(e.target.value) || 1)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher = more likely in random selection
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            ✅ Add Option
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};