<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class GeneratorType extends Model
{
    protected $table = 'generator_types';
    
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'endpoint',
        'route_key',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc');
    }

    /**
     * Get all active generator types for API/UI
     */
    public static function getActiveTypes(): array
    {
        return self::active()
            ->ordered()
            ->get()
            ->map(function ($type) {
                return [
                    'name' => $type->name,
                    'display_name' => $type->display_name,
                    'description' => $type->description,
                    'endpoint' => $type->endpoint,
                    'route_key' => $type->route_key
                ];
            })
            ->toArray();
    }

    /**
     * Get generator type names only
     */
    public static function getActiveTypeNames(): array
    {
        return self::active()
            ->ordered()
            ->pluck('name')
            ->toArray();
    }
}