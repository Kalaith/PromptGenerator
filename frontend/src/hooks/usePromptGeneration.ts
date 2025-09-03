import { useState, useCallback } from 'react';
import { PromptApi } from '../api';
import type {
  GeneratePromptsRequest,
  GenerateAlienRequest,
  GenerateAdventurerRequest,
  ApiPrompt,
} from '../api';

interface UsePromptGenerationState {
  loading: boolean;
  error: string | null;
}

interface UsePromptGenerationResult extends UsePromptGenerationState {
  generateAnimePrompts: (request: GeneratePromptsRequest) => Promise<ApiPrompt[]>;
  generateAlienPrompts: (request: GenerateAlienRequest) => Promise<ApiPrompt[]>;
  generateAdventurerPrompts: (request: GenerateAdventurerRequest) => Promise<ApiPrompt[]>;
  clearError: () => void;
}

export const usePromptGeneration = (): UsePromptGenerationResult => {
  const [state, setState] = useState<UsePromptGenerationState>({
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const generateAnimePrompts = useCallback(async (request: GeneratePromptsRequest): Promise<ApiPrompt[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromptApi.generatePrompts(request);
      
      if (response.data.errors && response.data.errors.length > 0) {
        throw new Error(response.data.errors.join(', '));
      }
      
      return response.data.image_prompts || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate anime prompts';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const generateAlienPrompts = useCallback(async (request: GenerateAlienRequest): Promise<ApiPrompt[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromptApi.generateAliens(request);
      
      if (response.errors && response.errors.length > 0) {
        throw new Error(response.errors.join(', '));
      }
      
      return response.image_prompts || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate alien prompts';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const generateAdventurerPrompts = useCallback(async (request: GenerateAdventurerRequest): Promise<ApiPrompt[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromptApi.generateAdventurers(request);
      
      if (response.errors && response.errors.length > 0) {
        throw new Error(response.errors.join(', '));
      }
      
      return response.image_prompts || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate adventurer prompts';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    ...state,
    generateAnimePrompts,
    generateAlienPrompts,
    generateAdventurerPrompts,
    clearError,
  };
};