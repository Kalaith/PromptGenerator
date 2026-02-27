import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONSTANTS } from '../constants/app';
import type { Prompt } from '../types/Prompt';
import type { ApiPrompt } from '../api/types';

// Convert API prompt to local Prompt type
const convertApiPrompt = (apiPrompt: ApiPrompt): Prompt => ({
  id: apiPrompt.id.toString(),
  title: apiPrompt.title,
  description: apiPrompt.description,
  negativePrompt: apiPrompt.negative_prompt || '',
  tags: apiPrompt.tags,
  type: apiPrompt.prompt_type,
  timestamp: new Date(apiPrompt.created_at).getTime(),
});

// Helper to filter new prompts
const filterNewPrompts = (convertedPrompts: Prompt[], existingPrompts: Prompt[]): Prompt[] =>
  convertedPrompts.filter(p => !existingPrompts.some(existing => existing.id === p.id));

// Helper to update history
const updateHistoryWithNewPrompts = (currentHistory: Prompt[], newPrompts: Prompt[], shouldSave: boolean): Prompt[] =>
  shouldSave ? [...currentHistory, ...newPrompts].slice(-APP_CONSTANTS.HISTORY.MAX_ITEMS) : currentHistory;

interface PromptState {
  generatedPrompts: Prompt[];
  currentPrompt: Prompt | null;
  // Note: favorites, history, and preferences are now managed by useSession hook
  // but we keep them here for local UI state and offline fallback
  localFavorites: string[];
  localHistory: Prompt[];
  localPreferences: {
    defaultTags: string[];
    includeNegativePrompt: boolean;
    saveHistory: boolean;
  };
}

interface PromptActions {
  addGeneratedPrompts: (prompts: ApiPrompt[]) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  // Local state management (for offline fallback)
  addToLocalFavorites: (promptId: string) => void;
  removeFromLocalFavorites: (promptId: string) => void;
  updateLocalPreferences: (preferences: Partial<PromptState['localPreferences']>) => void;
  clearLocalHistory: () => void;
  clearAll: () => void;
  // Utility methods
  convertApiPrompts: (apiPrompts: ApiPrompt[]) => Prompt[];
}

type PromptStore = PromptState & PromptActions;

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, _get) => ({
      // State
      generatedPrompts: [],
      currentPrompt: null,
      localFavorites: [],
      localHistory: [],
      localPreferences: {
        defaultTags: [],
        includeNegativePrompt: true,
        saveHistory: true,
      },

      // Actions
      addGeneratedPrompts: (apiPrompts: ApiPrompt[]): void => {
        set((state) => {
          const convertedPrompts = apiPrompts.map(convertApiPrompt);
          const newPrompts = filterNewPrompts(convertedPrompts, state.generatedPrompts);
          const updatedHistory = updateHistoryWithNewPrompts(
            state.localHistory,
            newPrompts,
            state.localPreferences.saveHistory
          );
          return {
            generatedPrompts: [...state.generatedPrompts, ...newPrompts],
            localHistory: updatedHistory,
          };
        });
      },

      setCurrentPrompt: (prompt: Prompt | null): void => {
        set({ currentPrompt: prompt });
      },

      // Local state management (for offline fallback)
      addToLocalFavorites: (promptId: string): void => {
        set((state) => ({
          localFavorites: state.localFavorites.includes(promptId)
            ? state.localFavorites
            : [...state.localFavorites, promptId],
        }));
      },

      removeFromLocalFavorites: (promptId: string): void => {
        set((state) => ({
          localFavorites: state.localFavorites.filter((id) => id !== promptId),
        }));
      },

      updateLocalPreferences: (newPreferences: Partial<PromptState['localPreferences']>): void => {
        set((state) => ({
          localPreferences: { ...state.localPreferences, ...newPreferences },
        }));
      },

      clearLocalHistory: (): void => {
        set({ localHistory: [], generatedPrompts: [] });
      },

      clearAll: (): void => {
        set({
          generatedPrompts: [],
          localFavorites: [],
          localHistory: [],
          currentPrompt: null,
        });
      },

      // Utility methods
      convertApiPrompts: (apiPrompts: ApiPrompt[]): Prompt[] => apiPrompts.map(convertApiPrompt),
    }),
    {
      name: APP_CONSTANTS.STORAGE.STORE_NAME,
      partialize: (state) => ({
        localFavorites: state.localFavorites,
        localHistory: state.localHistory,
        localPreferences: state.localPreferences,
      }),
    }
  )
);
