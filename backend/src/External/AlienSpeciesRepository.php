<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\UnifiedSpecies;

final class AlienSpeciesRepository
{
    public function findByClass(string $class): array
    {
        return UnifiedSpecies::where('type', 'alien')
            ->where('category', $class)
            ->active()
            ->get()
            ->toArray();
    }

    public function getRandomByClass(string $class): ?UnifiedSpecies
    {
        return UnifiedSpecies::getRandomByTypeAndCategory('alien', $class);
    }

    public function getAllClasses(): array
    {
        return UnifiedSpecies::where('type', 'alien')
            ->active()
            ->distinct()
            ->pluck('category')
            ->toArray();
    }

    public function findByName(string $name): ?UnifiedSpecies
    {
        return UnifiedSpecies::where('type', 'alien')
            ->where('name', $name)
            ->active()
            ->first();
    }

    public function getAll(): array
    {
        return UnifiedSpecies::where('type', 'alien')
            ->active()
            ->get()
            ->toArray();
    }
}