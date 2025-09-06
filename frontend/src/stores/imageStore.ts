import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONSTANTS } from '../constants/app';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler, ErrorType } from '../types/errors';
import { logger } from '../utils/logger';
import type {
  GeneratedImage,
  ImageCollection,
  QueuedImageJob,
  QueueStatusItem,
  GalleryStats,
  ImageFilters,
  QueueImageRequest
} from '../api/types';

interface ImageState {
  // Gallery images
  images: GeneratedImage[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
  loading: boolean;
  
  // Collections
  collections: ImageCollection[];
  featuredCollections: ImageCollection[];
  collectionsLoading: boolean;
  
  // Queue and generation
  queueItems: QueueStatusItem[];
  queueLoading: boolean;
  generationQueue: QueuedImageJob[];
  
  // Statistics
  galleryStats: GalleryStats | null;
  statsLoading: boolean;
  
  // Filters and settings
  currentFilters: ImageFilters;
  
  // UI state
  selectedImage: GeneratedImage | null;
  viewMode: 'grid' | 'list' | 'masonry';
  
  // Local preferences
  preferences: {
    defaultSortBy: 'recent' | 'popular' | 'views' | 'downloads';
    defaultPageSize: number;
    autoRefresh: boolean;
    showThumbnails: boolean;
  };
  
  // Error handling
  error: string | null;
  lastError: Date | null;
}

interface ImageActions {
  // Image loading and management
  loadImages: (filters?: ImageFilters, append?: boolean) => Promise<void>;
  loadMoreImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  getImage: (imageId: number) => Promise<GeneratedImage | null>;
  setSelectedImage: (image: GeneratedImage | null) => void;
  
  // Collections
  loadCollections: (filters?: { featured?: boolean; limit?: number; type?: string }) => Promise<void>;
  loadFeaturedCollections: () => Promise<void>;
  
  // Image generation queue
  queueImageGeneration: (request: QueueImageRequest) => Promise<QueuedImageJob>;
  checkQueueStatus: (sessionId?: string) => Promise<void>;
  cancelGeneration: (queueId: number) => Promise<void>;
  
  // Statistics
  loadGalleryStats: (type?: string) => Promise<void>;
  
  // Filter management
  setFilters: (filters: Partial<ImageFilters>) => void;
  resetFilters: () => void;
  
  // UI state management
  setViewMode: (mode: 'grid' | 'list' | 'masonry') => void;
  setPreferences: (preferences: Partial<ImageState['preferences']>) => void;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
  
  // Utility methods
  findImageById: (imageId: number) => GeneratedImage | null;
  getImagesByType: (type: string) => GeneratedImage[];
  getTotalImageCount: () => number;
  
  // Cleanup
  clearAll: () => void;
}

type ImageStore = ImageState & ImageActions;

const defaultFilters: ImageFilters = {
  page: 1,
  limit: 20,
  public_only: true,
  sort_by: 'recent'
};

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      // Initial State
      images: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasMore: false,
      loading: false,
      
      collections: [],
      featuredCollections: [],
      collectionsLoading: false,
      
      queueItems: [],
      queueLoading: false,
      generationQueue: [],
      
      galleryStats: null,
      statsLoading: false,
      
      currentFilters: defaultFilters,
      
      selectedImage: null,
      viewMode: 'grid',
      
      preferences: {
        defaultSortBy: 'recent',
        defaultPageSize: 20,
        autoRefresh: false,
        showThumbnails: true
      },
      
      error: null,
      lastError: null,

