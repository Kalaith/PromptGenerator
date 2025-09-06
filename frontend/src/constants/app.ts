export const APP_CONSTANTS = {
  PROMPT_COUNT: {
    MIN: 1,
    MAX: 50,
    DEFAULT: 10,
    MAX_SAFE: 50, // Maximum for single generation to prevent server overload
  },
  HISTORY: {
    MAX_ITEMS: 50,
  },
  API: {
    TIMEOUT_MS: 30000,
    DEFAULT_BASE_URL: 'http://localhost:8080/api/v1',
  },
  UI: {
    DEBOUNCE_MS: 300,
    ERROR_DISPLAY_DURATION_MS: 5000,
  },
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MIN_STRING_LENGTH: 1,
  },
  STORAGE: {
    STORE_NAME: 'anime-prompt-storage',
    IMAGE_STORE_NAME: 'anime-prompt-gen-images',
  },
} as const;

export const PROMPT_TYPES = {
  ANIME: 'anime',
  ALIEN: 'alien', 
  ADVENTURER: 'adventurer',
} as const;

export const GENERATOR_OPTIONS = {
  RANDOM: 'random',
  GENDERS: ['male', 'female'],
  TYPES: ['animalGirl', 'monster', 'monsterGirl'],
} as const;

export type PromptType = typeof PROMPT_TYPES[keyof typeof PROMPT_TYPES];
export type GeneratorType = typeof GENERATOR_OPTIONS.TYPES[number];
export type Gender = typeof GENERATOR_OPTIONS.GENDERS[number];