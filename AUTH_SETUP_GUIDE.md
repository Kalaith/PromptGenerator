# JWT Authentication Setup Guide

## Overview

This guide documents the JWT-based authentication system implemented in the Anime Prompt Generator. The system provides secure user authentication with the following features:

- **JWT Token-based Authentication** - Stateless authentication using JSON Web Tokens
- **Role-based Access Control** - Public routes vs. protected management routes
- **Persistent Sessions** - Tokens stored in localStorage for session persistence
- **API Protection** - Automatic Authorization header injection for authenticated requests
- **Debug Tools** - Built-in debugging interface for troubleshooting authentication issues

## Architecture

### Components

1. **Backend (PHP/Slim Framework)**
   - JWT token generation and validation
   - Protected route middleware
   - User authentication endpoints

2. **Frontend (React/TypeScript)**
   - Authentication context and state management
   - Login/register forms with validation
   - Conditional UI rendering based on auth status
   - API client with automatic token injection

3. **Database**
   - User table for storing credentials
   - JWT secret for token signing/verification

## Backend Setup

### 1. Dependencies

Add to `composer.json`:

```json
{
    "require": {
        "firebase/php-jwt": "^6.0",
        "slim/slim": "^4.0",
        "tuupola/slim-jwt-auth": "^3.0"
    }
}
```

### 2. Environment Configuration

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. JWT Middleware

Create `src/Middleware/JwtMiddleware.php`:

```php
<?php

namespace AnimePromptGen\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class JwtMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'error' => 'Authorization header missing or invalid',
                'code' => 'AUTH_HEADER_MISSING'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $token = $matches[1];

        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            // Add user info to request for use in controllers
            $request = $request->withAttribute('user', $decoded);
        } catch (\Exception $e) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode([
                'error' => 'Invalid token',
                'code' => 'INVALID_TOKEN'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }
}
```

### 4. Authentication Controller

Create `src/Controllers/AuthController.php`:

```php
<?php

namespace AnimePromptGen\Controllers;

use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use AnimePromptGen\Models\User;

class AuthController
{
    public function login(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return $this->jsonResponse($response, ['error' => 'Email and password required'], 400);
        }

        // Validate user credentials (implement your own validation logic)
        $user = User::where('email', $data['email'])->first();

        if (!$user || !password_verify($data['password'], $user->password)) {
            return $this->jsonResponse($response, ['error' => 'Invalid credentials'], 401);
        }

        // Generate JWT token
        $token = $this->generateToken($user);

        return $this->jsonResponse($response, [
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email
            ]
        ]);
    }

    public function register(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return $this->jsonResponse($response, ['error' => 'Email and password required'], 400);
        }

        // Check if user already exists
        if (User::where('email', $data['email'])->exists()) {
            return $this->jsonResponse($response, ['error' => 'User already exists'], 409);
        }

        // Create new user
        $user = User::create([
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ]);

        // Generate JWT token
        $token = $this->generateToken($user);

        return $this->jsonResponse($response, [
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email
            ]
        ]);
    }

    private function generateToken($user): string
    {
        $payload = [
            'iss' => 'anime-prompt-gen',
            'sub' => $user->id,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];

        return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }
}
```

### 5. Route Configuration

Update `config/routes.php`:

