<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\GeneratorType;
use Illuminate\Database\Eloquent\Collection;

final class GeneratorTypeRepository
{
    public function findById(int $id): ?GeneratorType
    {
        return GeneratorType::find($id);
    }

    public function findByName(string $name): ?GeneratorType
    {
        return GeneratorType::where('name', $name)->first();
    }

    public function getAllActive(): Collection
    {
        return GeneratorType::active()->ordered()->get();
    }

    public function getActiveTypes(): array
    {
        return GeneratorType::getActiveTypes();
    }

    public function getActiveTypeNames(): array
    {
        return GeneratorType::getActiveTypeNames();
    }

    public function create(array $data): GeneratorType
    {
        return GeneratorType::create($data);
    }

    public function update(GeneratorType $generatorType, array $data): GeneratorType
    {
        $generatorType->update($data);
        return $generatorType;
    }

    public function delete(GeneratorType $generatorType): bool
    {
        return $generatorType->delete();
    }
}