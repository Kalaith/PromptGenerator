import React from 'react';
import type { Template } from '../api/types';

interface AlienTemplateSelectorProps {
  availableTemplates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (templateId: string, templates: Template[]) => void;
}

const AlienTemplateSelector: React.FC<AlienTemplateSelectorProps> = ({
  availableTemplates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  if (availableTemplates.length === 0) {
    return null;
  }

  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onSelectTemplate(event.target.value, availableTemplates);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
        <span>📝</span> Template (Optional)
      </label>
      <select
        className="w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                 focus:border-mystic-500 focus:ring-4 focus:ring-mystic-100 transition-all duration-300
                 text-slate-800 font-medium hover:border-gray-400 shadow-sm"
        onChange={handleTemplateChange}
        value={selectedTemplate ? String(selectedTemplate.id) : ''}
      >
        <option value="">🎲 No template</option>
        {availableTemplates.map(template => (
          <option key={template.id} value={String(template.id)}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlienTemplateSelector;