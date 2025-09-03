// Export all API modules
export { apiClient } from './client';
export { PromptApi } from './promptApi';
export { SessionApi } from './sessionApi';
export { TemplateApi } from './templateApi';
export { DescriptionTemplateApi } from './descriptionTemplateApi';

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
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateFilters,
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

export type {
  TemplatesResponse,
  TemplateResponse,
  TemplateActionResponse,
} from './templateApi';

export type {
  DescriptionTemplate,
  CreateDescriptionTemplateRequest,
  UpdateDescriptionTemplateRequest,
  DescriptionTemplatesResponse,
  DescriptionTemplateResponse,
  DescriptionTemplateActionResponse,
} from './descriptionTemplateApi';