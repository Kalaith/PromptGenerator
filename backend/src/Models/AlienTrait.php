<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class AlienTrait extends Model
{
    protected $table = 'alien_traits';
    
    protected $fillable = [
        'name',
        'type',
        'effect',
        'visual_descriptors'
    ];

    protected $casts = [
        'visual_descriptors' => 'array'
    ];
}