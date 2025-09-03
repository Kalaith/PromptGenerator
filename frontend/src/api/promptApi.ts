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

  // Get all available adventurer options
  static async getAdventurerOptions(): Promise<{
    races: string[];
    classes: string[];
    experienceLevels: string[];
    genders: string[];
    artisticStyles: string[];
    environments: string[];
    hairColors: string[];
    skinColors: string[];
    eyeColors: string[];
    eyeStyles: string[];
  }> {
    return apiClient.get('/adventurers/options');
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