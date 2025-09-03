<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\AlienSpecies;

final class AlienSpeciesRepository
{
    public function findByClass(string $class): array
    {
        return AlienSpecies::where('class', $class)->get()->toArray();
    }

    public function getRandomByClass(string $class): ?AlienSpecies
    {
        return AlienSpecies::where('class', $class)->inRandomOrder()->first();
    }

    public function getAllClasses(): array
    {
        return AlienSpecies::distinct()->pluck('class')->toArray();
    }

    public function findByName(string $name): ?AlienSpecies
    {
        return AlienSpecies::where('name', $name)->first();
    }

    public function getAll(): array
    {
        return AlienSpecies::all()->toArray();
    }
}