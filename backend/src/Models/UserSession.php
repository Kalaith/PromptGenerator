<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class UserSession extends Model
{
    protected $table = 'user_sessions';
    
    protected $fillable = [
        'session_id',
        'favorites',
        'history',
        'preferences'
    ];

    protected $casts = [
        'favorites' => 'array',
        'history' => 'array',
        'preferences' => 'array'
    ];
}