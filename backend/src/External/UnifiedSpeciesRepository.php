<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\UnifiedSpecies;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository for managing all species data (anime, alien, fantasy, sci-fi)
 * Following backend standards with Eloquent ORM only
 */
final class UnifiedSpeciesRepository
{
    /**
     * Find species by ID
     */
    public function findById(int $id): ?UnifiedSpecies
    {
        return UnifiedSpecies::find($id);
    }

    /**
     * Find species by name and type
     */
    public function findByNameAndType(string $name, string $type): ?UnifiedSpecies
    {
        return UnifiedSpecies::where('name', $name)
            ->where('type', $type)
            ->first();
    }

    /**
     * Get species by type
     */
    public function findByType(string $type): Collection
    {
        return UnifiedSpecies::active()->byType($type)->get();
    }

    /**
     * Get species by type and category
     */
    public function findByTypeAndCategory(string $type, string $category): Collection
    {
        return UnifiedSpecies::active()
            ->byTypeAndCategory($type, $category)
            ->get();
    }

    /**
     * Get random species by type using weighted selection
     */
    public function getRandomByType(string $type): ?UnifiedSpecies
    {
        return UnifiedSpecies::getRandomByType($type);
    }

    /**
     * Get random species by type and category using weighted selection
     */
    public function getRandomByTypeAndCategory(string $type, string $category): ?UnifiedSpecies
    {
        return UnifiedSpecies::getRandomByTypeAndCategory($type, $category);
    }

    /**
     * Get all active species
     */
    public function getAllActive(): Collection
    {
        return UnifiedSpecies::active()->get();
    }

    /**
     * Create a new species
     */
    public function create(array $data): UnifiedSpecies
    {
        return UnifiedSpecies::create($data);
    }

    /**
     * Update a species
     */
    public function update(UnifiedSpecies $species): UnifiedSpecies
    {
        $species->save();
        return $species;
    }

    /**
     * Delete a species
     */
    public function delete(UnifiedSpecies $species): bool
    {
        return $species->delete();
    }

    /**
     * Get all available types
     */
    public function getAllTypes(): array
    {
        return UnifiedSpecies::getAllTypes();
    }

    /**
     * Get all categories for a type
     */
    public function getCategoriesByType(string $type): array
    {
        return UnifiedSpecies::getCategoriesByType($type);
    }

    /**
     * Get anime species (backward compatibility)
     */
    public function getAnimeSpecies(): Collection
    {
        return UnifiedSpecies::active()->anime()->get();
    }

    /**
     * Get alien species (backward compatibility)
     */
    public function getAlienSpecies(): Collection
    {
        return UnifiedSpecies::active()->alien()->get();
    }

    /**
     * Search species by name
     */
    public function searchByName(string $pattern): Collection
    {
        return UnifiedSpecies::active()
            ->where('name', 'LIKE', "%{$pattern}%")
            ->get();
    }

    /**
     * Get species with specific features
     */
    public function getWithFeatures(array $features): Collection
    {
        $query = UnifiedSpecies::active();

        foreach ($features as $feature) {
            $query->whereJsonContains('features', $feature);
        }

        return $query->get();
    }

    /**
     * Get species by multiple types
     */
    public function getByTypes(array $types): Collection
    {
        return UnifiedSpecies::active()
            ->whereIn('type', $types)
            ->get();
    }

    /**
     * Bulk create species
     */
    public function bulkCreate(array $speciesData): Collection
    {
        $created = collect();

        foreach ($speciesData as $data) {
            $species = UnifiedSpecies::create($data);
            $created->push($species);
        }

        return $created;
    }

    /**
     * Check if species exists
     */
    public function exists(string $name, string $type): bool
    {
        return UnifiedSpecies::where('name', $name)
            ->where('type', $type)
            ->exists();
    }

    /**
     * Get species count by type
     */
    public function getCountByType(string $type): int
    {
        return UnifiedSpecies::active()->byType($type)->count();
    }

    /**
     * Get weighted random species from multiple types
     */
    public function getRandomFromTypes(array $types): ?UnifiedSpecies
    {
        $species = UnifiedSpecies::active()
            ->whereIn('type', $types)
            ->get();

        if ($species->isEmpty()) {
            return null;
        }

        // Use the same weighted logic as in the model
        $totalWeight = $species->sum('weight');
        if ($totalWeight === 0) {
            return $species->random();
        }

        $randomWeight = mt_rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($species as $speciesItem) {
            $currentWeight += $speciesItem->weight;
            if ($randomWeight <= $currentWeight) {
                return $speciesItem;
            }
        }
        
        return $species->random();
    }
}