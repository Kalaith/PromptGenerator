import { APP_CONSTANTS } from '../constants/app';
import type { ImageFilters, GeneratedImage } from '../api/types';
import type { ImageState } from './imageStoreTypes';

// Default filters configuration
export const defaultFilters: ImageFilters = {
  page: 1,
  limit: 20,
  public_only: true,
  sort_by: 'recent'
};

// Default preferences
export const defaultPreferences: ImageState['preferences'] = {
  defaultSortBy: 'recent',
  defaultPageSize: 20,
  autoRefresh: false,
  showThumbnails: true
};

// Default pagination object
export const defaultPagination = {
  current_page: 1,
  per_page: 20,
  total_items: 0,
  total_pages: 1,
  has_more: false
};

// Persistence configuration
export const imagePersistConfig = {
  name: APP_CONSTANTS.STORAGE.IMAGE_STORE_NAME || 'anime-prompt-gen-images',
  partialize: (state: ImageState) => ({
    preferences: state.preferences,
    viewMode: state.viewMode,
    currentFilters: state.currentFilters
  }),
};

// Utility functions
export const imageStoreUtils = {
  /**
   * Create initial gallery state
   */
  createInitialGalleryState: () => ({
    images: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
    loading: false,
    pagination: { ...defaultPagination },
    filters: { ...defaultFilters },
    currentFilters: { ...defaultFilters },
    selectedImage: null,
    viewMode: 'grid' as const,
    error: null,
    lastError: null,
  }),

  /**
   * Create initial collections state
   */
  createInitialCollectionsState: () => ({
    collections: [],
    featuredCollections: [],
    collectionsLoading: false,
  }),

  /**
   * Create initial queue state
   */
  createInitialQueueState: () => ({
    queueItems: [],
    queueLoading: false,
    generationQueue: [],
    queue: [], // Alias for queueItems
    queueError: null,
  }),

  /**
   * Create initial stats state
   */
  createInitialStatsState: () => ({
    galleryStats: null,
    statsLoading: false,
  }),

  /**
   * Create initial preferences state
   */
  createInitialPreferencesState: () => ({
    preferences: { ...defaultPreferences },
  }),

  /**
   * Find image by ID in array
   */
  findImageById: (images: GeneratedImage[], imageId: number): GeneratedImage | null => {
    return images.find(img => img.id === imageId) || null;
  },

  /**
   * Filter images by type
   */
  getImagesByType: (images: GeneratedImage[], type: string): GeneratedImage[] => {
    return images.filter(img => img.gallery_type === type);
  },

  /**
   * Update image in array
   */
  updateImageInArray: (images: GeneratedImage[], updatedImage: GeneratedImage): GeneratedImage[] => {
    return images.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    );
  },

  /**
   * Remove image from array by ID
   */
  removeImageFromArray: (images: GeneratedImage[], imageId: number): GeneratedImage[] => {
    return images.filter(img => img.id !== imageId);
  },

  /**
   * Merge filters with defaults
   */
  mergeFilters: (currentFilters: ImageFilters, newFilters: Partial<ImageFilters>): ImageFilters => {
    return { ...currentFilters, ...newFilters };
  },

  /**
   * Reset filters to page 1 (useful for filter changes)
   */
  resetFiltersToPageOne: (filters: Partial<ImageFilters>): Partial<ImageFilters> => {
    return { ...filters, page: 1 };
  },

  /**
   * Create error state update
   */
  createErrorState: (error: string) => ({
    error,
    lastError: new Date(),
  }),

  /**
   * Clear error state
   */
  clearErrorState: () => ({
    error: null,
    lastError: null,
  }),

  /**
   * Create loading state update
   */
  createLoadingState: (loading: boolean) => ({
    loading,
    error: null,
  }),
};
