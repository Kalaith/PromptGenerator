import { useState, useCallback } from 'react';
import { DEFAULT_ADVENTURER_FORM_DATA } from '../constants/adventurerConstants';
import type { AdventurerFormData, AdventurerGenerationParams } from '../types/adventurer';

export const useAdventurerForm = () => {
  const [formData, setFormData] = useState<AdventurerFormData>(DEFAULT_ADVENTURER_FORM_DATA);

  const updateField = useCallback(<K extends keyof AdventurerFormData>(
    key: K,
    value: AdventurerFormData[K]
  ): void => {
    setFormData(previous => ({ ...previous, [key]: value }));
  }, []);

  const resetForm = useCallback((): void => {
    setFormData(DEFAULT_ADVENTURER_FORM_DATA);
  }, []);

  const buildGenerationParams = useCallback((count: number): AdventurerGenerationParams => ({
    count,
    race: formData.race === 'random' ? undefined : formData.race,
    class: formData.className === 'random' ? undefined : formData.className,
    experience: formData.experience === 'random' ? undefined : formData.experience,
    gender: formData.gender === 'random' ? undefined : formData.gender,
    style: formData.style === 'random' ? undefined : formData.style,
    environment: formData.environment === 'random' ? undefined : formData.environment,
    hairColor: formData.hairColor === 'random' ? undefined : formData.hairColor,
    skinColor: formData.skinColor === 'random' ? undefined : formData.skinColor,
    eyeColor: formData.eyeColor === 'random' ? undefined : formData.eyeColor,
    eyeStyle: formData.eyeStyle === 'random' ? undefined : formData.eyeStyle,
  }), [formData]);

  return {
    formData,
    updateField,
    resetForm,
    buildGenerationParams,
  };
};