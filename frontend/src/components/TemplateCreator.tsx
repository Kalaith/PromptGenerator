import React, { useState, useEffect } from 'react';
import { TemplateApi, type CreateTemplateRequest } from '../api';
import { getGeneratorTypes, GeneratorTypeConfig } from '../config/generatorTypes';

const TemplateCreator: React.FC = () => {
  const [availableGeneratorTypes, setAvailableGeneratorTypes] = useState<GeneratorTypeConfig[]>([]);
  const [formData, setFormData] = useState<CreateTemplateRequest>({
    name: '',
    description: '',
    type: 'anime', // Will be updated when generator types load
    template_data: {},
    is_public: false,
    created_by: 'user',
  });

  const [jsonInput, setJsonInput] = useState('{\n  \n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Load all active generator types
    const generatorTypes = getGeneratorTypes(true);
    setAvailableGeneratorTypes(generatorTypes);
    
    // Set default type to first available generator type
    if (generatorTypes.length > 0) {
      setFormData(prev => ({
        ...prev,
        type: generatorTypes[0].apiType
      }));
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const templateData = JSON.parse(jsonInput);
      const templateRequest = { ...formData, template_data: templateData };
      
      await TemplateApi.createTemplate(templateRequest);
      setSuccess('Template created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: availableGeneratorTypes.length > 0 ? availableGeneratorTypes[0].apiType : 'anime',
        template_data: {},
        is_public: false,
        created_by: 'user',
      });
      setJsonInput('{\n  \n}');
    } catch (createError) {
      if (createError instanceof SyntaxError) {
        setError('Invalid JSON format in template data');
      } else {
        setError('Failed to create template');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = <K extends keyof CreateTemplateRequest>(
    key: K,
    value: CreateTemplateRequest[K]
  ): void => {
    setFormData(previous => ({ ...previous, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Template</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => updateFormData('name', event.target.value)}
              required
              type="text"
              value={formData.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => updateFormData('description', event.target.value)}
              rows={3}
              value={formData.description}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => updateFormData('type', event.target.value)}
              value={formData.type}
            >
              {availableGeneratorTypes.map(generatorType => (
                <option key={generatorType.id} value={generatorType.apiType}>
                  {generatorType.icon} {generatorType.name}
                </option>
              ))}
              {availableGeneratorTypes.length === 0 && (
                <option value="" disabled>No generator types available</option>
              )}
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                checked={formData.is_public}
                onChange={(event) => updateFormData('is_public', event.target.checked)}
                type="checkbox"
              />
              <span className="ml-2 text-sm">Make template public</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Template Data (JSON) *</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
              onChange={(event) => setJsonInput(event.target.value)}
              placeholder='{\n  "species": "human",\n  "traits": ["example"]\n}'
              required
              rows={8}
              value={jsonInput}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter valid JSON data that defines the template structure
            </p>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating...' : 'Create Template'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TemplateCreator;