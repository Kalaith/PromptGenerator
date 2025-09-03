<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class Attribute extends Model
{
    protected $table = 'attributes';
    
    protected $fillable = [
        'category',
        'name',
        'value',
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('weight', 'desc')->orderBy('name');
    }
}
