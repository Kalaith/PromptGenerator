export interface GeneratePromptsRequest {
  count: number;
  type: 'animalGirl' | 'monster' | 'monsterGirl' | 'anime' | 'alien' | 'race' | 'random';
  species?: string;
  attributes?: Record<string, string>;
  templateId?: number;
  [key: string]: unknown;
}

export interface GenerateAlienRequest {
  count: number;
  templateId?: number | undefined;
  species_class?: string | undefined;
  climate?: string | undefined;
  positive_trait?: string | undefined;
  negative_trait?: string | undefined;
  style?: string | undefined;
  environment?: string | undefined;
  gender?: string | undefined;
  [key: string]: unknown;
}

export interface GenerateAdventurerRequest {
  count: number;
  race?: string;
  class?: string;
  experience?: string;
  gender?: string;
  style?: string;
  environment?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  eyeStyle?: string;
  templateId?: string;
}

export interface SpeciesData {
  id: number;
  name: string;
  type: 'anime' | 'alien' | 'fantasy' | 'sci_fi' | 'race';
  category: string;
  ears?: string;
  tail?: string;
  wings?: string;
  features?: string[];
  personality?: string[];
  key_traits?: string[];
  visual_descriptors?: string[];
  physical_features?: string[];
  ai_prompt_elements?: string;
  is_active: boolean;
  weight: number;
  created_at: string;
  updated_at: string;
}