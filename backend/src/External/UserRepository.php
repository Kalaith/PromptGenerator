<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\User;

final class UserRepository
{
    public function findById(string $id): ?array
    {
        if (!$this->usersTableExists()) {
            return null;
        }

        $user = User::find($id);
        return $user ? $user->toArray() : null;
    }

    public function findByEmail(string $email): ?array
    {
        if (!$this->usersTableExists()) {
            return null;
        }

        $user = User::where('email', $email)->first();
        return $user ? $user->toArray() : null;
    }

    public function findByUsername(string $username): ?array
    {
        if (!$this->usersTableExists()) {
            return null;
        }

        $user = User::where('username', $username)->first();
        return $user ? $user->toArray() : null;
    }

    public function findOrCreateFromAuthClaims(array $claims): ?array
    {
        $externalId = trim((string)($claims['user_id'] ?? $claims['sub'] ?? ''));
        $email = trim((string)($claims['email'] ?? ''));
        $username = trim((string)($claims['username'] ?? ''));
        $displayName = trim((string)($claims['display_name'] ?? ''));

        if ($username === '' && $email !== '') {
            $username = strtok($email, '@') ?: $email;
        }

        if ($displayName === '') {
            $displayName = $username !== '' ? $username : $email;
        }

        if (!$this->usersTableExists()) {
            if ($externalId === '') {
                return null;
            }

            return [
                'id' => $externalId,
                'email' => $email,
                'username' => $username,
                'display_name' => $displayName !== '' ? $displayName : 'WebHatchery User',
                'is_active' => true,
            ];
        }

        $user = null;
        if ($externalId !== '') {
            $user = User::find($externalId);
        }

        if ($user === null && $email !== '') {
            $user = User::where('email', $email)->first();
        }

        if ($user === null && $username !== '') {
            $user = User::where('username', $username)->first();
        }

        $now = date('Y-m-d H:i:s');
        if ($user === null) {
            if ($externalId === '' && $email === '') {
                return null;
            }

            $user = User::create([
                'id' => $externalId !== '' ? $externalId : null,
                'email' => $email,
                'password_hash' => password_hash(bin2hex(random_bytes(24)), PASSWORD_DEFAULT),
                'username' => $this->buildUniqueUsername($username !== '' ? $username : $email),
                'display_name' => $displayName !== '' ? $displayName : 'WebHatchery User',
                'preferences' => [
                    'default_style' => 'anime',
                    'preferred_resolution' => '1024x1024',
                    'auto_save_favorites' => true,
                    'show_generation_tips' => true,
                ],
                'favorites' => [],
                'generation_history' => [],
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            return $user->toArray();
        }

        $updates = [];
        if ($email !== '' && (string)$user->email !== $email) {
            $updates['email'] = $email;
        }
        if ($username !== '' && (string)$user->username !== $username) {
            $existing = User::where('username', $username)->first();
            if ($existing === null || (string)$existing->id === (string)$user->id) {
                $updates['username'] = $username;
            }
        }
        if ($displayName !== '' && (string)$user->display_name !== $displayName) {
            $updates['display_name'] = $displayName;
        }

        if ($updates !== []) {
            $updates['updated_at'] = $now;
            $user->update($updates);
            $user = $user->fresh();
        }

        return $user ? $user->toArray() : null;
    }

    public function create(array $data): array
    {
        if (!$this->usersTableExists()) {
            return [
                ...$data,
                'id' => (string)($data['id'] ?? $this->generateId()),
            ];
        }

        $user = User::create($data);
        return $user->toArray();
    }

    public function update(string $id, array $data): ?array
    {
        if (!$this->usersTableExists()) {
            return [
                ...$data,
                'id' => $id,
            ];
        }

        $user = User::find($id);
        if (!$user) {
            return null;
        }

        $user->update($data);
        return $user->fresh()->toArray();
    }

    public function usersTableExists(): bool
    {
        try {
            return User::getConnection()->getSchemaBuilder()->hasTable('users');
        } catch (\Throwable) {
            return false;
        }
    }

    private function buildUniqueUsername(string $base): string
    {
        $normalized = strtolower(trim($base));
        $normalized = preg_replace('/[^a-z0-9_]+/', '_', $normalized) ?? 'user';
        $normalized = trim($normalized, '_');
        $normalized = $normalized !== '' ? $normalized : 'user';
        $candidate = substr($normalized, 0, 80);
        $suffix = 1;

        while (User::where('username', $candidate)->exists()) {
            $suffixText = '_' . $suffix;
            $candidate = substr($normalized, 0, max(1, 80 - strlen($suffixText))) . $suffixText;
            $suffix++;
        }

        return $candidate;
    }

    private function generateId(): string
    {
        return 'usr_' . bin2hex(random_bytes(16));
    }
}
