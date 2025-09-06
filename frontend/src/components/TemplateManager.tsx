import React, { useState, useEffect } from 'react';
import { TemplateApi, type Template } from '../api';

interface TemplateManagerProps {
  type?: string;
  onTemplateSelect?: (template: Template) => void;
  showCreateButton?: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  type,
  onTemplateSelect,
  showCreateButton = true,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'mine'>('public');

  useEffect(() => {
    const loadTemplates = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        let loadedTemplates: Template[];
        
        switch (filter) {
          case 'public': {
            loadedTemplates = await TemplateApi.getPublicTemplates(type as 'anime' | 'alien');
            break;
          }
          case 'mine': {
            throw new Error('User authentication required to view personal templates');
          }
          default: {
            loadedTemplates = await TemplateApi.getTemplates({ type });
            break;
          }
        }
        
        setTemplates(loadedTemplates);
      } catch {
        setError('Failed to load templates');
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    void loadTemplates();
  }, [filter, type]);

  const handleTemplateClick = (template: Template): void => {
    onTemplateSelect?.(template);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Template Manager</h3>
        {showCreateButton && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create New
          </button>
        )}
      </div>

      <div className="mb-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(event) => setFilter(event.target.value as typeof filter)}
          value={filter}
        >
          <option value="public">Public Templates</option>
          <option value="mine">My Templates</option>
          <option value="all">All Templates</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading templates...</div>
      ) : (
        <div className="grid gap-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No templates found</div>
          ) : (
            templates.map(template => (
              <div
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                key={template.id}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <span className="text-sm text-gray-500">{template.type}</span>
                </div>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                )}
                <div className="text-xs text-gray-500">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;