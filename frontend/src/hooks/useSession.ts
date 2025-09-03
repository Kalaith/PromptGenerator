import { useState, useCallback, useEffect } from 'react';
import { SessionApi } from '../api';
import type { SessionResponse } from '../api';
import { getSessionId } from '../utils/sessionManager';

interface UseSessionState {
  loading: boolean;
  error: string | null;
  sessionData: SessionResponse | null;
  sessionId: string;
}

interface UseSessionResult extends UseSessionState {
  addToFavorites: (promptId: string) => Promise<void>;
  removeFromFavorites: (promptId: string) => Promise<void>;
  addToHistory: (prompt: any) => Promise<void>;
  clearHistory: () => Promise<void>;
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export const useSession = (): UseSessionResult => {
  const [state, setState] = useState<UseSessionState>({
    loading: false,
    error: null,
    sessionData: null,
    sessionId: getSessionId(),
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setSessionData = useCallback((sessionData: SessionResponse | null) => {
    setState(prev => ({ ...prev, sessionData }));
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await SessionApi.getSession(state.sessionId);
      setSessionData(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load session';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [state.sessionId, setLoading, setError, setSessionData]);

  const addToFavorites = useCallback(async (promptId: string) => {
    try {
      setError(null);
      
      const response = await SessionApi.addToFavorites(state.sessionId, promptId);
      
      if (response.success && response.favorites) {
        setState(prev => ({
          ...prev,
          sessionData: prev.sessionData ? {
            ...prev.sessionData,
            favorites: response.favorites!,
          } : null,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to favorites';
      setError(errorMessage);
      throw error;
    }
  }, [state.sessionId, setError]);

  const removeFromFavorites = useCallback(async (promptId: string) => {
    try {
      setError(null);
      
      const response = await SessionApi.removeFromFavorites(state.sessionId, promptId);
      
      if (response.success && response.favorites) {
        setState(prev => ({
          ...prev,
          sessionData: prev.sessionData ? {
            ...prev.sessionData,
            favorites: response.favorites!,
          } : null,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from favorites';
      setError(errorMessage);
      throw error;
    }
  }, [state.sessionId, setError]);

  const addToHistory = useCallback(async (prompt: any) => {
    try {
      setError(null);
      
      const response = await SessionApi.addToHistory(state.sessionId, prompt);
      
      if (response.success && response.history) {
        setState(prev => ({
          ...prev,
          sessionData: prev.sessionData ? {
            ...prev.sessionData,
            history: response.history!,
          } : null,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to history';
      setError(errorMessage);
      throw error;
    }
  }, [state.sessionId, setError]);

  const clearHistory = useCallback(async () => {
    try {
      setError(null);
      
      const response = await SessionApi.clearHistory(state.sessionId);
      
      if (response.success && response.history) {
        setState(prev => ({
          ...prev,
          sessionData: prev.sessionData ? {
            ...prev.sessionData,
            history: response.history!,
          } : null,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear history';
      setError(errorMessage);
      throw error;
    }
  }, [state.sessionId, setError]);

  const updatePreferences = useCallback(async (preferences: Record<string, any>) => {
    try {
      setError(null);
      
      const response = await SessionApi.updatePreferences(state.sessionId, preferences);
      
      if (response.success && response.preferences) {
        setState(prev => ({
          ...prev,
          sessionData: prev.sessionData ? {
            ...prev.sessionData,
            preferences: response.preferences!,
          } : null,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      setError(errorMessage);
      throw error;
    }
  }, [state.sessionId, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Load session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    ...state,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
    clearHistory,
    updatePreferences,
    refreshSession,
    clearError,
  };
};