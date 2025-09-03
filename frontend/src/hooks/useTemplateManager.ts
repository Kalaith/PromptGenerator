import { useState, useEffect, useCallback } from 'react';
import { DescriptionTemplateApi, type DescriptionTemplate } from '../api';

export const useTemplateManager = (selectedType: string) => {
  const [templates, setTemplates] = useState<DescriptionTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTemplates = await DescriptionTemplateApi.getByGeneratorType(selectedType);
      setTemplates(fetchedTemplates);
    } catch {
      setError('Network error while fetching templates');
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const deleteTemplate = useCallback(async (template: DescriptionTemplate): Promise<void> => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    try {
      setLoading(true);
      setError(null);
      const response = await DescriptionTemplateApi.delete(template.id);
      
      if (response.success) {
        setSuccess('Template deleted successfully!');
        await fetchTemplates();
      } else {
        setError(response.error ?? 'Failed to delete template');
      }
    } catch {
      setError('Network error while deleting template');
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  const clearMessages = useCallback((): void => {
    setError(null);
    setSuccess(null);
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    success,
    fetchTemplates,
    deleteTemplate,
    clearMessages,
  };
};