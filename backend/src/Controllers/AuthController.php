<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\LoginAction;
use AnimePromptGen\Actions\RegisterAction;
use AnimePromptGen\External\UserRepository;
use AnimePromptGen\Models\Template;
use Firebase\JWT\JWT;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AuthController
{
    public function __construct(
        private readonly RegisterAction $registerAction,
        private readonly LoginAction $loginAction,
        private readonly UserRepository $userRepository
    ) {}

    public function register(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = $this->getRequestData($request);

            $user = $this->registerAction->execute(
                (string)($data['email'] ?? ''),
                (string)($data['password'] ?? '')
            );

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $user,
                'message' => 'User registered successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Registration failed'
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = $this->getRequestData($request);

            $result = $this->loginAction->execute(
                (string)($data['email'] ?? ''),
                (string)($data['password'] ?? '')
            );

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Login failed'
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function currentUser(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!is_array($user)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Authentication required',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $user,
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createGuestSession(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $secret = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';
        if ($secret === '') {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'JWT security not configured',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }

        $guestTag = bin2hex(random_bytes(8));
        $email = "guest_{$guestTag}@guest.webhatchery.local";
        $username = "guest_{$guestTag}";
        $displayName = 'Guest Creator';

        $guestUser = $this->userRepository->create([
            'email' => $email,
            'password_hash' => password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT),
            'username' => $username,
            'display_name' => $displayName,
            'preferences' => [
                'default_style' => 'anime',
                'preferred_resolution' => '1024x1024',
                'auto_save_favorites' => true,
                'show_generation_tips' => true
            ],
            'favorites' => [],
            'generation_history' => [],
            'is_active' => true,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        $payload = [
            'sub' => $guestUser['id'],
            'user_id' => $guestUser['id'],
            'email' => $email,
            'username' => $username,
            'display_name' => $displayName,
            'role' => 'guest',
            'auth_type' => 'guest',
            'is_guest' => true,
            'iat' => time(),
            'nbf' => time() - 5,
            'exp' => time() + (60 * 60 * 24 * 365),
        ];

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [
                'token' => JWT::encode($payload, $secret, 'HS256'),
                'user' => [
                    'id' => $guestUser['id'],
                    'email' => $email,
                    'display_name' => $displayName,
                    'username' => $username,
                    'is_guest' => true,
                    'auth_type' => 'guest',
                ],
            ],
        ]));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    public function linkGuestAccount(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || empty($user['id'])) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Authentication required',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        $currentUserId = (string) $user['id'];
        if ((bool) ($user['is_guest'] ?? false)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Guest destination is not allowed',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $data = $this->getRequestData($request);
        $guestUserId = trim((string) ($data['guest_user_id'] ?? ''));
        if ($guestUserId === '' || $guestUserId === $currentUserId) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid guest_user_id',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $guestUser = $this->userRepository->findById($guestUserId);
        $currentUser = $this->userRepository->findById($currentUserId);
        if (!$guestUser || !$currentUser || !str_starts_with((string) ($guestUser['username'] ?? ''), 'guest_')) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid guest_user_id',
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $guestFavorites = is_array($guestUser['favorites'] ?? null) ? $guestUser['favorites'] : [];
        $currentFavorites = is_array($currentUser['favorites'] ?? null) ? $currentUser['favorites'] : [];
        $mergedFavorites = array_values(array_merge($currentFavorites, $guestFavorites));

        $guestHistory = is_array($guestUser['generation_history'] ?? null) ? $guestUser['generation_history'] : [];
        $currentHistory = is_array($currentUser['generation_history'] ?? null) ? $currentUser['generation_history'] : [];
        $mergedHistory = array_values(array_slice(array_merge($guestHistory, $currentHistory), 0, 100));

        $guestPreferences = is_array($guestUser['preferences'] ?? null) ? $guestUser['preferences'] : [];
        $currentPreferences = is_array($currentUser['preferences'] ?? null) ? $currentUser['preferences'] : [];
        $mergedPreferences = array_merge($guestPreferences, $currentPreferences);

        $this->userRepository->update($currentUserId, [
            'favorites' => $mergedFavorites,
            'generation_history' => $mergedHistory,
            'preferences' => $mergedPreferences,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        $movedTemplates = Capsule::table('templates')
            ->where('created_by', $guestUserId)
            ->update(['created_by' => $currentUserId]);

        Capsule::table('users')->where('id', $guestUserId)->delete();

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [
                'guest_user_id' => $guestUserId,
                'linked_to_user_id' => $currentUserId,
                'moved_rows_by_table' => ['templates' => $movedTemplates],
                'total_moved_rows' => $movedTemplates,
            ],
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    private function getRequestData(ServerRequestInterface $request): array
    {
        $parsed = $request->getParsedBody();
        if (!is_array($parsed)) {
            $parsed = [];
        }

        if ($parsed === []) {
            $raw = (string)$request->getBody();
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $parsed = $decoded;
            }
        }

        return $parsed;
    }
}
