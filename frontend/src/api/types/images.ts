// Gallery and Queue types
export type GalleryType = 'anime' | 'alien' | 'race' | 'monster' | 'monsterGirl' | 'animalGirl';

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
  requested_by: string;
  session_id: string;
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