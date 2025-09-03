<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\AdventurerClass;
use Illuminate\Database\Eloquent\Collection;

final class AdventurerClassRepository
{
    public function findById(int $id): ?AdventurerClass
    {
        return AdventurerClass::find($id);
    }

    public function findByName(string $name): ?AdventurerClass
    {
        return AdventurerClass::where('name', $name)->first();
    }

    public function getAllActive(): Collection
    {
        return AdventurerClass::active()->get();
    }

    public function getRandomActive(): ?AdventurerClass
    {
        return AdventurerClass::active()->inRandomOrder()->first();
    }

    public function create(AdventurerClass $class): AdventurerClass
    {
        $class->save();
        return $class;
    }

    public function update(AdventurerClass $class): AdventurerClass
    {
        $class->save();
        return $class;
    }

    public function delete(AdventurerClass $class): bool
    {
        return $class->delete();
    }
}
