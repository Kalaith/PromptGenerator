<?php

declare(strict_types=1);

namespace AnimePromptGen\Middleware;

use AnimePromptGen\External\UserRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class JwtMiddleware
{
    public function __construct(
        private readonly ?UserRepository $userRepository = null
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $routeParams
    ): ServerRequestInterface|ResponseInterface
    {
        $authorization = $request->getHeaderLine('Authorization');

        if (!$authorization || !preg_match('/Bearer\s+(.*)$/i', $authorization, $matches)) {
            return $this->unauthorized($response, 'Authentication required');
        }

        $token = $matches[1];
        $secret = $this->requiredEnv('JWT_SECRET');

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        } catch (\Throwable $e) {
            return $this->unauthorized($response, 'Invalid token');
        }

        $claims = json_decode(json_encode($decoded), true);
        if (!is_array($claims)) {
            return $this->unauthorized($response, 'Invalid token claims');
        }

        $isGuest = (bool)($claims['is_guest'] ?? false)
            || (($claims['auth_type'] ?? 'frontpage') === 'guest')
            || (($claims['role'] ?? '') === 'guest');
        $role = $isGuest ? 'guest' : (string)($claims['role'] ?? 'user');
        $userId = (string)($claims['user_id'] ?? $claims['sub'] ?? '');
        $userPayload = [
            'id' => $userId,
            'email' => (string)($claims['email'] ?? ''),
            'username' => (string)($claims['username'] ?? ''),
            'display_name' => (string)($claims['display_name'] ?? ($claims['username'] ?? 'User')),
            'role' => $role,
            'roles' => $claims['roles'] ?? [$role],
            'is_guest' => $isGuest,
            'auth_type' => $isGuest ? 'guest' : (string)($claims['auth_type'] ?? 'frontpage'),
        ];

        if (!$isGuest) {
            $repository = $this->userRepository ?? new UserRepository();
            $localUser = $repository->findOrCreateFromAuthClaims($claims);
            if ($localUser === null) {
                return $this->unauthorized($response, 'User not found');
            }

            $userId = (string)$localUser['id'];
            $userPayload = [
                'id' => $userId,
                'email' => (string)($localUser['email'] ?? $userPayload['email']),
                'username' => (string)($localUser['username'] ?? $userPayload['username']),
                'display_name' => (string)($localUser['display_name'] ?? $userPayload['display_name']),
                'role' => $role,
                'roles' => $claims['roles'] ?? [$role],
                'is_guest' => false,
                'auth_type' => 'frontpage',
            ];
        }

        return $request
            ->withAttribute('user_id', $userId)
            ->withAttribute('user', $userPayload);
    }

    private function unauthorized(ResponseInterface $response, string $message): ResponseInterface
    {
        $payload = [
            'success' => false,
            'error' => $message,
            'message' => $message,
            'login_url' => $this->requiredEnv('WEBHATCHERY_LOGIN_URL'),
        ];

        $response->getBody()->write(json_encode($payload));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(401);
    }

    private function requiredEnv(string $name): string
    {
        $value = $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name);
        if (!is_string($value) || trim($value) === '') {
            throw new \RuntimeException("Missing required environment variable: {$name}");
        }

        return $value;
    }
}
