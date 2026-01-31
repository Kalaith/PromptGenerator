<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\UserRepository;
use Firebase\JWT\JWT;
use InvalidArgumentException;
use RuntimeException;

final class LoginAction
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function execute(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !isset($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
            throw new InvalidArgumentException('Invalid credentials');
        }

        $secret = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';

        if (empty($secret)) {
            throw new RuntimeException('JWT security not configured');
        }

        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60)
        ];

        return [
            'token' => JWT::encode($payload, $secret, 'HS256'),
            'user' => [
                'id' => $user['id'],
                'email' => $user['email']
            ]
        ];
    }
}