      // Actions
      loadImages: async (filters = {}, append = false) => {
        const state = get();
        
        try {
          set({ loading: true, error: null });
          
          const mergedFilters = { ...state.currentFilters, ...filters };
          logger.info('Loading images with filters:', mergedFilters);
          
          const response = await ImageApi.getImages(mergedFilters);
          
          set((prevState) => ({
            images: append ? [...prevState.images, ...response.images] : response.images,
            currentPage: response.pagination.current_page,
            totalPages: response.pagination.total_pages,
            totalItems: response.pagination.total_items,
            hasMore: response.pagination.has_more,
            currentFilters: mergedFilters,
            loading: false
          }));
          
          logger.info(`Loaded ${response.images.length} images (total: ${response.pagination.total_items})`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load images:', error);
          set({ 
            loading: false, 
            error: errorMsg,
            lastError: new Date()
          });
          throw error;
        }
      },

      loadMoreImages: async () => {
        const state = get();
        
        if (!state.hasMore || state.loading) {
          return;
        }
        
        const nextPageFilters = {
          ...state.currentFilters,
          page: state.currentPage + 1
        };
        
        await get().loadImages(nextPageFilters, true);
      },

      refreshImages: async () => {
        const state = get();
        await get().loadImages({ ...state.currentFilters, page: 1 }, false);
      },

      getImage: async (imageId: number) => {
        try {
          set({ error: null });
          
          // Check if image is already in store
          const existingImage = get().findImageById(imageId);
          if (existingImage) {
            return existingImage;
          }
          
          logger.info(`Loading image details for ID: ${imageId}`);
          const image = await ImageApi.getImage(imageId);
          
          // Update the image in the store if it exists
          set((state) => ({
            images: state.images.map(img => 
              img.id === imageId ? image : img
            )
          }));
          
          return image;
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error(`Failed to load image ${imageId}:`, error);
          set({ error: errorMsg, lastError: new Date() });
          return null;
        }
      },

      setSelectedImage: (image) => {
        set({ selectedImage: image });
      },

      loadCollections: async (filters = {}) => {
        try {
          set({ collectionsLoading: true, error: null });
          
          logger.info('Loading collections with filters:', filters);
          const collections = await ImageApi.getCollections(filters);
          
          set({ 
            collections, 
            collectionsLoading: false 
          });
          
          logger.info(`Loaded ${collections.length} collections`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load collections:', error);
          set({ 
            collectionsLoading: false, 
            error: errorMsg,
            lastError: new Date()
          });
          throw error;
        }
      },

      loadFeaturedCollections: async () => {
        try {
          const collections = await ImageApi.getCollections({ featured: true, limit: 10 });
          set({ featuredCollections: collections });
          logger.info(`Loaded ${collections.length} featured collections`);
        } catch (error) {
          logger.error('Failed to load featured collections:', error);
          // Don't set error state for featured collections as it's not critical
        }
      },

      queueImageGeneration: async (request) => {
        try {
          set({ error: null });
          
          logger.info('Queueing image generation:', request);
          const queuedJob = await ImageApi.queueImageGeneration(request);
          
          set((state) => ({
            generationQueue: [...state.generationQueue, queuedJob]
          }));
          
          logger.info(`Image generation queued: ${queuedJob.prompt_id} (position: ${queuedJob.queue_position})`);
          return queuedJob;
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to queue image generation:', error);
          set({ error: errorMsg, lastError: new Date() });
          throw error;
        }
      },

      checkQueueStatus: async (sessionId) => {
        try {
          set({ queueLoading: true, error: null });
          
          const queueItems = await ImageApi.getQueueStatus(sessionId);
          
          set({ 
            queueItems, 
            queueLoading: false 
          });
          
          // Update generation queue with current status
          set((state) => ({
            generationQueue: state.generationQueue.map(job => {
              const statusUpdate = queueItems.find(item => item.prompt_id === job.prompt_id);
              return statusUpdate ? { ...job, status: statusUpdate.status } : job;
            })
          }));
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to check queue status:', error);
          set({ 
            queueLoading: false, 
            error: errorMsg,
            lastError: new Date()
          });
        }
      },

      cancelGeneration: async (queueId) => {
        try {
          set({ error: null });
          
          logger.info(`Cancelling image generation: ${queueId}`);
          await ImageApi.cancelImageGeneration(queueId);
          
          // Remove from generation queue
          set((state) => ({
            generationQueue: state.generationQueue.filter(job => job.queue_id !== queueId),
            queueItems: state.queueItems.map(item => 
              item.id === queueId ? { ...item, status: 'cancelled' as const } : item
            )
          }));
          
          logger.info(`Image generation cancelled: ${queueId}`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error(`Failed to cancel generation ${queueId}:`, error);
          set({ error: errorMsg, lastError: new Date() });
          throw error;
        }
      },

      loadGalleryStats: async (type) => {
        try {
          set({ statsLoading: true, error: null });
          
          const stats = await ImageApi.getGalleryStats(type);
          
          set({ 
            galleryStats: stats, 
            statsLoading: false 
          });
          
          logger.info('Gallery stats loaded:', stats);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load gallery stats:', error);
          set({ 
            statsLoading: false, 
            error: errorMsg,
            lastError: new Date()
          });
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          currentFilters: { ...state.currentFilters, ...filters, page: 1 }
        }));
      },

      resetFilters: () => {
        set({ currentFilters: defaultFilters });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
        logger.debug(`View mode changed to: ${mode}`);
      },

      setPreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }));
      },

      clearError: () => {
        set({ error: null, lastError: null });
      },

      setError: (error) => {
        set({ error, lastError: new Date() });
      },

      // Utility methods
      findImageById: (imageId) => {
        return get().images.find(img => img.id === imageId) || null;
      },

      getImagesByType: (type) => {
        return get().images.filter(img => img.gallery_type === type);
      },

      getTotalImageCount: () => {
        return get().totalItems;
      },

      clearAll: () => {
        set({
          images: [],
          collections: [],
          featuredCollections: [],
          queueItems: [],
          generationQueue: [],
          galleryStats: null,
          selectedImage: null,
          currentFilters: defaultFilters,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasMore: false,
          error: null,
          lastError: null
        });
      }
    }),
    {
      name: APP_CONSTANTS.STORAGE.IMAGE_STORE_NAME || 'anime-prompt-gen-images',
      partialize: (state) => ({
        preferences: state.preferences,
        viewMode: state.viewMode,
        currentFilters: state.currentFilters
      }),
    }
  )
);