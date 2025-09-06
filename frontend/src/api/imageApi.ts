import { apiClient, type ApiResponse } from './client';
import type {
  QueueImageRequest,
  QueuedImageJob,
  GeneratedImage,
  ImageCollection,
  ImageFilters,
  ImageListResponse,
  QueueStatusItem,
  GalleryStats
} from './types';

export class ImageApi {
  // Image Generation Queue Management
  static async queueImageGeneration(request: QueueImageRequest): Promise<QueuedImageJob> {
    const response = await apiClient.post<ApiResponse<QueuedImageJob>>('/images/generate', request);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to queue image generation');
    }
    
    return response.data;
  }

  static async getQueueStatus(sessionId?: string): Promise<QueueStatusItem[]> {
    const params = new URLSearchParams();
    if (sessionId) {
      params.append('session_id', sessionId);
    }
    
    const endpoint = `/images/queue/status${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<QueueStatusItem[]>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get queue status');
    }
    
    return response.data;
  }

  static async cancelImageGeneration(queueId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<any>>(`/images/queue/${queueId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to cancel image generation');
    }
  }

  // Generated Images Management
  static async getImages(filters: ImageFilters = {}): Promise<ImageListResponse['data']> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const endpoint = `/images${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ImageListResponse>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get images');
    }
    
    return response.data;
  }

  static async getImage(imageId: number): Promise<GeneratedImage> {
    const response = await apiClient.get<ApiResponse<GeneratedImage>>(`/images/${imageId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get image');
    }
    
    return response.data;
  }

  // Collections Management
  static async getCollections(filters: {
    featured?: boolean;
    limit?: number;
    type?: string;
  } = {}): Promise<ImageCollection[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const endpoint = `/collections${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<ImageCollection[]>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get collections');
    }
    
    return response.data;
  }

  // Gallery Statistics
  static async getGalleryStats(type?: string): Promise<GalleryStats> {
    const params = new URLSearchParams();
    if (type) {
      params.append('type', type);
    }
    
    const endpoint = `/images/stats${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<GalleryStats>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get gallery stats');
    }
    
    return response.data;
  }

  // Helper Methods
  static getDownloadUrl(imageId: number): string {
    return `/api/v1/images/${imageId}/download`;
  }

  static buildImageFilters(options: {
    type?: string;
    page?: number;
    limit?: number;
    sessionId?: string;
    publicOnly?: boolean;
    featured?: boolean;
    sortBy?: 'recent' | 'popular' | 'views' | 'downloads';
  }): ImageFilters {
    return {
      type: options.type,
      page: options.page || 1,
      limit: options.limit || 20,
      session_id: options.sessionId,
      public_only: options.publicOnly !== false, // Default to true
      featured: options.featured,
      sort_by: options.sortBy || 'recent'
    };
  }
}