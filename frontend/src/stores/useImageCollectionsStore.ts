import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler } from '../types/errors';
import { logger } from '../utils/logger';
import type { ImageCollectionsStore } from './imageStoreTypes';
import { 
  imageStoreUtils, 
  imagePersistConfig 
} from './imageStoreUtils';

export const useImageCollectionsStore = create<ImageCollectionsStore>()(
  persist(
    (set, _get) => ({
      // Initial state
      ...imageStoreUtils.createInitialCollectionsState(),

      // Collections loading actions
      loadCollections: async (filters: Record<string, unknown> = {}): Promise<void> => {
        try {
          set({ collectionsLoading: true });
          
          logger.info('Loading collections with filters:', { filters });
          const collections = await ImageApi.getCollections(filters);
          
          set({ 
            collections, 
            collectionsLoading: false 
          });
          
          logger.info(`Loaded ${collections.length} collections`);
          
        } catch (error) {
          AppErrorHandler.getErrorMessage(error);
          logger.error('Failed to load collections:', { error: String(error) });
          set({ 
            collectionsLoading: false
          });
          throw error;
        }
      },

      loadFeaturedCollections: async (): Promise<void> => {
        try {
          const collections = await ImageApi.getCollections({ 
            featured: true, 
            limit: 10 
          });
          
          set({ featuredCollections: collections });
          logger.info(`Loaded ${collections.length} featured collections`);
          
        } catch (error) {
          logger.error('Failed to load featured collections:', { error: String(error) });
          // Don't set error state for featured collections as it's not critical
          // Featured collections failure should not break the main app flow
        }
      }
    }),
    {
      ...imagePersistConfig,
      name: `${imagePersistConfig.name}-collections`,
      partialize: () => ({}) // No persistence needed for collections
    }
  )
);
