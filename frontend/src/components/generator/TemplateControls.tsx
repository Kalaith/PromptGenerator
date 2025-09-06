import React, { useState } from 'react';
import { GeneratorTypeConfig } from '../../config/generatorTypes';
import { Template } from '../../api/types';

interface TemplateControlsProps {
  config: GeneratorTypeConfig;
  availableTemplates: Template[];
  selectedTemplate: Template | null;
  onTemplateChange: (template: Template | null) => void;
  onTemplateModify?: (template: Template, modifiedData: Record<string, any>) => void;
  getFocusClasses: (baseColor: string) => string;
}

export const TemplateControls: React.FC<TemplateControlsProps> = ({
  config,
  availableTemplates,
  selectedTemplate,
  onTemplateChange,
  onTemplateModify,
  getFocusClasses,
}) => {
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [modifiedTemplateData, setModifiedTemplateData] = useState<Record<string, any>>({});
  const handleTemplateChange = (templateId: string) => {
    if (!templateId || templateId === '') {
      onTemplateChange(null);
      setShowTemplateEditor(false);
      setModifiedTemplateData({});
      return;
    }
    
    const template = availableTemplates.find(t => t.id.toString() === templateId);
    onTemplateChange(template || null);
    setModifiedTemplateData(template?.template_data || {});
    setShowTemplateEditor(false);
  };

  const handleTemplateDataChange = (key: string, value: string) => {
    setModifiedTemplateData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyTemplateModifications = () => {
    if (selectedTemplate && onTemplateModify) {
      onTemplateModify(selectedTemplate, modifiedTemplateData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <h3 className="text-xl font-bold text-dark-700">Template (Optional)</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="template-select" className="block text-sm font-medium text-dark-600 mb-2">
            Choose Template
          </label>
          <select
            id="template-select"
            value={selectedTemplate?.id.toString() || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-dark-700
                       transition-all duration-200 hover:border-gray-400 ${getFocusClasses(config.baseColor)}`}
          >
            <option value="">No Template (Generate Fresh)</option>
            {availableTemplates.map((template) => (
              <option 
                key={template.id} 
                value={template.id.toString()}
                disabled={!template.is_active}
              >
                {template.name} ({template.usage_count || 0} uses)
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-dark-500">
            Templates provide pre-configured settings for consistent generation styles
          </p>
        </div>

        {selectedTemplate && (
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-dark-700">{selectedTemplate.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {selectedTemplate.usage_count || 0} uses
                  </span>
                  {selectedTemplate.template_data && Object.keys(selectedTemplate.template_data).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        showTemplateEditor 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {showTemplateEditor ? 'Hide Editor' : '✏️ Customize'}
                    </button>
                  )}
                </div>
              </div>
              
              {selectedTemplate.description && (
                <p className="text-sm text-dark-600">{selectedTemplate.description}</p>
              )}
              
              {selectedTemplate.template_data && Object.keys(selectedTemplate.template_data).length > 0 && !showTemplateEditor && (
                <div className="border-t pt-3">
                  <h5 className="text-xs font-medium text-dark-600 mb-2 uppercase tracking-wide">
                    Template Settings:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(modifiedTemplateData).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="font-medium text-dark-500 capitalize mr-2 min-w-0 flex-shrink-0">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-dark-600 truncate">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showTemplateEditor && selectedTemplate.template_data && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-dark-700">Customize Template Settings</h5>
                    <button
                      type="button"
                      onClick={() => setModifiedTemplateData(selectedTemplate.template_data || {})}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reset to Original
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(selectedTemplate.template_data).map(([key, originalValue]) => (
                      <div key={key}>
                        <label 
                          htmlFor={`template-${key}`}
                          className="block text-xs font-medium text-dark-600 mb-1 capitalize"
                        >
                          {key.replace(/_/g, ' ')}:
                        </label>
                        <input
                          id={`template-${key}`}
                          type="text"
                          value={modifiedTemplateData[key] || ''}
                          onChange={(e) => handleTemplateDataChange(key, e.target.value)}
                          placeholder={String(originalValue)}
                          className={`w-full px-3 py-2 text-xs border border-gray-300 rounded-lg
                                     transition-all duration-200 ${getFocusClasses(config.baseColor)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={applyTemplateModifications}
                      className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Apply Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTemplateEditor(false)}
                      className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {availableTemplates.length === 0 && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              No templates available for {config.name.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};