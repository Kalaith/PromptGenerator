<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class UnifiedSpecies extends Model
{
    protected $table = 'unified_species';
    
    protected $fillable = [
        'name',
        'type',
        'category',
        'description',
        'ears',
        'tail',
        'wings', 
        'features',
        'personality',
        'key_traits',
        'visual_descriptors',
        'physical_features',
        'ai_prompt_elements',
        'is_active',
        'weight'
    ];

    protected $casts = [
        'features' => 'array',
        'personality' => 'array',
        'key_traits' => 'array',
        'visual_descriptors' => 'array', 
        'physical_features' => 'array',
        'is_active' => 'boolean',
        'weight' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function prompts(): HasMany
    {
        return $this->hasMany(Prompt::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByTypeAndCategory($query, string $type, string $category)
    {
        return $query->where('type', $type)->where('category', $category);
    }

    public function scopeWeighted($query)
    {
        return $query->orderBy('weight', 'desc');
    }

    /**
     * Get anime species (backward compatibility)
     */
    public function scopeAnime($query)
    {
        return $query->whereIn('type', ['anime', 'fantasy']);
    }

    /**
     * Get alien species (backward compatibility)
     */
    public function scopeAlien($query)
    {
        return $query->where('type', 'alien');
    }

    /**
     * Get a random species by type using weighted selection
     */
    public static function getRandomByType(string $type): ?self
    {
        $species = self::active()->byType($type)->get();
        if ($species->isEmpty()) {
            return null;
        }

        return self::getWeightedRandomFromCollection($species);
    }

    /**
     * Get a random species by type and category using weighted selection
     */
    public static function getRandomByTypeAndCategory(string $type, string $category): ?self
    {
        $species = self::active()->byTypeAndCategory($type, $category)->get();
        if ($species->isEmpty()) {
            return null;
        }

        return self::getWeightedRandomFromCollection($species);
    }

    /**
     * Weighted random selection from collection
     */
    private static function getWeightedRandomFromCollection($collection): self
    {
        $totalWeight = $collection->sum('weight');
        if ($totalWeight === 0) {
            return $collection->random();
        }

        $randomWeight = mt_rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($collection as $species) {
            $currentWeight += $species->weight;
            if ($randomWeight <= $currentWeight) {
                return $species;
            }
        }
        
        // Fallback to random selection
        return $collection->random();
    }

    /**
     * Get all types
     */
    public static function getAllTypes(): array
    {
        return self::active()
            ->distinct()
            ->pluck('type')
            ->toArray();
    }

    /**
     * Get all categories for a type
     */
    public static function getCategoriesByType(string $type): array
    {
        return self::active()
            ->where('type', $type)
            ->distinct()
            ->pluck('category')
            ->toArray();
    }
}