import { useState } from 'react';
import type { Template } from '../api/types';

interface UseTemplateSelectionReturn {
  selectedTemplate: Template | null;
  availableTemplates: Template[];
  setSelectedTemplate: (template: Template | null) => void;
  selectTemplateById: (templateId: string, templates: Template[]) => void;
  resetTemplate: () => void;
}

export const useTemplateSelection = (): UseTemplateSelectionReturn => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates] = useState<Template[]>([]);

  const selectTemplateById = (templateId: string, templates: Template[]): void => {
    const template = templates.find(t => String(t.id) === templateId);
    setSelectedTemplate(template ?? null);
  };

  const resetTemplate = (): void => {
    setSelectedTemplate(null);
  };

  return {
    selectedTemplate,
    availableTemplates,
    setSelectedTemplate,
    selectTemplateById,
    resetTemplate,
  };
};