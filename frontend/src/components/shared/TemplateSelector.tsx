import React, { useId } from 'react';
import { SelectField } from './GeneratorForm';
import { FormField } from '../forms/FormField';
import { TemplateService } from '../../services/templateService';
import { AppErrorHandler } from '../../types/errors';
import type { TemplateSelectorProps, SelectOption } from '../../types/components';

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  templates,
  loading = false,
  error = null,
  type = 'anime',
  className = '',
  'data-testid': testId,
}) => {
  const templateId = useId();
  const previewId = useId();

  const templateOptions: SelectOption[] = [
    { value: '', label: 'No Template' },
    ...templates.map(template => ({
      value: template.id.toString(),
      label: `${template.name} (${template.usage_count || 0} uses)`,
      description: template.description,
      disabled: !template.is_active,
    })),
  ];

  const handleTemplateChange = (value: string) => {
    if (!value) {
      onTemplateChange(null);
      return;
    }
    
    const templateId = parseInt(value, 10);
    const template = templates.find(t => t.id === templateId);
    onTemplateChange(template || null);
  };

  const templatePreview = selectedTemplate 
    ? TemplateService.getTemplatePreview(selectedTemplate)
    : null;

  return (
    <div className={className} data-testid={testId}>
      <FormField
        id={templateId}
        label="Template (Optional)"
        helpText={`Choose a pre-made template for ${type} generation to apply common settings`}
        error={error ? AppErrorHandler.getDisplayMessage(error) : undefined}
      >
        <select
          id={templateId}
          value={selectedTemplate?.id.toString() || ''}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
          aria-describedby={templatePreview ? previewId : undefined}
          aria-busy={loading}
        >
          {templateOptions.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              title={option.description}
            >
              {option.label}
            </option>
          ))}
        </select>

        {loading && (
          <div className="mt-1 text-sm text-gray-500">
            Loading templates...
          </div>
        )}
      </FormField>

      {templatePreview && (
        <div 
          id={previewId}
          className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md"
          role="region"
          aria-labelledby={`${previewId}-title`}
        >
          <div 
            id={`${previewId}-title`}
            className="font-medium text-blue-900 mb-2"
          >
            {templatePreview.name}
          </div>
          
          <div className="text-sm text-blue-800 mb-2">
            {templatePreview.description}
          </div>
          
          <div className="text-xs text-blue-600 mb-2">
            Used {templatePreview.usageCount} times
          </div>

          {Object.keys(templatePreview.previewFields).length > 0 && (
            <div className="border-t border-blue-200 pt-2">
              <div className="text-xs font-medium text-blue-900 mb-1">
                Template Settings:
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                {Object.entries(templatePreview.previewFields).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium capitalize mr-2">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};