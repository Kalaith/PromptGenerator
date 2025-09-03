<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Adventurer extends Model
{
    protected $table = 'adventurers';
    
    protected $fillable = [
        'race',
        'class_id',
        'experience_level',
        'race_traits',
        'generated_equipment',
        'is_active'
    ];

    protected $casts = [
        'race_traits' => 'array',
        'generated_equipment' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function adventurerClass(): BelongsTo
    {
        return $this->belongsTo(AdventurerClass::class, 'class_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRace($query, string $race)
    {
        return $query->where('race', $race);
    }

    public function scopeByExperience($query, string $level)
    {
        return $query->where('experience_level', $level);
    }
}