```php
<?php

// ... existing imports ...
use AnimePromptGen\Middleware\JwtMiddleware;
use AnimePromptGen\Controllers\AuthController;

return function (Router $router): void {
    $api = '/api/v1';

    // Public routes (no authentication required)
    $router->post($api . '/auth/login', [AuthController::class, 'login']);
    $router->post($api . '/auth/register', [AuthController::class, 'register']);
    $router->get($api . '/health', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'status' => 'healthy',
            'version' => 'v1',
            'timestamp' => date('c')
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Protected routes (require authentication)
    $router->group($api, function (Router $router) {
        // Management routes
        $router->get('/templates', [TemplateController::class, 'index'])->add(JwtMiddleware::class);
        $router->post('/templates', [TemplateController::class, 'store'])->add(JwtMiddleware::class);
        $router->get('/attribute-manager', [AttributeController::class, 'index'])->add(JwtMiddleware::class);

        // Generator types (may be protected or public based on your needs)
        $router->get('/generator-types', [GeneratorTypesController::class, 'index']);
    });

    // Debug routes (optional)
    $router->get($api . '/debug/auth', function ($request, $response) {
        $authHeader = $request->getHeaderLine('Authorization');
        $hasToken = !empty($authHeader);

        $tokenInfo = [];
        if ($hasToken && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            try {
                $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
                $tokenInfo = [
                    'header' => json_decode(base64_decode(explode('.', $token)[0]), true),
                    'payload' => json_decode(base64_decode(explode('.', $token)[1]), true),
                    'valid' => true
                ];
            } catch (\Exception $e) {
                $tokenInfo = ['error' => $e->getMessage(), 'valid' => false];
            }
        }

        $response->getBody()->write(json_encode([
            'auth_header_present' => $hasToken,
            'auth_header_value' => $hasToken ? substr($authHeader, 0, 50) . '...' : null,
            'token_info' => $tokenInfo,
            'server_time' => date('c'),
            'jwt_secret_configured' => !empty($_ENV['JWT_SECRET'])
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });
};
```

## Frontend Setup

### 1. Dependencies

Add to `package.json`:

```json
{
    "dependencies": {
        "react": "^18.0.0",
        "react-router-dom": "^6.0.0",
        "vite": "^5.0.0"
    }
}
```

### 2. Environment Configuration

Create `.env.production`:

```env
VITE_API_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=Your App Name
VITE_BASE_PATH=/your-app-path
```

### 3. API Client

Create `src/api/client.ts`:

