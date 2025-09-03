export interface ApiPrompt {
  id: number;
  title: string;
  description: string;
  negative_prompt?: string;
  tags: string[];
  prompt_type: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratePromptsRequest {
  count: number;
  type: 'animalGirl' | 'monster' | 'monsterGirl';
  species?: string;
  attributes?: Record<string, string>;
}

export interface GenerateAlienRequest {
  count: number;
  species_class?: string;
  climate?: string;
  positive_trait?: string;
  negative_trait?: string;
  style?: string;
  environment?: string;
  gender?: string;
}

export interface GenerateAdventurerRequest {
  count: number;
  class?: string;
  level?: number;
  equipment_tier?: string;
  background?: string;
}

export interface UserSession {
  session_id: string;
  favorites: string[];
  history: any[];
  preferences: Record<string, any>;
}

export interface UpdateSessionRequest {
  session_id: string;
  favorites?: string[];
  history?: any[];
  preferences?: Record<string, any>;
}

export interface SpeciesData {
  id: number;
  name: string;
  type: string;
  species_name?: string;
  ears?: string;
  tail?: string;
  wings?: string;
  features?: string[];
  personality?: string[];
  negative_prompt?: string;
  description_template?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}