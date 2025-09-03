import { useState, useCallback } from 'react';
import { DescriptionTemplateApi, type DescriptionTemplate } from '../api';
import { DEFAULT_TEMPLATE_FORM_DATA } from '../constants/templateConstants';

interface TemplateFormData {
  name: string;
  generator_type: string;
  template: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

export const useTemplateForm = () => {
  const [formData, setFormData] = useState<TemplateFormData>(DEFAULT_TEMPLATE_FORM_DATA);
  const [editingTemplate, setEditingTemplate] = useState<DescriptionTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const startEdit = useCallback((template: DescriptionTemplate): void => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      generator_type: template.generator_type,
      template: template.template,
      description: template.description ?? '',
      is_active: template.is_active,
      is_default: template.is_default,
    });
    setIsCreating(false);
    setError(null);
  }, []);

  const startCreate = useCallback((selectedType: string): void => {
    setEditingTemplate(null);
    setFormData({
      ...DEFAULT_TEMPLATE_FORM_DATA,
      generator_type: selectedType,
    });
    setIsCreating(true);
    setError(null);
  }, []);

  const cancel = useCallback((): void => {
    setEditingTemplate(null);
    setIsCreating(false);
    setError(null);
  }, []);

  const updateFormData = useCallback(<K extends keyof TemplateFormData>(
    key: K,
    value: TemplateFormData[K]
  ): void => {
    setFormData(previous => ({ ...previous, [key]: value }));
  }, []);

  const save = useCallback(async (onSuccess?: () => void): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      const response = editingTemplate
        ? await DescriptionTemplateApi.update(editingTemplate.id, formData)
        : await DescriptionTemplateApi.create(formData);
      
      if (response.success) {
        setSuccess(editingTemplate ? 'Template updated successfully!' : 'Template created successfully!');
        setEditingTemplate(null);
        setIsCreating(false);
        onSuccess?.();
      } else {
        const errorMessage = response.validation_errors
          ? `Validation errors: ${response.validation_errors.join(', ')}`
          : response.error ?? 'Failed to save template';
        setError(errorMessage);
      }
    } catch {
      setError('Network error while saving template');
    } finally {
      setLoading(false);
    }
  }, [editingTemplate, formData]);

  const clearMessages = useCallback((): void => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    formData,
    editingTemplate,
    isCreating,
    loading,
    error,
    success,
    startEdit,
    startCreate,
    cancel,
    updateFormData,
    save,
    clearMessages,
  };
};