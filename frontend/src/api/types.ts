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
  type: 'animalGirl' | 'monster' | 'monsterGirl' | 'anime' | 'alien' | 'race' | 'random';
  species?: string;
  attributes?: Record<string, string>;
  templateId?: number;
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

export interface Template {
  id: number;
  name: string;
  description?: string;
  type: 'anime' | 'alien';
  template_data: Record<string, unknown>;
  is_public: boolean;
  is_active: boolean;
  created_by?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: 'anime' | 'alien';
  template_data: Record<string, unknown>;
  is_public?: boolean;
  created_by?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  template_data?: Record<string, unknown>;
  is_public?: boolean;
}

export interface TemplateFilters {
  type?: 'anime' | 'alien';
  public_only?: boolean;
  created_by?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

// Dynamic attribute types
export interface AttributeOption {
  value: string;
  label: string | null;
  weight: number;
}

export interface AttributeConfig {
  label: string;
  type: 'select' | 'multi-select';
  options: AttributeOption[];
}

export interface AnimeAttributesResponse {
  success: boolean;
  data: {
    attributes: Record<string, AttributeConfig>;
  };
}