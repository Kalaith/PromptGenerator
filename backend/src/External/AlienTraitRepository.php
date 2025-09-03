<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\AlienTrait;

final class AlienTraitRepository
{
    public function findByType(string $type): array
    {
        return AlienTrait::where('type', $type)->get()->toArray();
    }

    public function getRandomByType(string $type): ?AlienTrait
    {
        return AlienTrait::where('type', $type)->inRandomOrder()->first();
    }

    public function findByName(string $name): ?AlienTrait
    {
        return AlienTrait::where('name', $name)->first();
    }

    public function getAll(): array
    {
        return AlienTrait::all()->toArray();
    }
}