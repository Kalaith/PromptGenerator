import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    (set, get) => ({
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
      addGeneratedPrompts: (apiPrompts) =>
        set((state) => {
          const convertedPrompts = apiPrompts.map(convertApiPrompt);
          const newPrompts = convertedPrompts.filter(
            (p) => !state.generatedPrompts.some((existing) => existing.id === p.id)
          );
          return {
            generatedPrompts: [...state.generatedPrompts, ...newPrompts],
            localHistory: state.localPreferences.saveHistory
              ? [...state.localHistory, ...newPrompts].slice(-50) // Keep last 50
              : state.localHistory,
          };
        }),

      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

      // Local state management (for offline fallback)
      addToLocalFavorites: (promptId) =>
        set((state) => ({
          localFavorites: state.localFavorites.includes(promptId)
            ? state.localFavorites
            : [...state.localFavorites, promptId],
        })),

      removeFromLocalFavorites: (promptId) =>
        set((state) => ({
          localFavorites: state.localFavorites.filter((id) => id !== promptId),
        })),

      updateLocalPreferences: (newPreferences) =>
        set((state) => ({
          localPreferences: { ...state.localPreferences, ...newPreferences },
        })),

      clearLocalHistory: () => set({ localHistory: [], generatedPrompts: [] }),

      clearAll: () =>
        set({
          generatedPrompts: [],
          localFavorites: [],
          localHistory: [],
          currentPrompt: null,
        }),

      // Utility methods
      convertApiPrompts: (apiPrompts) => apiPrompts.map(convertApiPrompt),
    }),
    {
      name: 'anime-prompt-storage',
      partialize: (state) => ({
        localFavorites: state.localFavorites,
        localHistory: state.localHistory,
        localPreferences: state.localPreferences,
      }),
    }
  )
);