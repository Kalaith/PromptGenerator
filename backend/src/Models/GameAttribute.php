<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

final class GameAttribute extends Model
{
    protected $table = 'game_attributes';
    
    protected $fillable = [
        'category',
        'name', 
        'value',
        'type',
        'description',
        'parent_category',
        'weight',
        'is_active'
    ];

    protected $casts = [
        'weight' => 'integer',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByTypeAndCategory($query, string $type, string $category)
    {
        return $query->where('type', $type)->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('weight', 'desc')->orderBy('name');
    }

    public function scopeWeightedRandom($query)
    {
        return $query->inRandomOrder();
    }

    /**
     * Get all distinct categories for a given type
     */
    public static function getCategoriesByType(string $type): array
    {
        return self::active()
            ->where('type', $type)
            ->distinct()
            ->pluck('category')
            ->toArray();
    }

    /**
     * Get all distinct types
     */
    public static function getAllTypes(): array
    {
        return self::active()
            ->distinct()
            ->pluck('type')
            ->toArray();
    }

    /**
     * Get a random attribute by type using weighted selection
     */
    public static function getRandomByType(string $type): ?self
    {
        $attributes = self::active()->byType($type)->get();
        if ($attributes->isEmpty()) {
            return null;
        }

        return self::getWeightedRandomFromCollection($attributes);
    }

    /**
     * Get a random attribute by type and category using weighted selection
     */
    public static function getRandomByTypeAndCategory(string $type, string $category): ?self
    {
        $attributes = self::active()->byTypeAndCategory($type, $category)->get();
        if ($attributes->isEmpty()) {
            return null;
        }

        return self::getWeightedRandomFromCollection($attributes);
    }

    /**
     * Weighted random selection from collection
     */
    private static function getWeightedRandomFromCollection(Collection $collection): self
    {
        $totalWeight = $collection->sum('weight');
        $randomWeight = mt_rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($collection as $attribute) {
            $currentWeight += $attribute->weight;
            if ($randomWeight <= $currentWeight) {
                return $attribute;
            }
        }
        
        // Fallback to first attribute
        return $collection->first();
    }
}