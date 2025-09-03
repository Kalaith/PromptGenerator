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
  success: boolean;
  data: {
    species: SpeciesData[];
  };
}

export class PromptApi {
  // Generate anime/animal girl prompts
  static async generatePrompts(
    request: GeneratePromptsRequest
  ): Promise<GeneratePromptsResponse> {
    return apiClient.post<GeneratePromptsResponse>(
      '/prompts/generate',
      request
    );
  }

  // Generate alien prompts
  static async generateAliens(
    request: GenerateAlienRequest
  ): Promise<GenerateAliensResponse> {
    return apiClient.post<GenerateAliensResponse>(
      '/aliens/generate',
      request
    );
  }

  // Generate adventurer prompts
  static async generateAdventurers(
    request: GenerateAdventurerRequest
  ): Promise<GenerateAdventurersResponse> {
    return apiClient.post<GenerateAdventurersResponse>(
      '/adventurers/generate',
      request
    );
  }

  // Get available adventurer races
  static async getAdventurerRaces(): Promise<{ races: string[] }> {
    return apiClient.get<{ races: string[] }>('/adventurers/races');
  }

  // Get available adventurer classes
  static async getAdventurerClasses(): Promise<{ classes: string[] }> {
    return apiClient.get<{ classes: string[] }>('/adventurers/classes');
  }

  // Get available species
  static async getSpecies(): Promise<SpeciesResponse> {
    return apiClient.get<SpeciesResponse>('/species');
  }

  // Get species types
  static async getSpeciesTypes(): Promise<{ types: string[] }> {
    return apiClient.get<{ types: string[] }>('/species/types');
  }

  // Get alien species classes
  static async getAlienSpeciesClasses(): Promise<{ species_classes: string[] }> {
    return apiClient.get<{ species_classes: string[] }>(
      '/aliens/species-classes'
    );
  }
}