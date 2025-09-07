import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler } from '../types/errors';
import { logger } from '../utils/logger';
import type { ImageStatsStore } from './imageStoreTypes';
import { 
  imageStoreUtils, 
  imagePersistConfig 
} from './imageStoreUtils';

export const useImageStatsStore = create<ImageStatsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...imageStoreUtils.createInitialStatsState(),

      // Statistics loading actions
      loadGalleryStats: async (type?: string): Promise<void> => {
        try {
          set({ statsLoading: true });
          
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
            statsLoading: false
          });
          // Don't throw error for stats as it's not critical for main functionality
        }
      }
    }),
    {
      ...imagePersistConfig,
      name: `${imagePersistConfig.name}-stats`,
      partialize: () => ({}) // No persistence needed for stats
    }
  )
);