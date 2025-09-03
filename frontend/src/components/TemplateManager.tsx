import React, { useState, useEffect } from 'react';
import { TemplateApi, Template, CreateTemplateRequest } from '../api';

interface TemplateManagerProps {
  type?: 'anime' | 'alien';
  onTemplateSelect?: (template: Template) => void;
  showCreateButton?: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  type,
  onTemplateSelect,
  showCreateButton = true
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'mine'>('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Load templates on component mount and filter changes
  useEffect(() => {
    loadTemplates();
  }, [filter, type]);

  // Filter templates based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  }, [templates, searchQuery]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      let loadedTemplates: Template[];
      
      switch (filter) {
        case 'public':
          loadedTemplates = await TemplateApi.getPublicTemplates(type);
          break;
        case 'mine':
          loadedTemplates = await TemplateApi.getUserTemplates('user', type);
          break;
        default:
          loadedTemplates = await TemplateApi.getTemplates({ type });
      }
      
      setTemplates(loadedTemplates);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const handleUseTemplate = async (template: Template) => {
    try {
      await TemplateApi.useTemplate(template.id);
      // Update usage count locally
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, usage_count: t.usage_count + 1 } : t
      ));
    } catch (err) {
      console.error('Failed to update template usage:', err);
    }
  };

  const handleCloneTemplate = async (template: Template) => {
    try {
      const cloneName = prompt(`Clone template "${template.name}" as:`, `${template.name} (Copy)`);
      if (!cloneName) return;
      
      const clonedTemplate = await TemplateApi.cloneTemplate(template.id, cloneName);
      setTemplates(prev => [clonedTemplate, ...prev]);
    } catch (err) {
      console.error('Failed to clone template:', err);
      alert('Failed to clone template');
    }
  };

  const formatUsageCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Template Manager</h2>
        <div className="text-center py-8">
          <div className="text-gray-500">Loading templates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Template Manager</h2>
        {showCreateButton && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Create Template
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-2 rounded border">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-4 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('public')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'public' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'mine' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            My Templates
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Templates List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {templates.length === 0 ? 'No templates found' : 'No templates match your search'}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className={`bg-white p-3 rounded border cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTemplateClick(template)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      template.type === 'anime' ? 'bg-pink-100 text-pink-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {template.type}
                    </span>
                    {template.is_public && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        Public
                      </span>
                    )}
                  </div>
                  
                  {template.description && (
                    <p className="text-gray-600 text-xs mt-1">{template.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      Used {formatUsageCount(template.usage_count)} times
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(template);
                          if (onTemplateSelect) onTemplateSelect(template);
                        }}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Use
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloneTemplate(template);
                        }}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Clone
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Details */}
      {selectedTemplate && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium text-sm mb-2">Template Data Preview:</h4>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(selectedTemplate.template_data, null, 2)}
          </pre>
        </div>
      )}

      {/* Create Template Form - Basic placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
            <p className="text-gray-600 mb-4">
              Template creation form would go here. This is a basic placeholder for the full implementation.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;