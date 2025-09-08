import React, { useEffect, useState } from 'react';
import { NewAttributeData, AttributeConfig } from './types';
import { config } from '../../config/app';

interface GeneratorType {
  name: string;
  display_name: string;
  route_key: string;
  is_active: boolean;
}

interface AttributeFormProps {
  newAttribute: NewAttributeData;
  onAttributeChange: (attribute: NewAttributeData) => void;
  onSubmit: (generatorTypes: string[]) => Promise<void>;
  onCancel: () => void;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({
  newAttribute,
  onAttributeChange,
  onSubmit,
  onCancel
}) => {
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeneratorTypes = async () => {
      try {
        const apiBaseUrl = config.getApi().baseUrl;
        const response = await fetch(`${apiBaseUrl}/generator-types`);
        const data = await response.json();
        
        if (data.success) {
          setGeneratorTypes(data.data.generator_types || []);
        } else {
          setError('Failed to load generator types');
        }
      } catch (err) {
        setError('Error fetching generator types');
        console.error('Error fetching generator types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratorTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedTypes = formData.getAll('generatorTypes') as string[];
    await onSubmit(selectedTypes);
  };

  const handleInputChange = (field: keyof NewAttributeData, value: string | number): void => {
    onAttributeChange({
      ...newAttribute,
      [field]: value
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-semibold mb-3">Add New Attribute</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <input
              type="text"
              value={newAttribute.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Label:</label>
            <input
              type="text"
              value={newAttribute.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Input Type:</label>
            <select
              value={newAttribute.input_type}
              onChange={(e) => handleInputChange('input_type', e.target.value as AttributeConfig['input_type'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="select">Select</option>
              <option value="multi-select">Multi-Select</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order:</label>
            <input
              type="number"
              value={newAttribute.sort_order}
              onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Generator Types:</label>
          <div className="space-y-2">
            {loading ? (
              <div className="text-gray-500">Loading generator types...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : generatorTypes.length === 0 ? (
              <div className="text-gray-500">No generator types available</div>
            ) : (
              generatorTypes.map(type => (
                <label key={type.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name="generatorTypes"
                    value={type.name}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm"
                  />
                  <span className="ml-2">{type.display_name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Attribute
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};