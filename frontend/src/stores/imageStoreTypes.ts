import type {
  GeneratedImage,
  ImageCollection,
  QueuedImageJob,
  QueueStatusItem,
  GalleryStats,
  ImageFilters,
  QueueImageRequest
} from '../api/types';

// Core state interfaces
export interface ImageGalleryState {
  // Gallery images
  images: GeneratedImage[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
  loading: boolean;
  
  // Pagination object for compatibility
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_more: boolean;
  };
  
  // Current filters for compatibility
  filters: ImageFilters;
  currentFilters: ImageFilters;
  
  // UI state
  selectedImage: GeneratedImage | null;
  viewMode: 'grid' | 'list' | 'masonry';
  
  // Error handling
  error: string | null;
  lastError: Date | null;
}

export interface ImageCollectionsState {
  collections: ImageCollection[];
  featuredCollections: ImageCollection[];
  collectionsLoading: boolean;
}

export interface ImageQueueState {
  queueItems: QueueStatusItem[];
  queueLoading: boolean;
  generationQueue: QueuedImageJob[];
  queue: QueueStatusItem[]; // Alias for compatibility
  queueError: string | null;
}

export interface ImageStatsState {
  galleryStats: GalleryStats | null;
  statsLoading: boolean;
}

export interface ImagePreferencesState {
  preferences: {
    defaultSortBy: 'recent' | 'popular' | 'views' | 'downloads';
    defaultPageSize: number;
    autoRefresh: boolean;
    showThumbnails: boolean;
  };
}

// Combined state interface
export interface ImageState extends
  ImageGalleryState,
  ImageCollectionsState,
  ImageQueueState,
  ImageStatsState,
  ImagePreferencesState {}

// Action interfaces
export interface ImageGalleryActions {
  // Image loading and management
  loadImages: (filters?: ImageFilters, append?: boolean) => Promise<void>;
  loadMoreImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  getImage: (imageId: number) => Promise<GeneratedImage | null>;
  setSelectedImage: (image: GeneratedImage | null) => void;
  
  // Compatibility methods for ImageGallery
  fetchImages: (filters?: ImageFilters) => Promise<void>;
  downloadImage: (image: GeneratedImage) => Promise<void>;
  updateFilters: (filters: Partial<ImageFilters>) => void;
  loadMore: () => Promise<void>;
  
  // Filter management
  setFilters: (filters: Partial<ImageFilters>) => void;
  resetFilters: () => void;
  
  // UI state management
  setViewMode: (mode: 'grid' | 'list' | 'masonry') => void;
  setPreferences: (preferences: Partial<ImagePreferencesState['preferences']>) => void;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
  
  // Utility methods
  findImageById: (imageId: number) => GeneratedImage | null;
  getImagesByType: (type: string) => GeneratedImage[];
  getTotalImageCount: () => number;
}

export interface ImageCollectionsActions {
  // Collections
  loadCollections: (filters?: { featured?: boolean; limit?: number; type?: string }) => Promise<void>;
  loadFeaturedCollections: () => Promise<void>;
}

export interface ImageQueueActions {
  // Image generation queue
  queueImageGeneration: (request: QueueImageRequest) => Promise<QueuedImageJob>;
  checkQueueStatus: (sessionId?: string) => Promise<void>;
  cancelGeneration: (queueId: number) => Promise<void>;
  
  // Queue management methods for ImageQueue compatibility
  fetchQueue: () => Promise<void>;
  cancelQueueItem: (queueId: number) => Promise<void>;
}

export interface ImageStatsActions {
  // Statistics
  loadGalleryStats: (type?: string) => Promise<void>;
}

export interface ImageErrorActions {
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
}

export interface ImageUtilityActions {
  // Cleanup
  clearAll: () => void;
}

// Combined actions interface
export interface ImageActions extends
  ImageGalleryActions,
  ImageCollectionsActions,
  ImageQueueActions,
  ImageStatsActions,
  ImageErrorActions,
  ImageUtilityActions {}

// Complete store type
export type ImageStore = ImageState & ImageActions;

// Individual store types
export type ImageGalleryStore = ImageGalleryState & ImageGalleryActions & ImagePreferencesState;
export type ImageCollectionsStore = ImageCollectionsState & ImageCollectionsActions;
export type ImageQueueStore = ImageQueueState & ImageQueueActions;
export type ImageStatsStore = ImageStatsState & ImageStatsActions;