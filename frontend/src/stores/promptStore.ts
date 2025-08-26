import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prompt } from '../types/Prompt';

interface PromptState {
  generatedPrompts: Prompt[];
  favorites: string[];
  history: Prompt[];
  currentPrompt: Prompt | null;
  preferences: {
    defaultTags: string[];
    includeNegativePrompt: boolean;
    saveHistory: boolean;
  };
}

interface PromptActions {
  addGeneratedPrompts: (prompts: Prompt[]) => void;
  addToFavorites: (promptId: string) => void;
  removeFromFavorites: (promptId: string) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  updatePreferences: (preferences: Partial<PromptState['preferences']>) => void;
  clearHistory: () => void;
  clearAll: () => void;
}

type PromptStore = PromptState & PromptActions;

export const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      // State
      generatedPrompts: [],
      favorites: [],
      history: [],
      currentPrompt: null,
      preferences: {
        defaultTags: [],
        includeNegativePrompt: true,
        saveHistory: true,
      },

      // Actions
      addGeneratedPrompts: (prompts) =>
        set((state) => {
          const newPrompts = prompts.filter(
            (p) => !state.generatedPrompts.some((existing) => existing.id === p.id)
          );
          return {
            generatedPrompts: [...state.generatedPrompts, ...newPrompts],
            history: state.preferences.saveHistory
              ? [...state.history, ...newPrompts].slice(-50) // Keep last 50
              : state.history,
          };
        }),

      addToFavorites: (promptId) =>
        set((state) => ({
          favorites: state.favorites.includes(promptId)
            ? state.favorites
            : [...state.favorites, promptId],
        })),

      removeFromFavorites: (promptId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== promptId),
        })),

      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      clearHistory: () => set({ history: [], generatedPrompts: [] }),

      clearAll: () =>
        set({
          generatedPrompts: [],
          favorites: [],
          history: [],
          currentPrompt: null,
        }),
    }),
    {
      name: 'anime-prompt-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        preferences: state.preferences,
      }),
    }
  )
);