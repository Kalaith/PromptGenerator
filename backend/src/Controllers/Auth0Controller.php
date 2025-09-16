<?php

namespace AnimePromptGen\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use AnimePromptGen\Models\User;

class Auth0Controller
{
    /**
     * Verify and create/update user from Auth0 token
     */
    public function verifyUser(Request $request, Response $response): Response
    {
        try {
            // Get user data from request body (sent by frontend)
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data || !isset($data['auth0_id'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Get authenticated user from middleware (for verification)
            $auth0User = $request->getAttribute('auth0_user');
            
            // Verify the auth0_id matches the token
            if ($auth0User->sub !== $data['auth0_id']) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Auth0 ID mismatch'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Try to find existing user by Auth0 ID
            $user = User::where('auth0_id', $data['auth0_id'])->first();
            
            if (!$user) {
                // Create new user with Anime Prompt Generator defaults
                $user = User::create([
                    'auth0_id' => $data['auth0_id'],
                    'email' => $data['email'] ?? '',
                    'username' => $data['username'] ?? explode('@', $data['email'] ?? 'user')[0],
                    'display_name' => $data['display_name'] ?? $data['name'] ?? $data['username'] ?? 'Artist',
                    'preferences' => [
                        'default_style' => 'anime',
                        'preferred_resolution' => '1024x1024',
                        'auto_save_favorites' => true,
                        'show_generation_tips' => true,
                        'theme' => 'light'
                    ],
                    'favorites' => [],
                    'generation_history' => [],
                    'is_active' => true,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            } else {
                // Update existing user with latest data
                $user->update([
                    'email' => $data['email'] ?? $user->email,
                    'username' => $data['username'] ?? $user->username,
                    'display_name' => $data['display_name'] ?? $data['name'] ?? $user->display_name,
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'auth0_id' => $user->auth0_id,
                        'email' => $user->email,
                        'username' => $user->username,
                        'display_name' => $user->display_name,
                        'preferences' => $user->preferences,
                        'generation_stats' => $user->getGenerationStats(),
                        'generation_defaults' => $user->getGenerationDefaults(),
                        'is_active' => $user->is_active,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at
                    ]
                ],
                'message' => 'User verified successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'User verification failed',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get current authenticated user info
     */
    public function getCurrentUser(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'auth0_id' => $user['auth0_id'] ?? null,
                        'email' => $user['email'],
                        'username' => $user['username'],
                        'display_name' => $user['display_name'],
                        'preferences' => $user['preferences'],
                        'generation_stats' => $user['generation_stats'] ?? [],
                        'generation_defaults' => $user['generation_defaults'] ?? [],
                        'is_active' => $user['is_active'],
                        'created_at' => $user['created_at'],
                        'updated_at' => $user['updated_at']
                    ]
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to get user info',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Validate current session (used by frontend to check auth status)
     */
    public function validateSession(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $auth0User = $request->getAttribute('auth0_user');
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'auth0_id' => $user['auth0_id'] ?? null,
                        'email' => $user['email'],
                        'username' => $user['username'],
                        'display_name' => $user['display_name'],
                        'preferences' => $user['preferences'],
                        'is_active' => $user['is_active']
                    ],
                    'auth0_data' => [
                        'sub' => $auth0User->sub ?? null,
                        'email' => $auth0User->email ?? null,
                        'name' => $auth0User->name ?? null
                    ]
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Session validation failed',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$user || !$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Find the user model
            $userModel = User::where('auth0_id', $user['auth0_id'])->first();
            
            if (!$userModel) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Update preferences
            $userModel->updatePreferences($data['preferences'] ?? []);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $userModel->id,
                        'preferences' => $userModel->preferences,
                        'generation_defaults' => $userModel->getGenerationDefaults()
                    ]
                ],
                'message' => 'Preferences updated successfully'
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get user favorites
     */
    public function getFavorites(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Find the user model
            $userModel = User::where('auth0_id', $user['auth0_id'])->first();
            
            if (!$userModel) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'favorites' => $userModel->favorites ?? [],
                    'favorite_prompts' => $userModel->getFavoritePrompts(),
                    'favorite_images' => $userModel->getFavoriteImages()
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to get favorites',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get user generation history
     */
    public function getHistory(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $queryParams = $request->getQueryParams();
            $limit = (int) ($queryParams['limit'] ?? 20);
            
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Find the user model
            $userModel = User::where('auth0_id', $user['auth0_id'])->first();
            
            if (!$userModel) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'history' => $userModel->getRecentHistory($limit),
                    'stats' => $userModel->getGenerationStats()
                ]
            ]));
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to get history',
                'error' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}