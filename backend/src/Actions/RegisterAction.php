<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\UserRepository;
use InvalidArgumentException;

final class RegisterAction
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function execute(string $email, string $password): array
    {
        $email = trim($email);
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Valid email is required');
        }

        if (trim($password) === '') {
            throw new InvalidArgumentException('Password is required');
        }

        $existing = $this->userRepository->findByEmail($email);
        if ($existing) {
            throw new InvalidArgumentException('Email already in use');
        }

        $username = explode('@', $email)[0];
        $user = $this->userRepository->create([
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'username' => $username,
            'display_name' => $username,
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

        return [
            'id' => $user['id'],
            'email' => $user['email']
        ];
    }
}
