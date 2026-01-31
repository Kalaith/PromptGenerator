<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\User;

final class UserRepository
{
    public function findByEmail(string $email): ?array
    {
        $user = User::where('email', $email)->first();
        return $user ? $user->toArray() : null;
    }

    public function create(array $data): array
    {
        $user = User::create($data);
        return $user->toArray();
    }
}
