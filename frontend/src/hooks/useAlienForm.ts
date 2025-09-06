import { useState, useCallback } from 'react';
import { DEFAULT_ALIEN_FORM_DATA } from '../constants/alienConstants';
import type { GenerateAlienRequest } from '../api';

interface AlienFormData {
  speciesClass: string;
  style: string;
  environment: string;
  climate: string;
  positiveTrait: string;
  negativeTrait: string;
  gender: string;
}

export const useAlienForm = () => {
  const [formData, setFormData] = useState<AlienFormData>(DEFAULT_ALIEN_FORM_DATA);

  const updateField = useCallback(<K extends keyof AlienFormData>(
    key: K,
    value: AlienFormData[K]
  ): void => {
    setFormData(previous => ({ ...previous, [key]: value }));
  }, []);

  const resetForm = useCallback((): void => {
    setFormData(DEFAULT_ALIEN_FORM_DATA);
  }, []);

  const buildGenerationRequest = useCallback((
    count: number, 
    templateId?: string
  ): GenerateAlienRequest => ({
    count,
    ...(templateId && { templateId: parseInt(templateId, 10) }),
    species_class: formData.speciesClass === 'random' ? undefined : formData.speciesClass,
    style: formData.style === 'random' ? undefined : formData.style,
    environment: formData.environment === 'random' ? undefined : formData.environment,
    climate: formData.climate === 'random' ? undefined : formData.climate,
    positive_trait: formData.positiveTrait === 'random' ? undefined : formData.positiveTrait,
    negative_trait: formData.negativeTrait === 'random' ? undefined : formData.negativeTrait,
    gender: formData.gender === 'random' ? undefined : formData.gender,
  }), [formData]);

  return {
    formData,
    updateField,
    resetForm,
    buildGenerationRequest,
  };
};