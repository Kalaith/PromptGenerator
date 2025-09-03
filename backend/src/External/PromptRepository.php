<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\Prompt;
use Illuminate\Database\Eloquent\Collection;

final class PromptRepository
{
    public function findById(int $id): ?Prompt
    {
        return Prompt::with('species')->find($id);
    }

    public function findByType(string $type): Collection
    {
        return Prompt::with('species')->byType($type)->orderBy('created_at', 'desc')->get();
    }

    public function getRecent(int $days = 30): Collection
    {
        return Prompt::with('species')->recent($days)->orderBy('created_at', 'desc')->get();
    }

    public function create(Prompt $prompt): Prompt
    {
        $prompt->save();
        return $prompt->load('species');
    }

    public function update(Prompt $prompt): Prompt
    {
        $prompt->save();
        return $prompt->load('species');
    }

    public function delete(Prompt $prompt): bool
    {
        return $prompt->delete();
    }

    public function findBySpeciesId(int $speciesId): Collection
    {
        return Prompt::with('species')
            ->where('species_id', $speciesId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByTags(array $tags): Collection
    {
        return Prompt::with('species')
            ->where(function ($query) use ($tags) {
                foreach ($tags as $tag) {
                    $query->orWhereJsonContains('tags', $tag);
                }
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
