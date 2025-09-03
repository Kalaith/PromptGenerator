<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\Attribute;
use Illuminate\Database\Eloquent\Collection;

final class AttributeRepository
{
    public function findById(int $id): ?Attribute
    {
        return Attribute::find($id);
    }

    public function findByCategory(string $category): Collection
    {
        return Attribute::active()->byCategory($category)->ordered()->get();
    }

    public function getRandomByCategory(string $category, int $count = 1): Collection
    {
        return Attribute::active()
            ->byCategory($category)
            ->inRandomOrder()
            ->limit($count)
            ->get();
    }

    public function getAllActive(): Collection
    {
        return Attribute::active()->ordered()->get();
    }

    public function create(Attribute $attribute): Attribute
    {
        $attribute->save();
        return $attribute;
    }

    public function update(Attribute $attribute): Attribute
    {
        $attribute->save();
        return $attribute;
    }

    public function delete(Attribute $attribute): bool
    {
        return $attribute->delete();
    }

    public function getAllCategories(): array
    {
        return Attribute::active()
            ->distinct()
            ->pluck('category')
            ->toArray();
    }

    public function getAttributeValues(string $category): array
    {
        return Attribute::active()
            ->byCategory($category)
            ->ordered()
            ->pluck('value')
            ->toArray();
    }
}
