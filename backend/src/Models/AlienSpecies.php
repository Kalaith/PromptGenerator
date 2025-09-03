<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class AlienSpecies extends Model
{
    protected $table = 'alien_species';
    
    protected $fillable = [
        'name',
        'class',
        'form',
        'variations',
        'features',
        'visual_descriptors',
        'key_traits',
        'ai_prompt_elements'
    ];

    protected $casts = [
        'variations' => 'array',
        'features' => 'array',
        'visual_descriptors' => 'array',
        'key_traits' => 'array'
    ];
}