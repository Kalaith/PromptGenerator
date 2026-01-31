<?php

declare(strict_types=1);

namespace AnimePromptGen\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class JwtMiddleware
{
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $routeParams): bool
    {
        $authorization = $request->getHeaderLine('Authorization');

        if (!$authorization || !preg_match('/Bearer\s+(.*)$/i', $authorization, $matches)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Authentication required'
            ]));
            return false;
        }

        $token = $matches[1];
        $secret = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';

        if (empty($secret)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error: JWT security not configured'
            ]));
            return false;
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            // Store user_id in request attributes
            return true; // Allow request to continue
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Invalid token: ' . $e->getMessage()
            ]));
            return false;
        }
    }
}