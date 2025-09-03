<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Species extends Model
{
    protected $table = 'species';
    
    protected $fillable = [
        'name',
        'type',
        'species_name',
        'ears',
        'tail',
        'wings',
        'features',
        'personality',
        'negative_prompt',
        'description_template',
        'is_active'
    ];

    protected $casts = [
        'features' => 'array',
        'personality' => 'array',
        'is_active' => 'boolean',
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
}
