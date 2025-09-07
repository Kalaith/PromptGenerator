import { apiClient } from './client';
import type { SessionHistoryItem } from './types';

export interface SessionResponse {
  session_id: string;
  favorites: string[];
  history: SessionHistoryItem[];
  preferences: Record<string, unknown>;
}

export interface SessionActionResponse {
  success: boolean;
  favorites?: string[];
  history?: SessionHistoryItem[];
  preferences?: Record<string, unknown>;
}

export class SessionApi {
  // Get user session
  static async getSession(sessionId: string): Promise<SessionResponse> {
    return apiClient.get<SessionResponse>(
      `/session?session_id=${encodeURIComponent(sessionId)}`
    );
  }

  // Add to favorites
  static async addToFavorites(
    sessionId: string,
    promptId: string
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/session/favorites/add', {
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
      '/session/favorites/remove',
      {
        session_id: sessionId,
        prompt_id: promptId,
      }
    );
  }

  // Add to history
  static async addToHistory(
    sessionId: string,
    prompt: SessionHistoryItem
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/session/history/add', {
      session_id: sessionId,
      prompt,
    });
  }

  // Clear history
  static async clearHistory(sessionId: string): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/session/history/clear', {
      session_id: sessionId,
    });
  }

  // Update preferences
  static async updatePreferences(
    sessionId: string,
    preferences: Record<string, unknown>
  ): Promise<SessionActionResponse> {
    return apiClient.post<SessionActionResponse>('/session/preferences', {
      session_id: sessionId,
      preferences,
    });
  }
}