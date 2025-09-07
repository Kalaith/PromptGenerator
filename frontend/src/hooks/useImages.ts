import { useCallback, useEffect } from 'react';
import { useImageStore } from '../stores/imageStore';
import { useSession } from './useSession';
import { logger } from '../utils/logger';
import type { 
  ImageFilters, 
  QueueImageRequest, 
  GeneratedImage 
} from '../api/types';

/**
 * Hook for managing images and gallery functionality
 * Provides convenient methods for image operations and state management
 */
export const useImages = () => {
  const session = useSession();
  
  // Image store selectors
  const images = useImageStore(state => state.images);
  const loading = useImageStore(state => state.loading);
  const error = useImageStore(state => state.error);
  const hasMore = useImageStore(state => state.hasMore);
  const currentPage = useImageStore(state => state.currentPage);
  const totalItems = useImageStore(state => state.totalItems);
  const currentFilters = useImageStore(state => state.currentFilters);
  const selectedImage = useImageStore(state => state.selectedImage);
  const viewMode = useImageStore(state => state.viewMode);
  const preferences = useImageStore(state => state.preferences);
  
  // Collections
  const collections = useImageStore(state => state.collections);
  const featuredCollections = useImageStore(state => state.featuredCollections);
  const collectionsLoading = useImageStore(state => state.collectionsLoading);
  
  // Queue and generation
  const queueItems = useImageStore(state => state.queueItems);
  const queueLoading = useImageStore(state => state.queueLoading);
  const generationQueue = useImageStore(state => state.generationQueue);
  
  // Statistics
  const galleryStats = useImageStore(state => state.galleryStats);
  const statsLoading = useImageStore(state => state.statsLoading);
  
  // Actions
  const loadImages = useImageStore(state => state.loadImages);
  const loadMoreImages = useImageStore(state => state.loadMoreImages);
  const refreshImages = useImageStore(state => state.refreshImages);
  const getImage = useImageStore(state => state.getImage);
  const setSelectedImage = useImageStore(state => state.setSelectedImage);
  const loadCollections = useImageStore(state => state.loadCollections);
  const loadFeaturedCollections = useImageStore(state => state.loadFeaturedCollections);
  const queueImageGeneration = useImageStore(state => state.queueImageGeneration);
  const checkQueueStatus = useImageStore(state => state.checkQueueStatus);
  const cancelGeneration = useImageStore(state => state.cancelGeneration);
  const loadGalleryStats = useImageStore(state => state.loadGalleryStats);
  const setFilters = useImageStore(state => state.setFilters);
  const resetFilters = useImageStore(state => state.resetFilters);
  const setViewMode = useImageStore(state => state.setViewMode);
  const setPreferences = useImageStore(state => state.setPreferences);
  const clearError = useImageStore(state => state.clearError);
  const findImageById = useImageStore(state => state.findImageById);
  const getImagesByType = useImageStore(state => state.getImagesByType);

  // Enhanced methods with session integration
  const loadImagesWithSession = useCallback(async (filters?: Partial<ImageFilters>, append = false) => {
    const sessionFilters: ImageFilters = {
      ...filters,
      session_id: session.sessionId || undefined
    };
    
    try {
      await loadImages(sessionFilters, append);
    } catch (error) {
      logger.error('Failed to load images with session:', { error: String(error) });
      throw error;
    }
  }, [loadImages, session.sessionId]);

  const generateImage = useCallback(async (request: Omit<QueueImageRequest, 'session_id'>) => {
    const {sessionId} = session;
    if (!sessionId) {
      throw new Error('Session ID is required for image generation');
    }
    
    const fullRequest: QueueImageRequest = {
      ...request,
      session_id: sessionId,
      requested_by: sessionId
    };
    
    try {
      logger.info('Generating image with session:', { request: fullRequest });
      const queuedJob = await queueImageGeneration(fullRequest);
      
      // Auto-refresh queue status
      setTimeout(() => {
        if (sessionId) {
          checkQueueStatus(sessionId);
        }
      }, 2000);
      
      return queuedJob;
    } catch (error) {
      logger.error('Failed to generate image:', { error: String(error) });
      throw error;
    }
  }, [queueImageGeneration, checkQueueStatus, session.sessionId]);

  const refreshQueueStatus = useCallback(async () => {
    if (session.sessionId) {
      await checkQueueStatus(session.sessionId);
    }
  }, [checkQueueStatus, session.sessionId]);

  // Auto-refresh queue status periodically when there are pending jobs
  useEffect(() => {
    const hasPendingJobs = queueItems.some(item => 
      item.status === 'pending' || item.status === 'processing'
    );
    
    if (!hasPendingJobs || !session.sessionId) {
      return;
    }
    
    const interval = setInterval(() => {
      refreshQueueStatus();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [queueItems, refreshQueueStatus, session.sessionId]);

  // Filter helpers
  const filterByType = useCallback((type: string) => {
    setFilters({ type, page: 1 });
  }, [setFilters]);

  const filterBySort = useCallback((sort_by: 'recent' | 'popular' | 'views' | 'downloads') => {
    setFilters({ sort_by, page: 1 });
  }, [setFilters]);

  const toggleFeatured = useCallback(() => {
    setFilters({ featured: !currentFilters.featured, page: 1 });
  }, [setFilters, currentFilters.featured]);

  // Image selection helpers
  const selectImageById = useCallback(async (imageId: number) => {
    const image = await getImage(imageId);
    if (image) {
      setSelectedImage(image);
    }
    return image;
  }, [getImage, setSelectedImage]);

  const clearSelection = useCallback(() => {
    setSelectedImage(null);
  }, [setSelectedImage]);

  // Navigation helpers
  const goToNextImage = useCallback(() => {
    if (!selectedImage) return null;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex >= 0 && currentIndex < images.length - 1) {
      const nextImage = images[currentIndex + 1];
      setSelectedImage(nextImage || null);
      return nextImage || null;
    }
    return null;
  }, [selectedImage, images, setSelectedImage]);

  const goToPreviousImage = useCallback(() => {
    if (!selectedImage) return null;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex > 0) {
      const prevImage = images[currentIndex - 1];
      setSelectedImage(prevImage || null);
      return prevImage || null;
    }
    return null;
  }, [selectedImage, images, setSelectedImage]);

  // Statistics helpers
  const getTypeStats = useCallback((type?: string) => {
    if (!galleryStats) return null;
    
    if (type && galleryStats.by_type) {
      return galleryStats.by_type[type] || null;
    }
    
    return {
      total_images: galleryStats.total_images,
      total_views: galleryStats.total_views,
      total_downloads: galleryStats.total_downloads
    };
  }, [galleryStats]);

  // Queue management helpers
  const getPendingJobsCount = useCallback(() => {
    return queueItems.filter(item => item.status === 'pending').length;
  }, [queueItems]);

  const getProcessingJobsCount = useCallback(() => {
    return queueItems.filter(item => item.status === 'processing').length;
  }, [queueItems]);

  const getCompletedJobsCount = useCallback(() => {
    return queueItems.filter(item => item.status === 'completed').length;
  }, [queueItems]);

  // Load initial data when hook is first used
  useEffect(() => {
    if (images.length === 0 && !loading) {
      loadImagesWithSession();
    }
  }, []);

  return {
    // State
    images,
    loading,
    error,
    hasMore,
    currentPage,
    totalItems,
    currentFilters,
    selectedImage,
    viewMode,
    preferences,
    
    // Collections
    collections,
    featuredCollections,
    collectionsLoading,
    
    // Queue and generation
    queueItems,
    queueLoading,
    generationQueue,
    
    // Statistics
    galleryStats,
    statsLoading,
    
    // Core actions
    loadImages: loadImagesWithSession,
    loadMoreImages,
    refreshImages,
    getImage,
    setSelectedImage,
    generateImage,
    cancelGeneration,
    
    // Collections
    loadCollections,
    loadFeaturedCollections,
    
    // Statistics
    loadGalleryStats,
    getTypeStats,
    
    // Filters and preferences
    setFilters,
    resetFilters,
    filterByType,
    filterBySort,
    toggleFeatured,
    setViewMode,
    setPreferences,
    
    // Queue management
    refreshQueueStatus,
    getPendingJobsCount,
    getProcessingJobsCount,
    getCompletedJobsCount,
    
    // Image navigation
    selectImageById,
    clearSelection,
    goToNextImage,
    goToPreviousImage,
    
    // Utility functions
    clearError,
    findImageById,
    getImagesByType,
    
    // Computed values
    isEmpty: images.length === 0,
    isFiltered: JSON.stringify(currentFilters) !== JSON.stringify({ page: 1, limit: 20, public_only: true, sort_by: 'recent' }),
    hasSelection: !!selectedImage,
    canGoNext: !!selectedImage && images.findIndex(img => img.id === selectedImage.id) < images.length - 1,
    canGoPrevious: !!selectedImage && images.findIndex(img => img.id === selectedImage.id) > 0,
    
    // Queue status
    hasActiveJobs: queueItems.some(item => item.status === 'pending' || item.status === 'processing'),
    totalQueuedJobs: queueItems.length,
  };
};