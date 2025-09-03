import { useCallback } from 'react';
import { usePromptGeneration } from './usePromptGeneration';
import { usePromptStore } from '../stores/promptStore';
import { useSession } from './useSession';
import { useSpeciesData, useTemplatesData } from './useDataFetching';
import { TemplateService } from '../services/templateService';
import { ValidationUtils } from '../utils/validation';
import { APP_CONSTANTS, GENERATOR_OPTIONS } from '../constants/app';
import type { Template } from '../api/types';
import type { AnimeGenerationParams } from '../types/components';
import { AppError, AppErrorHandler, ErrorType } from '../types/errors';

interface UseAnimeGenerationState {
  speciesData: ReturnType<typeof useSpeciesData>;
  templatesData: ReturnType<typeof useTemplatesData>;
  generation: ReturnType<typeof usePromptGeneration>;
}

interface UseAnimeGenerationActions {
  generatePrompts: (params: AnimeGenerationParams, template?: Template | null) => Promise<void>;
  validateParams: (params: AnimeGenerationParams) => AppError | null;
  getFormDefaults: () => AnimeGenerationParams;
}

export interface UseAnimeGenerationResult extends UseAnimeGenerationState, UseAnimeGenerationActions {}

export function useAnimeGeneration(): UseAnimeGenerationResult {
  const speciesData = useSpeciesData();
  const templatesData = useTemplatesData('anime');
  const generation = usePromptGeneration();
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { addToHistory } = useSession();

  const validateParams = useCallback((params: AnimeGenerationParams): AppError | null => {
    // Validate prompt count
    const countValidation = ValidationUtils.validatePromptCount(params.count);
    if (!countValidation.isValid && countValidation.error) {
      return countValidation.error;
    }

    // Validate type
    if (!ValidationUtils.isValidOption(params.type, [...GENERATOR_OPTIONS.TYPES, 'random'])) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        `Invalid generation type: ${params.type}`,
        'INVALID_TYPE'
      );
    }

    // Validate species if provided
    if (params.species && 
        params.species !== GENERATOR_OPTIONS.RANDOM && 
        speciesData.data && 
        !speciesData.data.includes(params.species)) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        `Invalid species: ${params.species}`,
        'INVALID_SPECIES'
      );
    }

    return null;
  }, [speciesData.data]);

  const generatePrompts = useCallback(async (
    params: AnimeGenerationParams, 
    template?: Template | null
  ): Promise<void> => {
    // Validate parameters
    const validationError = validateParams(params);
    if (validationError) {
      generation.setError(validationError);
      return;
    }

    try {
      // Apply template if provided
      const templateResult = await TemplateService.applyAndUseTemplate(template, {
        count: params.count,
        type: params.type === 'random' ? 'animalGirl' : params.type,
        ...(params.species !== GENERATOR_OPTIONS.RANDOM && { species: params.species }),
      });

      if (templateResult.error) {
        generation.setError(templateResult.error);
        return;
      }

      // Generate prompts
      const apiPrompts = await generation.generateAnimePrompts(templateResult.enhancedParams);
      
      if (apiPrompts.length > 0) {
        // Add to store
        addGeneratedPrompts(apiPrompts);
        
        // Add to history (fire and forget)
        apiPrompts.forEach(async (prompt) => {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              type: prompt.prompt_type,
              timestamp: new Date().toISOString(),
            });
          } catch (historyError) {
            console.warn('Failed to add to history:', historyError);
          }
        });
      }
    } catch (error) {
      // Error handling is managed by the generation hook
      console.error('Anime generation failed:', error);
    }
  }, [validateParams, generation, addGeneratedPrompts, addToHistory]);

  const getFormDefaults = useCallback((): AnimeGenerationParams => ({
    type: 'random',
    species: GENERATOR_OPTIONS.RANDOM,
    count: APP_CONSTANTS.PROMPT_COUNT.DEFAULT,
  }), []);

  return {
    // State
    speciesData,
    templatesData,
    generation,
    
    // Actions
    generatePrompts,
    validateParams,
    getFormDefaults,
  };
}