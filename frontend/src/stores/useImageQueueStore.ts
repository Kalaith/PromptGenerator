import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageApi } from '../api/imageApi';
import { AppErrorHandler } from '../types/errors';
import { logger } from '../utils/logger';
import type { QueueImageRequest, QueuedImageJob } from '../api/types';
import type { ImageQueueStore } from './imageStoreTypes';
import { 
  imageStoreUtils, 
  imagePersistConfig 
} from './imageStoreUtils';

export const useImageQueueStore = create<ImageQueueStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...imageStoreUtils.createInitialQueueState(),

      // Queue generation actions
      queueImageGeneration: async (request: QueueImageRequest): Promise<QueuedImageJob> => {
        try {
          set({ queueError: null });
          
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
          set({ queueError: errorMsg });
          throw error;
        }
      },

      checkQueueStatus: async (sessionId?: string): Promise<void> => {
        try {
          set({ queueLoading: true, queueError: null });
          
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
            queueError: errorMsg
          });
        }
      },

      cancelGeneration: async (queueId: number): Promise<void> => {
        try {
          set({ queueError: null });
          
          logger.info(`Cancelling image generation: ${queueId}`);
          await ImageApi.cancelImageGeneration(queueId);
          
          // Remove from generation queue and update status
          set((state) => ({
            generationQueue: state.generationQueue.filter(job => job.queue_id !== queueId),
            queueItems: state.queueItems.map(item => 
              item.id === queueId ? { ...item, status: 'cancelled' as const } : item
            ),
            queue: state.queue.map(item => 
              item.id === queueId ? { ...item, status: 'cancelled' as const } : item
            )
          }));
          
          logger.info(`Image generation cancelled: ${queueId}`);
          
        } catch (error) {
          const errorMsg = AppErrorHandler.getErrorMessage(error);
          logger.error(`Failed to cancel generation ${queueId}:`, { error: String(error), queueId });
          set({ queueError: errorMsg });
          throw error;
        }
      },

      // Compatibility methods for ImageQueue component
      fetchQueue: async (): Promise<void> => {
        await get().checkQueueStatus();
      },

      cancelQueueItem: async (queueId: number): Promise<void> => {
        await get().cancelGeneration(queueId);
      }
    }),
    {
      ...imagePersistConfig,
      name: `${imagePersistConfig.name}-queue`,
      partialize: () => ({}) // No persistence needed for queue data
    }
  )
);