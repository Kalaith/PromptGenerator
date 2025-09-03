// Generate a unique session ID
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `session_${timestamp}_${random}`;
};

// Get or create session ID from localStorage
export const getSessionId = (): string => {
  const STORAGE_KEY = 'anime-prompt-session-id';
  
  let sessionId = localStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
};

// Clear session ID (for logout/reset)
export const clearSessionId = (): void => {
  const STORAGE_KEY = 'anime-prompt-session-id';
  localStorage.removeItem(STORAGE_KEY);
};