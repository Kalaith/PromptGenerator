<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\UserSession;

final class UserSessionRepository
{
    public function findBySessionId(string $sessionId): ?UserSession
    {
        return UserSession::where('session_id', $sessionId)->first();
    }

    public function createOrUpdate(string $sessionId, array $data): UserSession
    {
        $session = $this->findBySessionId($sessionId);
        
        if ($session) {
            $session->update($data);
            return $session;
        }

        return UserSession::create(array_merge(['session_id' => $sessionId], $data));
    }

    public function addToFavorites(string $sessionId, string $promptId): UserSession
    {
        $session = $this->findBySessionId($sessionId) ?? UserSession::create([
            'session_id' => $sessionId,
            'favorites' => [],
            'history' => [],
            'preferences' => []
        ]);

        $favorites = $session->favorites ?? [];
        if (!in_array($promptId, $favorites)) {
            $favorites[] = $promptId;
            $session->favorites = $favorites;
            $session->save();
        }

        return $session;
    }

    public function removeFromFavorites(string $sessionId, string $promptId): UserSession
    {
        $session = $this->findBySessionId($sessionId);
        
        if (!$session) {
            return UserSession::create([
                'session_id' => $sessionId,
                'favorites' => [],
                'history' => [],
                'preferences' => []
            ]);
        }

        $favorites = $session->favorites ?? [];
        $favorites = array_values(array_filter($favorites, fn($id) => $id !== $promptId));
        $session->favorites = $favorites;
        $session->save();

        return $session;
    }

    public function addToHistory(string $sessionId, array $prompt): UserSession
    {
        $session = $this->findBySessionId($sessionId) ?? UserSession::create([
            'session_id' => $sessionId,
            'favorites' => [],
            'history' => [],
            'preferences' => []
        ]);

        $history = $session->history ?? [];
        
        // Add timestamp to prompt
        $prompt['timestamp'] = date('c');
        
        // Add to beginning of history
        array_unshift($history, $prompt);
        
        // Keep only last 50 items
        $history = array_slice($history, 0, 50);
        
        $session->history = $history;
        $session->save();

        return $session;
    }

    public function clearHistory(string $sessionId): UserSession
    {
        $session = $this->findBySessionId($sessionId);
        
        if (!$session) {
            return UserSession::create([
                'session_id' => $sessionId,
                'favorites' => [],
                'history' => [],
                'preferences' => []
            ]);
        }

        $session->history = [];
        $session->save();

        return $session;
    }

    public function updatePreferences(string $sessionId, array $preferences): UserSession
    {
        $session = $this->findBySessionId($sessionId) ?? UserSession::create([
            'session_id' => $sessionId,
            'favorites' => [],
            'history' => [],
            'preferences' => []
        ]);

        $currentPrefs = $session->preferences ?? [];
        $session->preferences = array_merge($currentPrefs, $preferences);
        $session->save();

        return $session;
    }
}