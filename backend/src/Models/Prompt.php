<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Prompt extends Model
{
    protected $table = 'prompts';
    
    protected $fillable = [
        'title',
        'description',
        'negative_prompt',
        'tags',
        'species_id',
        'prompt_type',
        'generated_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'generated_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('prompt_type', $type);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', (new \DateTime())->sub(new \DateInterval("P{$days}D")));
    }
}
