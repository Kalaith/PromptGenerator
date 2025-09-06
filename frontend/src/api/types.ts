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
  type: string;
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
  type: string;
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
  type?: string;
  public_only?: boolean;
  created_by?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

// Gallery and Queue types
export type GalleryType = 'public' | 'session' | 'featured' | 'collections';

export interface ImageQueueItem {
  id: number;
  prompt_id?: number;
  generator_type: string;
  prompt_text: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  width: number;
  height: number;
  generation_params: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  progress?: number;
  estimated_completion?: string;
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

// Image Generation Types
export interface QueueImageRequest {
  generator_type: 'anime' | 'alien' | 'race' | 'monster' | 'monsterGirl' | 'animalGirl';
  prompt_text: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  model?: string;
  sampler?: string;
  scheduler?: string;
  priority?: number;
  requested_by?: string;
  session_id?: string;
  original_prompt_data?: Record<string, unknown>;
}

export interface QueuedImageJob {
  prompt_id: string;
  queue_id: number;
  queue_position: number;
  estimated_completion?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

export interface ImageGenerationParams {
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  steps: number;
  cfg_scale: number;
  seed: number;
  model: string;
  sampler: string;
  scheduler: string;
}

export interface GeneratedImage {
  id: number;
  prompt_id: string;
  filename: string;
  gallery_type: string;
  gallery_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  dimensions: string;
  aspect_ratio?: number;
  file_size_bytes?: number;
  file_size: string;
  format: string;
  generation_params: ImageGenerationParams;
  view_count: number;
  download_count: number;
  is_featured: boolean;
  is_landscape: boolean;
  is_portrait: boolean;
  is_square: boolean;
  download_url: string;
  collections: ImageCollection[];
  created_at: string;
  updated_at: string;
}

export interface ImageCollection {
  id: number;
  name: string;
  description?: string;
  generator_type?: string;
  is_featured: boolean;
  cover_image_url?: string;
  image_count: number;
  preview_images: Array<{
    id: number;
    thumbnail_url: string;
  }>;
  stats: {
    image_count: number;
    total_views: number;
    total_downloads: number;
    average_rating: number;
    created_date: string;
    last_updated: string;
  };
  url: string;
  created_at: string;
}

export interface ImageFilters {
  type?: string | undefined;
  limit?: number;
  page?: number;
  session_id?: string | undefined;
  public_only?: boolean;
  featured?: boolean | undefined;
  sort_by?: 'recent' | 'popular' | 'views' | 'downloads';
}

export interface ImageListResponse {
  success: boolean;
  message?: string;
  data: {
    images: GeneratedImage[];
    pagination: {
      current_page: number;
      per_page: number;
      total_items: number;
      total_pages: number;
      has_more: boolean;
    };
  };
}

export interface QueueStatusItem {
  id: number;
  prompt_id: string;
  generator_type: string;
  prompt_text: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  queue_position?: number;
  estimated_completion?: string;
  processing_duration?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryStats {
  total_images: number;
  total_views: number;
  total_downloads: number;
  by_type?: Record<string, {
    total_images: number;
    total_views: number;
    total_downloads: number;
    average_size_mb: number;
  }>;
}