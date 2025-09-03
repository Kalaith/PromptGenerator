import { useState, useCallback, useRef, useEffect } from 'react';
import { PromptApi } from '../api';
import { AppError, AppErrorHandler } from '../types/errors';
import type {
  GeneratePromptsRequest,
  GenerateAlienRequest,
  GenerateAdventurerRequest,
  ApiPrompt,
} from '../api';

interface UsePromptGenerationState {
  loading: boolean;
  error: AppError | null;
}

interface UsePromptGenerationResult extends UsePromptGenerationState {
  generateAnimePrompts: (request: GeneratePromptsRequest) => Promise<ApiPrompt[]>;
  generateAlienPrompts: (request: GenerateAlienRequest) => Promise<ApiPrompt[]>;
  generateAdventurerPrompts: (request: GenerateAdventurerRequest) => Promise<ApiPrompt[]>;
  clearError: () => void;
  setError: (error: AppError | null) => void;
}

export const usePromptGeneration = (): UsePromptGenerationResult => {
  const [state, setState] = useState<UsePromptGenerationState>({
    loading: false,
    error: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, loading }));
    }
  }, []);

  const setError = useCallback((error: AppError | null) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, error }));
    }
  }, []);

  const generateAnimePrompts = useCallback(async (request: GeneratePromptsRequest): Promise<ApiPrompt[]> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromptApi.generatePrompts(request);
      
      if (response.data.errors && response.data.errors.length > 0) {
        throw new Error(response.data.errors.join(', '));
      }
      
      return response.data.image_prompts || [];
    } catch (error) {
      const appError = (error && typeof error === 'object' && 'type' in error) 
        ? error as AppError 
        : AppErrorHandler.fromApiError(error);
      setError(appError);
      throw appError;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
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
      const appError = (error && typeof error === 'object' && 'type' in error) 
        ? error as AppError 
        : AppErrorHandler.fromApiError(error);
      setError(appError);
      throw appError;
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
      const appError = (error && typeof error === 'object' && 'type' in error) 
        ? error as AppError 
        : AppErrorHandler.fromApiError(error);
      setError(appError);
      throw appError;
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
    setError,
  };
};