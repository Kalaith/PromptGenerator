<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class AdventurerClass extends Model
{
    protected $table = 'adventurer_classes';
    
    protected $fillable = [
        'name',
        'description',
        'equipment_config',
        'is_active'
    ];

    protected $casts = [
        'equipment_config' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function adventurers(): HasMany
    {
        return $this->hasMany(Adventurer::class, 'class_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
