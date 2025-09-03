// Export all API modules
export { apiClient } from './client';
export { PromptApi } from './promptApi';
export { SessionApi } from './sessionApi';

// Export types
export type { ApiResponse } from './client';
export type {
  ApiPrompt,
  GeneratePromptsRequest,
  GenerateAlienRequest,
  GenerateAdventurerRequest,
  UserSession,
  UpdateSessionRequest,
  SpeciesData,
} from './types';

export type {
  GeneratePromptsResponse,
  GenerateAliensResponse,
  GenerateAdventurersResponse,
  SpeciesResponse,
} from './promptApi';

export type {
  SessionResponse,
  SessionActionResponse,
} from './sessionApi';