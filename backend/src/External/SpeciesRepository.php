<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\Species;
use Illuminate\Database\Eloquent\Collection;

final class SpeciesRepository
{
    public function findById(int $id): ?Species
    {
        return Species::find($id);
    }

    public function findByName(string $name): ?Species
    {
        return Species::where('name', $name)->first();
    }

    public function findByType(string $type): Collection
    {
        return Species::active()->byType($type)->get();
    }

    public function findActiveByType(string $type): Collection
    {
        return Species::active()->byType($type)->get();
    }

    public function getRandomByType(string $type): ?Species
    {
        return Species::active()->byType($type)->inRandomOrder()->first();
    }

    public function getAllActive(): Collection
    {
        return Species::active()->get();
    }

    public function create(Species $species): Species
    {
        $species->save();
        return $species;
    }

    public function update(Species $species): Species
    {
        $species->save();
        return $species;
    }

    public function delete(Species $species): bool
    {
        return $species->delete();
    }

    public function getAllTypes(): array
    {
        return Species::active()
            ->distinct()
            ->pluck('type')
            ->toArray();
    }
}
