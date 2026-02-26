import { useCallback } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from './usePromptGeneration';
import { useSession } from './useSession';
import { ValidationUtils } from '../utils/validation';
import type { ApiPrompt, SessionHistoryItem } from '../api';

interface GenerationParams {
  promptCount: number;
  selectedAttributes: Record<string, string | string[]>;
}

export const useAdventurerGeneration = () => {
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAdventurerPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  const addPromptsToHistory = useCallback(async (apiPrompts: ApiPrompt[]) => {
    for (const prompt of apiPrompts) {
      const historyItem: SessionHistoryItem = {
        id: String(prompt.id),
        prompt_text: prompt.description,
        generator_type: 'adventurer',
        created_at: new Date().toISOString(),
        parameters: {
          title: prompt.title,
          tags: prompt.tags,
        },
      };
      try {
        await addToHistory(historyItem);
      } catch {
        // Error logged by addToHistory function
      }
    }
  }, [addToHistory]);

  const buildGenerationParams = useCallback((params: GenerationParams) => {
    const { promptCount, selectedAttributes } = params;
    
    const safeCount = ValidationUtils.sanitizePromptCount(promptCount);
    return {
      count: safeCount,
      attributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
    };
  }, []);

  const handleGenerate = useCallback(async (params: GenerationParams): Promise<void> => {
    clearError();
    
    const validation = ValidationUtils.validatePromptCount(params.promptCount);
    if (!validation.isValid) {
      return;
    }
    
    const generationParams = buildGenerationParams(params);

    try {
      const apiPrompts = await generateAdventurerPrompts(generationParams);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        await addPromptsToHistory(apiPrompts);
      }
    } catch {
      // Error logged by generation function
    }
  }, [clearError, buildGenerationParams, generateAdventurerPrompts, addGeneratedPrompts, addPromptsToHistory]);

  return {
    handleGenerate,
    loading,
    error,
  };
};
