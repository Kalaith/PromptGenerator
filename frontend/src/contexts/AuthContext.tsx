import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { requiredEnv } from '../config/env';

interface User {
  id: string;
  email: string;
  display_name?: string;
  username?: string;
  role?: string;
  roles?: string[];
  is_guest?: boolean;
  auth_type?: 'frontpage' | 'guest';
}

type AuthMode = 'frontpage' | 'guest' | null;

interface FrontpageStoredUser {
  id?: number | string;
  username?: string;
  display_name?: string;
  role?: string;
  email?: string;
}

interface GuestStoredSession {
  token: string;
  user: User;
}

interface AuthApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  login_url?: string;
}

interface GuestSessionPayload {
  token: string;
  user: User;
  expires_in?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authMode: AuthMode;
  loginWithRedirect: () => void;
  continueAsGuest: () => Promise<void>;
  getLoginUrl: () => string;
  getLinkAccountUrl: () => string;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FRONTPAGE_AUTH_STORAGE_KEY = 'auth-storage';
const GUEST_AUTH_STORAGE_KEY = 'anime-prompt-gen-guest-session';
const AUTH_MODE_STORAGE_KEY = 'anime-prompt-gen-auth-mode';

const buildAuthApiUrl = (path: string): string => {
  const baseUrl = requiredEnv('VITE_API_URL').replace(/\/+$/, '');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

const withRedirectParam = (basePath: string): string => {
  try {
    const url = new URL(basePath, window.location.origin);
    url.searchParams.set('redirect', window.location.href);
    return url.toString();
  } catch {
    return basePath;
  }
};

const appendQueryParam = (urlValue: string, key: string, value: string): string => {
  try {
    const url = new URL(urlValue, window.location.origin);
    url.searchParams.set(key, value);
    return url.toString();
  } catch {
    return urlValue;
  }
};

const getFrontpageLoginUrl = (): string => withRedirectParam(requiredEnv('VITE_WEBHATCHERY_LOGIN_URL'));
const getFrontpageSignupUrl = (): string => withRedirectParam(requiredEnv('VITE_WEBHATCHERY_SIGNUP_URL'));

const readFrontpageToken = (): string | null => {
  const authStorage = localStorage.getItem(FRONTPAGE_AUTH_STORAGE_KEY);
  if (!authStorage) {
    return null;
  }

  try {
    const parsed = JSON.parse(authStorage) as { state?: { token?: string | null } };
    const token = parsed?.state?.token;
    return typeof token === 'string' && token.trim() !== '' ? token : null;
  } catch {
    return null;
  }
};

const readFrontpageUser = (): FrontpageStoredUser | null => {
  const authStorage = localStorage.getItem(FRONTPAGE_AUTH_STORAGE_KEY);
  if (!authStorage) {
    return null;
  }

  try {
    const parsed = JSON.parse(authStorage) as { state?: { user?: FrontpageStoredUser | null } };
    return parsed?.state?.user ?? null;
  } catch {
    return null;
  }
};

const readGuestSession = (): GuestStoredSession | null => {
  const raw = localStorage.getItem(GUEST_AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as GuestStoredSession;
    if (!parsed?.token || !parsed?.user?.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const saveGuestSession = (session: GuestStoredSession): void => {
  localStorage.setItem(GUEST_AUTH_STORAGE_KEY, JSON.stringify(session));
};

const clearGuestSession = (): void => {
  localStorage.removeItem(GUEST_AUTH_STORAGE_KEY);
};

const readPreferredAuthMode = (): AuthMode => {
  const raw = localStorage.getItem(AUTH_MODE_STORAGE_KEY);
  return raw === 'frontpage' || raw === 'guest' ? raw : null;
};

const savePreferredAuthMode = (mode: AuthMode): void => {
  if (mode === null) {
    localStorage.removeItem(AUTH_MODE_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_MODE_STORAGE_KEY, mode);
};

const readStoredAuth = (): { token: string | null; mode: AuthMode; guestUser: User | null } => {
  const preferredMode = readPreferredAuthMode();
  const frontpageToken = readFrontpageToken();
  const guest = readGuestSession();

  if (preferredMode === 'frontpage' && frontpageToken) {
    return { token: frontpageToken, mode: 'frontpage', guestUser: null };
  }

  if (preferredMode === 'guest' && guest?.token) {
    return { token: guest.token, mode: 'guest', guestUser: guest.user };
  }

  if (frontpageToken) {
    return { token: frontpageToken, mode: 'frontpage', guestUser: null };
  }

  if (guest?.token) {
    return { token: guest.token, mode: 'guest', guestUser: guest.user };
  }

  return { token: null, mode: null, guestUser: null };
};

const fetchJson = async <T,>(url: string, init: RequestInit = {}): Promise<AuthApiResponse<T>> => {
  const response = await fetch(url, init);
  const raw = await response.text();
  const data = raw ? (JSON.parse(raw) as AuthApiResponse<T>) : null;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  }

  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [loading, setLoading] = useState(true);
  const hasAttemptedGuestLinkRef = useRef(false);

  const setActiveAuth = useCallback((nextToken: string | null, nextMode: AuthMode, nextUser: User | null): void => {
    setToken(nextToken);
    setAuthMode(nextMode);
    setUser(nextUser);

    if (nextToken) {
      localStorage.setItem('auth_token', nextToken);
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
    }

    savePreferredAuthMode(nextMode);
  }, []);

  const clearAuth = useCallback(() => {
    setActiveAuth(null, null, null);
  }, [setActiveAuth]);

  const refreshCurrentUser = useCallback(async (nextToken: string, mode: AuthMode, guestUser: User | null): Promise<void> => {
    const result = await fetchJson<User>(buildAuthApiUrl('/auth/current-user'), {
      headers: {
        Authorization: `Bearer ${nextToken}`,
      },
    });

    const apiUser = result.data;
    if (!apiUser) {
      throw new Error('Authentication response did not include a user');
    }

    const frontpageUser = mode === 'frontpage' ? readFrontpageUser() : null;
    const isGuest = Boolean(apiUser.is_guest || mode === 'guest');
    setActiveAuth(nextToken, isGuest ? 'guest' : 'frontpage', {
      ...apiUser,
      id: apiUser.id || guestUser?.id || '',
      username: mode === 'frontpage' ? (frontpageUser?.username || apiUser.username) : apiUser.username,
      display_name:
        mode === 'frontpage'
          ? (frontpageUser?.display_name || frontpageUser?.username || apiUser.display_name)
          : apiUser.display_name,
      email: mode === 'frontpage' ? (frontpageUser?.email || apiUser.email) : apiUser.email,
      role: mode === 'frontpage' ? (frontpageUser?.role || apiUser.role || 'user') : (apiUser.role || 'guest'),
      is_guest: isGuest,
      auth_type: isGuest ? 'guest' : 'frontpage',
    });
  }, [setActiveAuth]);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = readStoredAuth();
      if (!stored.token || !stored.mode) {
        clearAuth();
        setLoading(false);
        return;
      }

      if (stored.mode === 'guest' && stored.guestUser) {
        setActiveAuth(stored.token, 'guest', stored.guestUser);
      } else {
        setActiveAuth(stored.token, 'frontpage', null);
      }

      try {
        await refreshCurrentUser(stored.token, stored.mode, stored.guestUser);
      } catch {
        if (stored.mode === 'guest') {
          clearGuestSession();
        }
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [clearAuth, refreshCurrentUser, setActiveAuth]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== FRONTPAGE_AUTH_STORAGE_KEY && event.key !== GUEST_AUTH_STORAGE_KEY) {
        return;
      }

      const stored = readStoredAuth();
      if (!stored.token || !stored.mode) {
        clearAuth();
        return;
      }

      void refreshCurrentUser(stored.token, stored.mode, stored.guestUser);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [clearAuth, refreshCurrentUser]);

  const loginWithRedirect = useCallback(() => {
    const frontpageToken = readFrontpageToken();
    if (frontpageToken) {
      setActiveAuth(frontpageToken, 'frontpage', null);
      void refreshCurrentUser(frontpageToken, 'frontpage', null);
      return;
    }

    savePreferredAuthMode('frontpage');
    window.location.href = getFrontpageLoginUrl();
  }, [refreshCurrentUser, setActiveAuth]);

  const continueAsGuest = useCallback(async () => {
    setLoading(true);
    try {
      const existingSession = readGuestSession();
      if (existingSession?.token && existingSession.user) {
        await refreshCurrentUser(existingSession.token, 'guest', existingSession.user);
        return;
      }

      const result = await fetchJson<GuestSessionPayload>(buildAuthApiUrl('/auth/guest-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!result.data?.token || !result.data?.user) {
        throw new Error('Guest session response was incomplete');
      }

      const guestSession: GuestStoredSession = {
        token: result.data.token,
        user: {
          ...result.data.user,
          is_guest: true,
          auth_type: 'guest',
        },
      };

      saveGuestSession(guestSession);
      setActiveAuth(guestSession.token, 'guest', guestSession.user);
    } finally {
      setLoading(false);
    }
  }, [refreshCurrentUser, setActiveAuth]);

  const getLoginUrl = useCallback(() => getFrontpageLoginUrl(), []);

  const getLinkAccountUrl = useCallback(() => {
    const base = getFrontpageSignupUrl();
    if (user?.is_guest && user.id) {
      return appendQueryParam(base, 'guest_user_id', user.id);
    }

    return base;
  }, [user]);

  useEffect(() => {
    const guestUserId = new URL(window.location.href).searchParams.get('guest_user_id');
    const guestSession = readGuestSession();
    if (
      !guestUserId
      || !guestSession?.token
      || !token
      || authMode !== 'frontpage'
      || hasAttemptedGuestLinkRef.current
    ) {
      return;
    }

    hasAttemptedGuestLinkRef.current = true;
    void (async () => {
      try {
        const frontpageUser = readFrontpageUser();
        await fetchJson(buildAuthApiUrl('/auth/link-guest'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            guest_user_id: guestUserId,
            guest_token: guestSession.token,
            frontpage_user: {
              id: frontpageUser?.id != null ? String(frontpageUser.id) : undefined,
              email: frontpageUser?.email,
              username: frontpageUser?.username,
              display_name: frontpageUser?.display_name,
              role: frontpageUser?.role,
            },
          }),
        });
        clearGuestSession();
      } finally {
        const url = new URL(window.location.href);
        url.searchParams.delete('guest_user_id');
        window.history.replaceState({}, '', url.toString());
      }
    })();
  }, [authMode, token]);

  const logout = useCallback(() => {
    if (authMode === 'guest') {
      clearGuestSession();
    }

    clearAuth();
  }, [authMode, clearAuth]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    authMode,
    loginWithRedirect,
    continueAsGuest,
    getLoginUrl,
    getLinkAccountUrl,
    logout,
    loading,
  }), [authMode, continueAsGuest, getLinkAccountUrl, getLoginUrl, loading, loginWithRedirect, logout, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
