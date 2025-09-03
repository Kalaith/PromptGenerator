import { apiClient } from './client';
import type { UserSession } from './types';

export interface SessionResponse {
  session_id: string;
  favorites: string[];
  history: any[];
  preferences: Record<string, any>;
}

export interface SessionActionResponse {
  success: boolean;
  favorites?: string[];
  history?: any[];
  preferences?: Record<string, any>;
}

export class SessionApi {
  // Get user session
  static async getSession(sessionId: string): Promise<SessionResponse> {
    return apiClient.get<SessionResponse>(
      `/api/v1/session?session_id=${encodeURIComponent(sessionId)}`
    );
  }

  // Add to favorites
  static async addToFavorites(
    sessionId: string,
    promptId: string
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/api/v1/session/favorites/add', {
      session_id: sessionId,
      prompt_id: promptId,
    });
  }

  // Remove from favorites
  static async removeFromFavorites(
    sessionId: string,
    promptId: string
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>(
      '/api/v1/session/favorites/remove',
      {
        session_id: sessionId,
        prompt_id: promptId,
      }
    );
  }

  // Add to history
  static async addToHistory(
    sessionId: string,
    prompt: any
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/api/v1/session/history/add', {
      session_id: sessionId,
      prompt,
    });
  }

  // Clear history
  static async clearHistory(sessionId: string): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/api/v1/session/history/clear', {
      session_id: sessionId,
    });
  }

  // Update preferences
  static async updatePreferences(
    sessionId: string,
    preferences: Record<string, any>
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/api/v1/session/preferences', {
      session_id: sessionId,
      preferences,
    });
  }
}