```typescript
import { config } from '../config/app';

interface ApiConfig {
    baseUrl: string;
    timeout: number;
}

class ApiClient {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await this.makeRequest(endpoint, options, controller.signal);
            clearTimeout(timeoutId);

            return await this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);
            throw this.handleRequestError(error);
        }
    }

    private async makeRequest(
        endpoint: string,
        options: RequestInit,
        signal: AbortSignal
    ): Promise<Response> {
        const url = `${this.config.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {};
        if (options.body) {
            headers['Content-Type'] = 'application/json';
        }

        // Add Authorization header if token exists
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            signal,
            headers: { ...headers, ...options.headers },
        });
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            await this.handleErrorResponse(response);
        }

        const text = await response.text();
        if (!text) return {} as T;

        return JSON.parse(text);
    }

    private async handleErrorResponse(response: Response): Promise<never> {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    private handleRequestError(error: unknown): never {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : null,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : null,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Create and export the API client instance
export const apiClient = new ApiClient(config.getApi());
```

### 4. Configuration

Create `src/config/app.ts`:

```typescript
interface AppConfig {
    api: {
        baseUrl: string;
        timeout: number;
    };
    features: {
        enableTemplates: boolean;
        enableHistory: boolean;
        enableFavorites: boolean;
    };
    ui: {
        debounceMs: number;
        errorDisplayDurationMs: number;
    };
    development: {
        enableDebugLogs: boolean;
    };
}

class ConfigManager {
    private config: AppConfig;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): AppConfig {
        const env = import.meta.env;

        return {
            api: {
                baseUrl: this.getEnvValue(
                    ['VITE_API_URL', 'VITE_API_BASE_URL'],
                    'http://localhost:8080/api/v1'
                ),
                timeout: this.getNumberValue(env.VITE_API_TIMEOUT, 30000),
            },
            features: {
                enableTemplates: this.getBooleanValue(env.VITE_ENABLE_TEMPLATES, true),
                enableHistory: this.getBooleanValue(env.VITE_ENABLE_HISTORY, true),
                enableFavorites: this.getBooleanValue(env.VITE_ENABLE_FAVORITES, true),
            },
            ui: {
                debounceMs: this.getNumberValue(env.VITE_DEBOUNCE_MS, 300),
                errorDisplayDurationMs: this.getNumberValue(env.VITE_ERROR_DISPLAY_DURATION_MS, 5000),
            },
            development: {
                enableDebugLogs: this.getBooleanValue(env.VITE_DEBUG_LOGS, false),
            },
        };
    }

    private getEnvValue(keys: string[], defaultValue: string): string {
        for (const key of keys) {
            if (import.meta.env[key]) return import.meta.env[key];
        }
        return defaultValue;
    }

    private getNumberValue(value: string | undefined, defaultValue: number): number {
        if (!value) return defaultValue;
        const num = Number(value);
        return Number.isFinite(num) ? num : defaultValue;
    }

    private getBooleanValue(value: string | boolean | undefined, defaultValue: boolean): boolean {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value.toLowerCase() === 'true';
        return defaultValue;
    }

    get(): AppConfig {
        return this.config;
    }

    getApi(): AppConfig['api'] {
        return this.config.api;
    }

    getFeatures(): AppConfig['features'] {
        return this.config.features;
    }

    isDevelopment(): boolean {
        return this.config.development.enableDebugLogs;
    }
}

export const config = new ConfigManager();
```

### 5. Authentication Context

Create `src/contexts/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on app load
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
            // TODO: Validate token with backend and set user
            setUser({ id: 1, email: 'user@example.com' }); // Placeholder
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        if (data.success && data.token) {
            setToken(data.token);
            setUser({ id: data.user?.id || 1, email });
            localStorage.setItem('token', data.token);
        } else {
            throw new Error(data.error || 'Login failed');
        }
    };

    const register = async (email: string, password: string) => {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        if (data.success && data.token) {
            setToken(data.token);
            setUser({ id: data.user?.id || 1, email });
            localStorage.setItem('token', data.token);
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```

### 6. Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login with return URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
```

### 7. Login Modal Component

Create `src/components/LoginModal.tsx`:

```tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
```

## Database Schema

Create a `users` table:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Usage Examples

### 1. Using the API Client

```typescript
import { apiClient } from './api/client';

// GET request (automatically includes auth header if logged in)
const data = await apiClient.get('/protected-endpoint');

// POST request
const result = await apiClient.post('/create-item', { name: 'New Item' });
```

### 2. Protecting Routes

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/public" element={<PublicPage />} />
                <Route path="/protected" element={
                    <ProtectedRoute>
                        <ProtectedPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}
```

### 3. Conditional UI Rendering

```tsx
import { useAuth } from './contexts/AuthContext';

function Navigation() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <Link to="/public">Public Page</Link>
            {isAuthenticated ? (
                <>
                    <Link to="/protected">Protected Page</Link>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={() => setShowLogin(true)}>Login</button>
            )}
        </nav>
    );
}
```

## Debug Tools

### Debug Page

Access the debug page at `/api/v1/debug` to:

- Check API health
- Verify authentication status
- Inspect stored tokens
- Test protected endpoints
- Clear stored authentication data

### Browser Developer Tools

Use browser dev tools to:

- Check Network tab for Authorization headers
- Inspect localStorage for token storage
- Monitor API requests and responses

## Deployment Considerations

### 1. Environment Variables

Ensure these are set in production:

```env
JWT_SECRET=your-production-jwt-secret
VITE_API_URL=https://yourdomain.com/api/v1
VITE_BASE_PATH=/your-app-path
```

### 2. HTTPS

Always use HTTPS in production to protect JWT tokens in transit.

### 3. Token Expiration

Implement token refresh logic for long-running sessions:

```typescript
// Check token expiration and refresh if needed
const checkTokenExpiration = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};
```

### 4. Security Headers

Configure your web server to include security headers:

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized on API calls**
   - Check if token exists in localStorage
   - Verify API_BASE URL configuration
   - Ensure JWT secret matches between frontend/backend

2. **CORS errors**
   - Configure CORS headers in backend
   - Check if API URLs include correct domain/port

3. **Token not persisting**
   - Check localStorage key (should be 'token' or 'auth_token')
   - Verify localStorage is not being cleared

4. **Routes not protected**
   - Ensure JwtMiddleware is applied to protected routes
   - Check route definitions in routes.php

### Debug Checklist

1. ✅ JWT secret configured in backend
2. ✅ API_BASE URL correct in frontend
3. ✅ localStorage contains valid token
4. ✅ Authorization header sent with requests
5. ✅ Backend validates JWT tokens
6. ✅ Protected routes use JwtMiddleware
7. ✅ Frontend handles auth state correctly

This authentication system provides a solid foundation for securing web applications with JWT tokens, automatic token management, and comprehensive debugging tools.