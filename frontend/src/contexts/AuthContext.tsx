import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface User {
  id: string;
  email: string;
  display_name?: string;
  username?: string;
  is_guest?: boolean;
  auth_type?: 'frontpage' | 'guest';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authMode: 'frontpage' | 'guest' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  getLinkAccountUrl: () => string;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'anime-prompt-gen-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'frontpage' | 'guest' | null>(null);
  const [loading, setLoading] = useState(true);
  const hasAttemptedGuestLinkRef = useRef(false);

  const saveAuth = useCallback((nextUser: User, nextToken: string, nextMode: 'frontpage' | 'guest') => {
    setUser(nextUser);
    setToken(nextToken);
    setAuthMode(nextMode);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      token: nextToken,
      user: nextUser,
      authMode: nextMode,
    }));
    localStorage.setItem('auth_token', nextToken);
    localStorage.setItem('token', nextToken);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthMode(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
  }, []);

  const getLinkAccountUrl = useCallback(() => {
    const base = import.meta.env.VITE_WEBHATCHERY_SIGNUP_URL || '/signup';
    if (user?.is_guest) {
      try {
        const url = new URL(base, window.location.origin);
        url.searchParams.set('guest_user_id', user.id);
        url.searchParams.set('redirect', window.location.href);
        return url.toString();
      } catch {
        return `${base}?guest_user_id=${user.id}`;
      }
    }
    return base;
  }, [user]);

  const fetchJson = async (url: string, init: RequestInit = {}) => {
    const response = await fetch(url, init);
    const raw = await response.text();
    const data = raw ? JSON.parse(raw) : null;
    if (!response.ok || !data?.success) {
      throw new Error(data?.error || data?.message || 'Request failed');
    }
    return data;
  };

  useEffect(() => {
    const bootstrap = async () => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored) as { token?: string; user?: User; authMode?: 'frontpage' | 'guest' | null };
        if (!parsed?.token) {
          clearAuth();
          setLoading(false);
          return;
        }

        const result = await fetchJson('/api/v1/auth/current-user', {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
          },
        });

        saveAuth(result.data as User, parsed.token, ((result.data?.is_guest ? 'guest' : 'frontpage') as 'frontpage' | 'guest'));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [clearAuth, saveAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await fetchJson('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    saveAuth(result.data.user as User, result.data.token as string, 'frontpage');
  }, [saveAuth]);

  const register = useCallback(async (email: string, password: string) => {
    await fetchJson('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    await login(email, password);
  }, [login]);

  const continueAsGuest = useCallback(async () => {
    const result = await fetchJson('/api/v1/auth/guest-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    saveAuth(result.data.user as User, result.data.token as string, 'guest');
  }, [saveAuth]);

  useEffect(() => {
    const guestUserId = new URL(window.location.href).searchParams.get('guest_user_id');
    if (!guestUserId || !token || authMode !== 'frontpage' || hasAttemptedGuestLinkRef.current) {
      return;
    }

    hasAttemptedGuestLinkRef.current = true;
    void (async () => {
      try {
        await fetchJson('/api/v1/auth/link-guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ guest_user_id: guestUserId }),
        });
      } finally {
        const url = new URL(window.location.href);
        url.searchParams.delete('guest_user_id');
        window.history.replaceState({}, '', url.toString());
      }
    })();
  }, [authMode, token]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    authMode,
    login,
    register,
    continueAsGuest,
    getLinkAccountUrl,
    logout,
    loading,
  }), [authMode, continueAsGuest, getLinkAccountUrl, loading, login, logout, register, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
