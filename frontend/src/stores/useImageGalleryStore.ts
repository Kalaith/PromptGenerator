import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler } from '../types/errors';
import { logger } from '../utils/logger';
import type { ImageFilters, GeneratedImage } from '../api/types';
import type { ImageGalleryStore } from './imageStoreTypes';
import { 
  imageStoreUtils, 
  defaultFilters, 
  imagePersistConfig 
} from './imageStoreUtils';

export const useImageGalleryStore = create<ImageGalleryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...imageStoreUtils.createInitialGalleryState(),

      // Gallery image loading actions
      loadImages: async (filters: Partial<ImageFilters> = {}, append = false): Promise<void> => {
        const state = get();
        
        try {
          set(imageStoreUtils.createLoadingState(true));
          
          const mergedFilters = imageStoreUtils.mergeFilters(state.currentFilters, filters);
          logger.info('Loading images with filters:', { filters: mergedFilters });
          
          const response = await ImageApi.getImages(mergedFilters);
          
          set((prevState: ImageGalleryStore) => ({
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
            ...imageStoreUtils.createLoadingState(false),
            ...imageStoreUtils.createErrorState(errorMsg)
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
        const refreshFilters = imageStoreUtils.resetFiltersToPageOne(state.currentFilters);
        await get().loadImages(refreshFilters, false);
      },

      getImage: async (imageId: number): Promise<GeneratedImage | null> => {
        try {
          set(imageStoreUtils.clearErrorState());
          
          // Check if image is already in store
          const existingImage = get().findImageById(imageId);
          if (existingImage) {
            return existingImage;
          }
          
          logger.info(`Loading image details for ID: ${imageId}`);
          const image = await ImageApi.getImage(imageId);
          
          // Update the image in the store if it exists
          set((state: ImageGalleryStore) => ({
            images: imageStoreUtils.updateImageInArray(state.images, image)
          }));
          
          return image;
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error(`Failed to load image ${imageId}:`, { error: String(error), imageId });
          set(imageStoreUtils.createErrorState(errorMsg));
          return null;
        }
      },

      setSelectedImage: (image: GeneratedImage | null): void => {
        set({ selectedImage: image });
      },

      // Filter management
      setFilters: (filters: Partial<ImageFilters>): void => {
        set((state: ImageGalleryStore) => ({
          currentFilters: { 
            ...state.currentFilters, 
            ...imageStoreUtils.resetFiltersToPageOne(filters)
          }
        }));
      },
      resetFilters: (): void => {
        set({ currentFilters: { ...defaultFilters } });
      },

      // UI state management
      setViewMode: (mode: 'grid' | 'list' | 'masonry'): void => {
        set({ viewMode: mode });
        logger.debug(`View mode changed to: ${mode}`);
      },

      setPreferences: (preferences: Partial<{ defaultSortBy: 'recent' | 'popular' | 'views' | 'downloads'; defaultPageSize: number; autoRefresh: boolean; showThumbnails: boolean; }>): void => {
        set((state: ImageGalleryStore) => ({
          preferences: { ...state.preferences, ...preferences }
        }));
      },

      // Compatibility methods for ImageGallery component
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
        const newFilters = imageStoreUtils.mergeFilters(state.currentFilters, filters);
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

      // Utility methods
      findImageById: (imageId: number): GeneratedImage | null => {
        return imageStoreUtils.findImageById(get().images, imageId);
      },

      getImagesByType: (type: string): GeneratedImage[] => {
        return imageStoreUtils.getImagesByType(get().images, type);
      },

      getTotalImageCount: (): number => {
        return get().totalItems;
      },

      // Error handling
      clearError: (): void => {
        set(imageStoreUtils.clearErrorState());
      },

      setError: (error: string): void => {
        set(imageStoreUtils.createErrorState(error));
      }
    }),
    {
      ...imagePersistConfig,
      name: `${imagePersistConfig.name}-gallery`
    }
  )
);