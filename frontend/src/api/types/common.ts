export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiPrompt {
  id: number;
  title: string;
  description: string;
  negative_prompt?: string;
  tags: string[];
  prompt_type: string;
  created_at: string;
  updated_at: string;
}

export interface SessionHistoryItem {
  id: string;
  prompt_text: string;
  generator_type: string;
  created_at: string;
  parameters: Record<string, unknown>;
}

export interface UserSession {
  session_id: string;
  favorites: string[];
  history: SessionHistoryItem[];
  preferences: Record<string, unknown>;
}

export interface UpdateSessionRequest {
  session_id: string;
  favorites?: string[];
  history?: SessionHistoryItem[];
  preferences?: Record<string, unknown>;
}