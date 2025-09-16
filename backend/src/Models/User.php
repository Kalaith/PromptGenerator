<?php

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class User extends Model
{
    protected $table = 'users';
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'auth0_id',
        'email',
        'username',
        'display_name',
        'preferences',
        'favorites',
        'generation_history',
        'is_active',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'preferences' => 'json',
        'favorites' => 'json',
        'generation_history' => 'json',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            
            // Set default values for new users
            if (!isset($model->preferences)) {
                $model->preferences = [
                    'default_style' => 'anime',
                    'preferred_resolution' => '1024x1024',
                    'auto_save_favorites' => true,
                    'show_generation_tips' => true
                ];
            }
            if (!isset($model->favorites)) {
                $model->favorites = [];
            }
            if (!isset($model->generation_history)) {
                $model->generation_history = [];
            }
            if (!isset($model->is_active)) {
                $model->is_active = true;
            }
        });
    }

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        
        if (empty($this->id)) {
            $this->id = (string) Str::uuid();
        }
    }

    /**
     * Add a prompt/image to favorites
     */
    public function addToFavorites(array $item): bool
    {
        $favorites = $this->favorites ?? [];
        $item['added_at'] = date('Y-m-d H:i:s');
        $favorites[] = $item;
        
        $this->favorites = $favorites;
        return $this->save();
    }

    /**
     * Remove from favorites by index or criteria
     */
    public function removeFromFavorites(int $index): bool
    {
        $favorites = $this->favorites ?? [];
        
        if (isset($favorites[$index])) {
            unset($favorites[$index]);
            $this->favorites = array_values($favorites); // Reindex array
            return $this->save();
        }
        
        return false;
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(array $newPreferences): bool
    {
        $currentPreferences = $this->preferences ?? [];
        $this->preferences = array_merge($currentPreferences, $newPreferences);
        return $this->save();
    }

    /**
     * Add to generation history
     */
    public function addToHistory(array $generation): bool
    {
        $history = $this->generation_history ?? [];
        $generation['generated_at'] = date('Y-m-d H:i:s');
        
        // Keep only last 100 generations to prevent excessive storage
        array_unshift($history, $generation);
        $history = array_slice($history, 0, 100);
        
        $this->generation_history = $history;
        return $this->save();
    }

    /**
     * Get favorite prompts
     */
    public function getFavoritePrompts(): array
    {
        $favorites = $this->favorites ?? [];
        return array_filter($favorites, function($item) {
            return isset($item['type']) && $item['type'] === 'prompt';
        });
    }

    /**
     * Get favorite images
     */
    public function getFavoriteImages(): array
    {
        $favorites = $this->favorites ?? [];
        return array_filter($favorites, function($item) {
            return isset($item['type']) && $item['type'] === 'image';
        });
    }

    /**
     * Get recent generation history
     */
    public function getRecentHistory(int $limit = 20): array
    {
        $history = $this->generation_history ?? [];
        return array_slice($history, 0, $limit);
    }

    /**
     * Get generation statistics
     */
    public function getGenerationStats(): array
    {
        $history = $this->generation_history ?? [];
        $favorites = $this->favorites ?? [];
        
        return [
            'total_generations' => count($history),
            'total_favorites' => count($favorites),
            'favorite_prompts' => count($this->getFavoritePrompts()),
            'favorite_images' => count($this->getFavoriteImages()),
            'most_recent_generation' => $history[0]['generated_at'] ?? null,
            'member_since' => $this->created_at ? $this->created_at->format('Y-m-d') : null
        ];
    }

    /**
     * Get user's preferred settings for generation
     */
    public function getGenerationDefaults(): array
    {
        $prefs = $this->preferences ?? [];
        
        return [
            'style' => $prefs['default_style'] ?? 'anime',
            'resolution' => $prefs['preferred_resolution'] ?? '1024x1024',
            'auto_save' => $prefs['auto_save_favorites'] ?? true,
            'show_tips' => $prefs['show_generation_tips'] ?? true
        ];
    }
}