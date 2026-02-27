import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { useImageGalleryStore } from './useImageGalleryStore';
import { useImageCollectionsStore } from './useImageCollectionsStore';
import { useImageQueueStore } from './useImageQueueStore';
import { useImageStatsStore } from './useImageStatsStore';
import type { ImageStore } from './imageStoreTypes';
import { 
  imageStoreUtils, 
  imagePersistConfig 
} from './imageStoreUtils';

/**
 * Combined image store that maintains backwards compatibility
 * This store combines all the smaller specialized stores into one interface
 * to preserve existing component integrations.
 */
export const useImageStore = create<ImageStore>()(
  subscribeWithSelector(
    persist<ImageStore>(
      (set, _get) => ({
        // Initial combined state
        ...imageStoreUtils.createInitialGalleryState(),
        ...imageStoreUtils.createInitialCollectionsState(),
        ...imageStoreUtils.createInitialQueueState(),
        ...imageStoreUtils.createInitialStatsState(),
        ...imageStoreUtils.createInitialPreferencesState(),

        // Gallery actions - delegate with proper binding
        loadImages: useImageGalleryStore.getState().loadImages,
        loadMoreImages: useImageGalleryStore.getState().loadMoreImages,
        refreshImages: useImageGalleryStore.getState().refreshImages,
        getImage: useImageGalleryStore.getState().getImage,
        setSelectedImage: useImageGalleryStore.getState().setSelectedImage,
        setFilters: useImageGalleryStore.getState().setFilters,
        resetFilters: useImageGalleryStore.getState().resetFilters,
        setViewMode: useImageGalleryStore.getState().setViewMode,
        setPreferences: useImageGalleryStore.getState().setPreferences,
        fetchImages: useImageGalleryStore.getState().fetchImages,
        downloadImage: useImageGalleryStore.getState().downloadImage,
        updateFilters: useImageGalleryStore.getState().updateFilters,
        loadMore: useImageGalleryStore.getState().loadMore,
        findImageById: useImageGalleryStore.getState().findImageById,
        getImagesByType: useImageGalleryStore.getState().getImagesByType,
        getTotalImageCount: useImageGalleryStore.getState().getTotalImageCount,
        clearError: useImageGalleryStore.getState().clearError,
        setError: useImageGalleryStore.getState().setError,

        // Collections actions
        loadCollections: useImageCollectionsStore.getState().loadCollections,
        loadFeaturedCollections: useImageCollectionsStore.getState().loadFeaturedCollections,

        // Queue actions
        queueImageGeneration: useImageQueueStore.getState().queueImageGeneration,
        checkQueueStatus: useImageQueueStore.getState().checkQueueStatus,
        cancelGeneration: useImageQueueStore.getState().cancelGeneration,
        fetchQueue: useImageQueueStore.getState().fetchQueue,
        cancelQueueItem: useImageQueueStore.getState().cancelQueueItem,

        // Stats actions
        loadGalleryStats: useImageStatsStore.getState().loadGalleryStats,

        // Cleanup
        clearAll: () => {
          set({
            ...imageStoreUtils.createInitialGalleryState(),
            ...imageStoreUtils.createInitialCollectionsState(),
            ...imageStoreUtils.createInitialQueueState(),
            ...imageStoreUtils.createInitialStatsState(),
            ...imageStoreUtils.createInitialPreferencesState()
          });
        }
      }),
      imagePersistConfig
    )
  )
);
