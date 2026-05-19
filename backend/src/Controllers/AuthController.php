<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\External\UserRepository;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AuthController
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function currentUser(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!is_array($user)) {
            return $this->jsonError($response, 'Authentication required', 401);
        }

        return $this->jsonSuccess($response, $user);
    }

    public function loginInfo(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $this->jsonSuccess($response, [
            'login_url' => $this->requiredEnv('WEBHATCHERY_LOGIN_URL'),
        ]);
    }

    public function createGuestSession(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $secret = $this->requiredEnv('JWT_SECRET');
        $jwtExpiration = $this->requiredIntEnv('JWT_EXPIRATION');

        $guestTag = bin2hex(random_bytes(8));
        $guestId = 'guest_' . bin2hex(random_bytes(16));
        $email = "guest_{$guestTag}@guest.webhatchery.local";
        $username = "guest_{$guestTag}";
        $displayName = 'Guest Creator';

        $payload = [
            'sub' => $guestId,
            'user_id' => $guestId,
            'email' => $email,
            'username' => $username,
            'display_name' => $displayName,
            'role' => 'guest',
            'roles' => ['guest'],
            'auth_type' => 'guest',
            'is_guest' => true,
            'iat' => time(),
            'nbf' => time() - 5,
            'exp' => time() + $jwtExpiration,
            'jti' => bin2hex(random_bytes(12)),
        ];

        return $this->jsonSuccess($response, [
            'token' => JWT::encode($payload, $secret, 'HS256'),
            'user' => [
                'id' => $guestId,
                'email' => $email,
                'display_name' => $displayName,
                'username' => $username,
                'role' => 'guest',
                'roles' => ['guest'],
                'is_guest' => true,
                'auth_type' => 'guest',
            ],
            'expires_in' => $jwtExpiration,
        ], 201);
    }

    public function linkGuestAccount(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || empty($user['id'])) {
            return $this->jsonError($response, 'Authentication required', 401);
        }

        $currentUserId = (string) $user['id'];
        if ((bool) ($user['is_guest'] ?? false)) {
            return $this->jsonError($response, 'Guest destination is not allowed', 400);
        }

        $data = $this->getRequestData($request);
        $guestUserId = trim((string) ($data['guest_user_id'] ?? ''));
        $guestToken = trim((string) ($data['guest_token'] ?? ''));
        if ($guestUserId === '' || $guestUserId === $currentUserId) {
            return $this->jsonError($response, 'Invalid guest_user_id', 400);
        }

        if (!$this->guestTokenMatches($guestToken, $guestUserId)) {
            return $this->jsonError($response, 'Valid guest_token is required', 400);
        }

        if (!str_starts_with($guestUserId, 'guest_')) {
            return $this->jsonError($response, 'Invalid guest_user_id', 400);
        }

        $this->syncLinkedUserProfile($currentUserId, (array) ($data['frontpage_user'] ?? []));

        $guestUser = $this->userRepository->findById($guestUserId);
        $currentUser = $this->userRepository->findById($currentUserId);
        if ($guestUser && $currentUser) {
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
        }

        $movedTemplates = 0;
        if (Capsule::schema()->hasTable('templates')) {
            $movedTemplates = Capsule::table('templates')
                ->where('created_by', $guestUserId)
                ->update(['created_by' => $currentUserId]);
        }

        if ($this->userRepository->usersTableExists()) {
            Capsule::table('users')->where('id', $guestUserId)->delete();
        }

        return $this->jsonSuccess($response, [
            'guest_user_id' => $guestUserId,
            'linked_to_user_id' => $currentUserId,
            'moved_rows_by_table' => ['templates' => $movedTemplates],
            'total_moved_rows' => $movedTemplates,
        ]);
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

    private function guestTokenMatches(string $guestToken, string $guestUserId): bool
    {
        if ($guestToken === '') {
            return false;
        }

        try {
            $claims = JWT::decode($guestToken, new Key($this->requiredEnv('JWT_SECRET'), 'HS256'));
        } catch (\Throwable) {
            return false;
        }

        $tokenUserId = (string)($claims->user_id ?? $claims->sub ?? '');
        $isGuest = (bool)($claims->is_guest ?? false)
            || (($claims->auth_type ?? '') === 'guest')
            || (($claims->role ?? '') === 'guest');

        return $isGuest && $tokenUserId === $guestUserId;
    }

    private function syncLinkedUserProfile(string $userId, array $frontpageUser): void
    {
        $updates = [];
        foreach (['email', 'username', 'display_name'] as $field) {
            $value = trim((string)($frontpageUser[$field] ?? ''));
            if ($value !== '') {
                $updates[$field] = $value;
            }
        }

        if ($updates !== []) {
            $updates['updated_at'] = date('Y-m-d H:i:s');
            $this->userRepository->update($userId, $updates);
        }
    }

    private function jsonSuccess(ResponseInterface $response, array $data, int $status = 200): ResponseInterface
    {
        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $data,
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    private function jsonError(ResponseInterface $response, string $message, int $status): ResponseInterface
    {
        $payload = [
            'success' => false,
            'error' => $message,
            'message' => $message,
        ];

        if ($status === 401) {
            $payload['login_url'] = $this->requiredEnv('WEBHATCHERY_LOGIN_URL');
        }

        $response->getBody()->write(json_encode($payload));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    private function requiredEnv(string $name): string
    {
        $value = $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name);
        if (!is_string($value) || trim($value) === '') {
            throw new \RuntimeException("Missing required environment variable: {$name}");
        }

        return $value;
    }

    private function requiredIntEnv(string $name): int
    {
        $value = $this->requiredEnv($name);
        if (!ctype_digit($value) || (int)$value <= 0) {
            throw new \RuntimeException("Required environment variable must be a positive integer: {$name}");
        }

        return (int)$value;
    }
}
