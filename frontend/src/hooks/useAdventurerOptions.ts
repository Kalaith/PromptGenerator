import { useState, useEffect, useCallback } from 'react';
import { PromptApi } from '../api';
import type { AdventurerOptions } from '../types/adventurer';

const EMPTY_OPTIONS: AdventurerOptions = {
  races: [],
  classes: [],
  experienceLevels: [],
  genders: [],
  artisticStyles: [],
  environments: [],
  hairColors: [],
  skinColors: [],
  eyeColors: [],
  eyeStyles: [],
};

export const useAdventurerOptions = () => {
  const [options, setOptions] = useState<AdventurerOptions>(EMPTY_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await PromptApi.getAdventurerOptions();
      setOptions(response);
    } catch {
      setError('Failed to load adventurer options');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  return {
    options,
    loading,
    error,
    refetch: loadOptions,
  };
};