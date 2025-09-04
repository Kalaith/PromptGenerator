<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\GameAttribute;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository for managing game attributes (formerly game assets and attributes)
 * Following backend standards with Eloquent ORM only
 */
final class GameAttributeRepository
{
    /**
     * Get all attributes by type
     */
    public function getByType(string $type): Collection
    {
        return GameAttribute::active()
            ->byType($type)
            ->ordered()
            ->get();
    }

    /**
     * Get attributes by type and category
     */
    public function getByTypeAndCategory(string $type, string $category): Collection
    {
        return GameAttribute::active()
            ->byTypeAndCategory($type, $category)
            ->ordered()
            ->get();
    }

    /**
     * Get all categories for a given type
     */
    public function getCategoriesByType(string $type): array
    {
        return GameAttribute::getCategoriesByType($type);
    }

    /**
     * Get a random attribute by type using weighted selection
     */
    public function getRandomByType(string $type): ?GameAttribute
    {
        return GameAttribute::getRandomByType($type);
    }

    /**
     * Get a random attribute by type and category using weighted selection
     */
    public function getRandomByTypeAndCategory(string $type, string $category): ?GameAttribute
    {
        return GameAttribute::getRandomByTypeAndCategory($type, $category);
    }

    /**
     * Get all attributes of multiple types
     */
    public function getAttributesByTypes(array $types): array
    {
        $attributes = GameAttribute::active()
            ->whereIn('type', $types)
            ->ordered()
            ->get();

        $attributesByType = [];
        foreach ($attributes as $attribute) {
            $attributesByType[$attribute->type][] = $attribute;
        }

        return $attributesByType;
    }

    /**
     * Create a new game attribute
     */
    public function create(
        string $category,
        string $name,
        string $value,
        string $type,
        ?string $description = null,
        ?string $parentCategory = null,
        bool $isActive = true,
        int $weight = 1
    ): GameAttribute {
        return GameAttribute::create([
            'category' => $category,
            'name' => $name,
            'value' => $value,
            'type' => $type,
            'description' => $description,
            'parent_category' => $parentCategory,
            'is_active' => $isActive,
            'weight' => $weight
        ]);
    }

    /**
     * Find attribute by ID
     */
    public function findById(int $id): ?GameAttribute
    {
        return GameAttribute::find($id);
    }

    /**
     * Find attribute by name and type
     */
    public function findByNameAndType(string $name, string $type): ?GameAttribute
    {
        return GameAttribute::where('name', $name)
            ->where('type', $type)
            ->first();
    }

    /**
     * Update an attribute
     */
    public function update(GameAttribute $attribute): GameAttribute
    {
        $attribute->save();
        return $attribute;
    }

    /**
     * Delete an attribute
     */
    public function delete(GameAttribute $attribute): bool
    {
        return $attribute->delete();
    }

    /**
     * Get all active attributes
     */
    public function getAllActive(): Collection
    {
        return GameAttribute::active()->ordered()->get();
    }

    /**
     * Get all available types
     */
    public function getAllTypes(): array
    {
        return GameAttribute::getAllTypes();
    }

    /**
     * Get attributes by name pattern
     */
    public function searchByName(string $pattern): Collection
    {
        return GameAttribute::active()
            ->where('name', 'LIKE', "%{$pattern}%")
            ->ordered()
            ->get();
    }

    /**
     * Get attributes for multiple categories within a type
     */
    public function getByTypeAndCategories(string $type, array $categories): Collection
    {
        return GameAttribute::active()
            ->where('type', $type)
            ->whereIn('category', $categories)
            ->ordered()
            ->get();
    }

    /**
     * Bulk create attributes
     */
    public function bulkCreate(array $attributesData): Collection
    {
        $created = collect();

        foreach ($attributesData as $data) {
            $attribute = GameAttribute::create($data);
            $created->push($attribute);
        }

        return $created;
    }

    /**
     * Check if attribute exists
     */
    public function exists(string $name, string $type, string $category): bool
    {
        return GameAttribute::where('name', $name)
            ->where('type', $type)
            ->where('category', $category)
            ->exists();
    }
}