import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONSTANTS } from '../constants/app';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler } from '../types/errors';
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
  
  // Collections
  collections: ImageCollection[];
  featuredCollections: ImageCollection[];
  collectionsLoading: boolean;
  
  // Queue and generation  
  queueItems: QueueStatusItem[];
  queueLoading: boolean;
  generationQueue: QueuedImageJob[];
  queue: QueueStatusItem[]; // Alias for compatibility
  queueError: string | null;
  
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
  
  // Compatibility methods for ImageGallery
  fetchImages: (filters?: ImageFilters) => Promise<void>;
  downloadImage: (image: GeneratedImage) => Promise<void>;
  updateFilters: (filters: Partial<ImageFilters>) => void;
  loadMore: () => Promise<void>;
  
  // Collections
  loadCollections: (filters?: { featured?: boolean; limit?: number; type?: string }) => Promise<void>;
  loadFeaturedCollections: () => Promise<void>;
  
  // Image generation queue
  queueImageGeneration: (request: QueueImageRequest) => Promise<QueuedImageJob>;
  checkQueueStatus: (sessionId?: string) => Promise<void>;
  cancelGeneration: (queueId: number) => Promise<void>;
  
  // Queue management methods for ImageQueue compatibility
  fetchQueue: () => Promise<void>;
  cancelQueueItem: (queueId: number) => Promise<void>;
  
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
      
      // Pagination compatibility object
      pagination: {
        current_page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 1,
        has_more: false
      },
      
      // Current filters
      filters: defaultFilters,
      
      collections: [],
      featuredCollections: [],
      collectionsLoading: false,
      
      queueItems: [],
      queueLoading: false,
      generationQueue: [],
      queue: [], // Alias for queueItems
      queueError: null,
      
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
      loadImages: async (filters: Partial<ImageFilters> = {}, append = false): Promise<void> => {
        const state = get();
        
        try {
          set({ loading: true, error: null });
          
          const mergedFilters = { ...state.currentFilters, ...filters };
          logger.info('Loading images with filters:', { filters: mergedFilters });
          
          const response = await ImageApi.getImages(mergedFilters);
          
          set((prevState) => ({
            images: append ? [...prevState.images, ...response.images] : response.images,
            currentPage: response.pagination.current_page,
            totalPages: response.pagination.total_pages,
            totalItems: response.pagination.total_items,
            hasMore: response.pagination.has_more,
            currentFilters: mergedFilters,
            filters: mergedFilters,
            pagination: response.pagination,
            loading: false
          }));
          
          logger.info(`Loaded ${response.images.length} images (total: ${response.pagination.total_items})`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load images:', { error: String(error) });
          set({ 
            loading: false, 
            error: errorMsg,
            lastError: new Date()
          });
          throw error;
        }
      },

      loadMoreImages: async (): Promise<void> => {
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

      refreshImages: async (): Promise<void> => {
        const state = get();
        await get().loadImages({ ...state.currentFilters, page: 1 }, false);
      },

      getImage: async (imageId: number): Promise<GeneratedImage | null> => {
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
          logger.error(`Failed to load image ${imageId}:`, { error: String(error), imageId });
          set({ error: errorMsg, lastError: new Date() });
          return null;
        }
      },

      setSelectedImage: (image: GeneratedImage | null): void => {
        set({ selectedImage: image });
      },

      loadCollections: async (filters: Record<string, unknown> = {}): Promise<void> => {
        try {
          set({ collectionsLoading: true, error: null });
          
          logger.info('Loading collections with filters:', { filters });
          const collections = await ImageApi.getCollections(filters);
          
          set({ 
            collections, 
            collectionsLoading: false 
          });
          
          logger.info(`Loaded ${collections.length} collections`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load collections:', { error: String(error) });
          set({ 
            collectionsLoading: false, 
            error: errorMsg,
            lastError: new Date()
          });
          throw error;
        }
      },

      loadFeaturedCollections: async (): Promise<void> => {
        try {
          const collections = await ImageApi.getCollections({ featured: true, limit: 10 });
          set({ featuredCollections: collections });
          logger.info(`Loaded ${collections.length} featured collections`);
        } catch (error) {
          logger.error('Failed to load featured collections:', { error: String(error) });
          // Don't set error state for featured collections as it's not critical
        }
      },

      queueImageGeneration: async (request: QueueImageRequest): Promise<QueuedImageJob> => {
        try {
          set({ error: null });
          
          logger.info('Queueing image generation:', { request });
          const queuedJob = await ImageApi.queueImageGeneration(request);
          
          set((state) => ({
            generationQueue: [...state.generationQueue, queuedJob]
          }));
          
          logger.info(`Image generation queued: ${queuedJob.prompt_id} (position: ${queuedJob.queue_position})`);
          return queuedJob;
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to queue image generation:', { error: String(error) });
          set({ error: errorMsg, lastError: new Date() });
          throw error;
        }
      },

      checkQueueStatus: async (sessionId?: string): Promise<void> => {
        try {
          set({ queueLoading: true, error: null });
          
          const queueItems = await ImageApi.getQueueStatus(sessionId || '');
          
          set({ 
            queueItems,
            queue: queueItems, // Update alias
            queueLoading: false,
            queueError: null
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
          logger.error('Failed to check queue status:', { error: String(error) });
          set({ 
            queueLoading: false,
            queueError: errorMsg,
            error: errorMsg,
            lastError: new Date()
          });
        }
      },

      cancelGeneration: async (queueId: number): Promise<void> => {
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
          logger.error(`Failed to cancel generation ${queueId}:`, { error: String(error), queueId });
          set({ error: errorMsg, lastError: new Date() });
          throw error;
        }
      },

      loadGalleryStats: async (type?: string): Promise<void> => {
        try {
          set({ statsLoading: true, error: null });
          
          const stats = await ImageApi.getGalleryStats(type);
          
          set({ 
            galleryStats: stats, 
            statsLoading: false 
          });
          
          logger.info('Gallery stats loaded:', { stats });
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load gallery stats:', { error: String(error) });
          set({ 
            statsLoading: false, 
            error: errorMsg,
            lastError: new Date()
          });
        }
      },

      setFilters: (filters: Partial<ImageFilters>): void => {
        set((state) => ({
          currentFilters: { ...state.currentFilters, ...filters, page: 1 }
        }));
      },

      resetFilters: (): void => {
        set({ currentFilters: defaultFilters });
      },

      setViewMode: (mode: 'grid' | 'list' | 'masonry'): void => {
        set({ viewMode: mode });
        logger.debug(`View mode changed to: ${mode}`);
      },

      setPreferences: (preferences: Partial<ImageState['preferences']>): void => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }));
      },

      clearError: (): void => {
        set({ error: null, lastError: null });
      },

      setError: (error: string): void => {
        set({ error, lastError: new Date() });
      },

      // Compatibility methods for components
      fetchImages: async (filters: Partial<ImageFilters> = {}): Promise<void> => {
        await get().loadImages(filters);
      },

      downloadImage: async (image: GeneratedImage): Promise<void> => {
        try {
          const downloadUrl = ImageApi.getDownloadUrl(image.id);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = image.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          logger.info(`Downloaded image: ${image.filename}`);
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to download image:', { error: String(error) });
          get().setError(errorMsg);
        }
      },

      updateFilters: (filters: Partial<ImageFilters>): void => {
        const state = get();
        const newFilters = { ...state.currentFilters, ...filters };
        set({ 
          currentFilters: newFilters,
          filters: newFilters,
          pagination: {
            ...state.pagination,
            current_page: newFilters.page || 1
          }
        });
      },

      loadMore: async (): Promise<void> => {
        await get().loadMoreImages();
      },

      fetchQueue: async (): Promise<void> => {
        await get().checkQueueStatus();
      },

      cancelQueueItem: async (queueId: number): Promise<void> => {
        await get().cancelGeneration(queueId);
      },

      // Utility methods
      findImageById: (imageId: number): GeneratedImage | null => {
        return get().images.find(img => img.id === imageId) || null;
      },

      getImagesByType: (type: string): GeneratedImage[] => {
        return get().images.filter(img => img.gallery_type === type);
      },

      getTotalImageCount: (): number => {
        return get().totalItems;
      },

      clearAll: (): void => {
        set({
          images: [],
          collections: [],
          featuredCollections: [],
          queueItems: [],
          queue: [],
          generationQueue: [],
          galleryStats: null,
          selectedImage: null,
          currentFilters: defaultFilters,
          filters: defaultFilters,
          pagination: {
            current_page: 1,
            per_page: 20,
            total_items: 0,
            total_pages: 1,
            has_more: false
          },
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasMore: false,
          error: null,
          lastError: null,
          queueError: null
        });
      }
    }),
    {
      name: APP_CONSTANTS.STORAGE.IMAGE_STORE_NAME || 'anime-prompt-gen-images',
      partialize: (state: ImageStore) => ({
        preferences: state.preferences,
        viewMode: state.viewMode,
        currentFilters: state.currentFilters
      }),
    }
  )
);