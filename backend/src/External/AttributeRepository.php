<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\GameAttribute;
use Illuminate\Database\Eloquent\Collection;

final class AttributeRepository
{
    public function findById(int $id): ?GameAttribute
    {
        return GameAttribute::find($id);
    }

    public function findByCategory(string $category): Collection
    {
        return GameAttribute::active()->byCategory($category)->ordered()->get();
    }

    public function getRandomByCategory(string $category, int $count = 1): Collection
    {
        return GameAttribute::active()
            ->byCategory($category)
            ->inRandomOrder()
            ->limit($count)
            ->get();
    }

    public function getAllActive(): Collection
    {
        return GameAttribute::active()->ordered()->get();
    }

    public function create(GameAttribute $attribute): GameAttribute
    {
        $attribute->save();
        return $attribute;
    }

    public function update(GameAttribute $attribute): GameAttribute
    {
        $attribute->save();
        return $attribute;
    }

    public function delete(GameAttribute $attribute): bool
    {
        return $attribute->delete();
    }

    public function getAllCategories(): array
    {
        return GameAttribute::active()
            ->distinct()
            ->pluck('category')
            ->toArray();
    }

    public function getAttributeValues(string $category): array
    {
        return GameAttribute::active()
            ->byCategory($category)
            ->ordered()
            ->pluck('value')
            ->toArray();
    }
}
