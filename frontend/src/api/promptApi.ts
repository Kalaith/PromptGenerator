import { apiClient } from './client';
import type {
  ApiPrompt,
  GeneratePromptsRequest,
  GenerateAlienRequest,
  GenerateAdventurerRequest,
  SpeciesData,
} from './types';

export interface GeneratePromptsResponse {
  success: boolean;
  data: {
    image_prompts: ApiPrompt[];
    errors: string[];
  };
}

export interface GenerateAliensResponse {
  image_prompts: ApiPrompt[];
  errors: string[];
}

export interface GenerateAdventurersResponse {
  image_prompts: ApiPrompt[];
  errors: string[];
}

export interface SpeciesResponse {
  species: SpeciesData[];
}

export class PromptApi {
  // Generate anime/animal girl prompts
  static async generatePrompts(
    request: GeneratePromptsRequest
  ): Promise<GeneratePromptsResponse> {
    return apiClient.post<GeneratePromptsResponse>(
      '/api/v1/prompts/generate',
      request
    );
  }

  // Generate alien prompts
  static async generateAliens(
    request: GenerateAlienRequest
  ): Promise<GenerateAliensResponse> {
    return apiClient.post<GenerateAliensResponse>(
      '/api/v1/aliens/generate',
      request
    );
  }

  // Generate adventurer prompts
  static async generateAdventurers(
    request: GenerateAdventurerRequest
  ): Promise<GenerateAdventurersResponse> {
    return apiClient.post<GenerateAdventurersResponse>(
      '/api/v1/adventurers/generate',
      request
    );
  }

  // Get available species
  static async getSpecies(): Promise<SpeciesResponse> {
    return apiClient.get<SpeciesResponse>('/api/v1/species');
  }

  // Get species types
  static async getSpeciesTypes(): Promise<{ types: string[] }> {
    return apiClient.get<{ types: string[] }>('/api/v1/species/types');
  }

  // Get alien species classes
  static async getAlienSpeciesClasses(): Promise<{ species_classes: string[] }> {
    return apiClient.get<{ species_classes: string[] }>(
      '/api/v1/aliens/species-classes'
    );
  }
}