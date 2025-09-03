import React, { useState } from 'react';
import { TemplateApi, CreateTemplateRequest } from '../api';

const TemplateCreator: React.FC = () => {
  const [formData, setFormData] = useState<CreateTemplateRequest>({
    name: '',
    description: '',
    type: 'anime',
    template_data: {},
    is_public: false,
    created_by: 'user'
  });

  const [jsonInput, setJsonInput] = useState('{\n  \n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Template examples for each type
  const examples = {
    anime: {
      'Magical Girl': {
        species: 'human',
        traits: ['magical powers', 'colorful outfit', 'sparkles'],
        style_modifiers: ['magical girl anime', 'bright colors', 'transformation sequence'],
        negative_prompts: ['dark', 'gritty', 'realistic']
      },
      'School Uniform': {
        species: 'human',
        traits: ['school uniform', 'student', 'youthful'],
        style_modifiers: ['school anime', 'uniform', 'academic setting'],
        negative_prompts: ['adult', 'mature', 'workplace']
      }
    },
    alien: {
      'Space Explorer': {
        species_class: 'Humanoid',
        traits: ['advanced technology', 'space suit', 'exploration gear'],
        environment: 'space station',
        style_modifiers: ['sci-fi', 'futuristic', 'clean technology'],
        negative_prompts: ['primitive', 'fantasy', 'medieval']
      },
      'Desert Dweller': {
        species_class: 'Reptilian',
        climate: 'Desert',
        traits: ['heat adaptation', 'sand camouflage', 'water conservation'],
        style_modifiers: ['desert landscape', 'harsh environment', 'survival'],
        negative_prompts: ['water', 'cold', 'forest']
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse JSON input
      let templateData;
      try {
        templateData = JSON.parse(jsonInput);
      } catch (jsonError) {
        throw new Error('Invalid JSON format in template data');
      }

      // Validate template data
      const validationErrors = TemplateApi.validateTemplateData(templateData, formData.type);
      if (validationErrors.length > 0) {
        throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
      }

      const requestData = {
        ...formData,
        template_data: templateData
      };

      const createdTemplate = await TemplateApi.createTemplate(requestData);
      setSuccess(`Template "${createdTemplate.name}" created successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'anime',
        template_data: {},
        is_public: false,
        created_by: 'user'
      });
      setJsonInput('{\n  \n}');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (exampleName: string) => {
    const example = examples[formData.type][exampleName as keyof typeof examples[typeof formData.type]];
    if (example) {
      setJsonInput(JSON.stringify(example, null, 2));
      setFormData(prev => ({
        ...prev,
        name: exampleName,
        description: `Example ${formData.type} template: ${exampleName}`
      }));
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Create New Template</h2>
      
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-3 rounded border">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 text-green-600 bg-green-50 p-3 rounded border">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Template Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            placeholder="e.g., Magical Girl, Space Explorer"
          />
        </div>

        {/* Template Description */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
            placeholder="Brief description of this template"
          />
        </div>

        {/* Template Type */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Template Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'anime' | 'alien' }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="anime">Anime</option>
            <option value="alien">Alien</option>
          </select>
        </div>

        {/* Public/Private */}
        <div className="flex items-center">
          <input
            id="is_public"
            type="checkbox"
            checked={formData.is_public}
            onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="is_public" className="text-sm">
            Make this template public (other users can use it)
          </label>
        </div>

        {/* Example Templates */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Load Example Template:
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(examples[formData.type]).map((exampleName) => (
              <button
                key={exampleName}
                type="button"
                onClick={() => loadExample(exampleName)}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {exampleName}
              </button>
            ))}
          </div>
        </div>

        {/* Template Data */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium" htmlFor="template_data">
              Template Data (JSON) *
            </label>
            <button
              type="button"
              onClick={formatJson}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Format JSON
            </button>
          </div>
          
          <textarea
            id="template_data"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
            rows={12}
            placeholder={JSON.stringify(examples[formData.type][Object.keys(examples[formData.type])[0]], null, 2)}
            required
          />
          
          {/* Field hints */}
          <div className="mt-2 text-xs text-gray-600">
            <div className="font-medium mb-1">Available fields for {formData.type} templates:</div>
            {formData.type === 'anime' ? (
              <div>species, traits, style_modifiers, negative_prompts, gender, outfit</div>
            ) : (
              <div>species_class, traits, climate, environment, style_modifiers, negative_prompts, gender</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading || !formData.name.trim() || !jsonInput.trim()}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Template'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                type: 'anime',
                template_data: {},
                is_public: false,
                created_by: 'user'
              });
              setJsonInput('{\n  \n}');
              setError(null);
              setSuccess(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateCreator;