import { useState, useEffect, useCallback, useRef } from 'react';
import { AppError, AppErrorHandler } from '../types/errors';

interface UseDataFetchingState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  lastFetched: Date | null;
}

interface UseDataFetchingOptions {
  immediate?: boolean;
  cacheTime?: number; // in milliseconds
  retryCount?: number;
  retryDelay?: number;
}

interface UseDataFetchingResult<T> extends UseDataFetchingState<T> {
  refetch: () => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

export function useDataFetching<T>(
  fetchFunction: () => Promise<T>,
  options: UseDataFetchingOptions = {}
): UseDataFetchingResult<T> {
  const {
    immediate = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    retryCount = 2,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseDataFetchingState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateState = useCallback((updates: Partial<UseDataFetchingState<T>>) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const fetchData = useCallback(async (attempt = 0): Promise<void> => {
    // Check if data is still fresh
    if (state.data && state.lastFetched && cacheTime > 0) {
      const timeSinceLastFetch = Date.now() - state.lastFetched.getTime();
      if (timeSinceLastFetch < cacheTime) {
        return; // Use cached data
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    updateState({ loading: true, error: null });

    try {
      const data = await fetchFunction();
      updateState({
        data,
        loading: false,
        lastFetched: new Date(),
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore aborted requests
      }

      const appError = error && typeof error === 'object' && 'type' in error
        ? error as AppError
        : AppErrorHandler.fromApiError(error);

      // Retry logic
      if (attempt < retryCount) {
        retryTimeoutRef.current = setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
        return;
      }

      updateState({ 
        loading: false, 
        error: appError,
      });
    } finally {
      abortControllerRef.current = null;
    }
  }, [fetchFunction, cacheTime, retryCount, retryDelay, updateState, state.data, state.lastFetched]);

  const refetch = useCallback(async () => {
    // Force refetch by clearing lastFetched
    setState(prev => ({ ...prev, lastFetched: null }));
    await fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearData = useCallback(() => {
    updateState({ data: null, lastFetched: null });
  }, [updateState]);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    clearError,
    clearData,
  };
}

// Specialized hooks for common data fetching patterns
export function useSpeciesData() {
  return useDataFetching(
    async () => {
      const { PromptApi } = await import('../api');
      const response = await PromptApi.getSpecies();
      return response.data.species
        .filter(s => s.is_active !== false)
        .map(s => s.name);
    },
    { cacheTime: 10 * 60 * 1000 } // Cache for 10 minutes
  );
}

export function useTemplatesData(type?: 'anime' | 'alien') {
  return useDataFetching(
    async () => {
      const { TemplateApi } = await import('../api');
      return await TemplateApi.getPublicTemplates(type);
    },
    { cacheTime: 5 * 60 * 1000 } // Cache for 5 minutes
  );
}

export function useAlienSpeciesClassesData() {
  return useDataFetching(
    async () => {
      const { PromptApi } = await import('../api');
      const response = await PromptApi.getAlienSpeciesClasses();
      return response.species_classes;
    },
    { cacheTime: 10 * 60 * 1000 } // Cache for 10 minutes
  );
}