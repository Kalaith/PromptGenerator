import { useState, useEffect, useCallback } from 'react';
import { PromptApi, TemplateApi, type Template } from '../api';

export const useAlienData = () => {
  const [availableSpeciesClasses, setAvailableSpeciesClasses] = useState<string[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Load species classes from unified species
      const speciesResponse = await PromptApi.getSpecies();
      const alienSpecies = speciesResponse.data.species.filter(s => s.type === 'alien');
      const speciesClasses = [...new Set(alienSpecies.map(s => s.category))];
      setAvailableSpeciesClasses(speciesClasses);

      // Load alien templates
      const templates = await TemplateApi.getPublicTemplates('alien');
      setAvailableTemplates(templates);
    } catch {
      setError('Failed to load alien data');
      // Fallback to empty arrays - user can still generate
      setAvailableSpeciesClasses([]);
      setAvailableTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    availableSpeciesClasses,
    availableTemplates,
    loading,
    error,
    refetch: loadData,
  };
};