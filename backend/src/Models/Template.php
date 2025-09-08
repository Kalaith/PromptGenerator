<?php

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $table = 'templates';

    protected $fillable = [
        'name',
        'description', 
        'type',
        'template_data',
        'is_public',
        'is_active',
        'created_by',
        'usage_count'
    ];

    protected $casts = [
        'template_data' => 'array',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $attributes = [
        'is_public' => false,
        'is_active' => true,
        'usage_count' => 0
    ];

    /**
     * Scope to get only active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only public templates
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope to filter by type (anime/alien)
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get templates by creator
     */
    public function scopeByCreator($query, $creator)
    {
        return $query->where('created_by', $creator);
    }

    /**
     * Increment usage counter
     */
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }

    /**
     * Get popular templates (by usage)
     */
    public static function popular($limit = 10)
    {
        return static::active()
            ->orderBy('usage_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get recent templates
     */
    public static function recent($limit = 10)
    {
        return static::active()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Validate template data structure based on type
     */
    public function validateTemplateData(): array
    {
        $data = $this->template_data;
        $errors = [];

        if (!is_array($data)) {
            $errors[] = 'Template data must be an array';
            return $errors;
        }

        // Get valid fields based on generator type from generator_types table
        $generatorType = \AnimePromptGen\Models\GeneratorType::where('name', $this->type)->first();
        
        if ($generatorType) {
            // Use a more flexible validation system based on the generator type
            $requiredFields = [];
            $optionalFields = $this->getValidFieldsForGeneratorType($this->type);
        } else {
            // Fallback for unknown types
            $requiredFields = [];
            $optionalFields = ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender'];
        }

        // Check that template only contains valid fields
        $validFields = array_merge($requiredFields ?? [], $optionalFields ?? []);
        foreach (array_keys($data) as $field) {
            if (!in_array($field, $validFields)) {
                $errors[] = "Unknown field: {$field}";
            }
        }

        return $errors;
    }

    /**
     * Get valid fields for a specific generator type
     */
    private function getValidFieldsForGeneratorType(string $generatorType): array
    {
        // Define valid fields for each generator type
        $validFieldsMap = [
            'anime' => ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender', 'outfit'],
            'alien' => ['species_class', 'traits', 'climate', 'environment', 'style_modifiers', 'negative_prompts', 'gender'],
            'kemonomimi' => ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender', 'outfit'],
            'monster-girl' => ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender', 'outfit'],
            'monster' => ['type', 'traits', 'environment', 'style_modifiers', 'negative_prompts'],
            'adventurer' => ['race', 'class', 'experience', 'environment', 'style_modifiers', 'negative_prompts', 'gender'],
        ];

        return $validFieldsMap[$generatorType] ?? ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender'];
    }

    /**
     * Apply template to generation parameters
     */
    public function applyToParameters(array $parameters): array
    {
        $templateData = $this->template_data;
        
        // Merge template data with parameters, giving precedence to user parameters
        foreach ($templateData as $key => $value) {
            if (!isset($parameters[$key]) || $parameters[$key] === 'random' || empty($parameters[$key])) {
                $parameters[$key] = $value;
            }
        }

        return $parameters;
    }
}