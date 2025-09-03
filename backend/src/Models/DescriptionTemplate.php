<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;

final class DescriptionTemplate extends Model
{
    protected $table = 'description_templates';
    
    protected $fillable = [
        'name',
        'generator_type',
        'template',
        'description',
        'is_active',
        'is_default'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public const GENERATOR_TYPES = [
        'adventurer',
        'alien', 
        'anime',
        'base'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByGeneratorType($query, string $generatorType)
    {
        return $query->where('generator_type', $generatorType);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Get available placeholder variables for this generator type
     */
    public function getAvailablePlaceholders(): array
    {
        return match ($this->generator_type) {
            'adventurer' => [
                'experience', 'race', 'class', 'skinColor', 'hairColor', 'hairStyle', 
                'eyeColor', 'eyeExpression', 'raceFeatures', 'pronoun_subject', 
                'pronoun_object', 'pronoun_possessive', 'equipment', 'facialFeatures', 
                'pose', 'background', 'artisticStyle'
            ],
            'alien' => [
                'gender', 'class', 'climate', 'artisticStyle', 'physicalFeatures',
                'hairStyle', 'hairColor', 'eyeColor', 'eyeExpression', 'pronoun_subject',
                'pronoun_object', 'pronoun_possessive', 'clothing', 'pose', 'environment'
            ],
            'anime' => [
                'personality', 'species', 'hairColor', 'hairStyle', 'eyeColor',
                'features', 'ears', 'tail', 'wings', 'pronoun_subject', 'pronoun_object',
                'pronoun_possessive', 'clothing', 'facialFeatures', 'pose', 'background'
            ],
            'base' => [
                'hairColor', 'hairStyle', 'eyeColor', 'skinColor', 'pronoun_subject',
                'pronoun_object', 'pronoun_possessive', 'facialFeatures', 'pose',
                'background', 'artisticStyle'
            ],
            default => []
        };
    }

    /**
     * Preview template with sample data
     */
    public function preview(): string
    {
        $sampleData = match ($this->generator_type) {
            'adventurer' => [
                'experience' => 'mid',
                'race' => 'elf',
                'class' => 'ranger',
                'skinColor' => 'fair',
                'hairColor' => 'silver',
                'hairStyle' => 'long',
                'eyeColor' => 'emerald',
                'eyeExpression' => 'piercing gaze',
                'raceFeatures' => 'They have distinctive pointed ears and graceful posture.',
                'pronoun_subject' => 'they',
                'pronoun_object' => 'them',
                'pronoun_possessive' => 'their',
                'equipment' => 'leather armor, longbow, silver dagger',
                'facialFeatures' => 'sharp cheekbones, calm expression',
                'pose' => 'stands confidently',
                'background' => 'mystical forest background',
                'artisticStyle' => 'fantasy'
            ],
            'alien' => [
                'gender' => 'female',
                'class' => 'Humanoid',
                'climate' => 'Ocean',
                'artisticStyle' => 'cyberpunk',
                'physicalFeatures' => 'bioluminescent markings, elongated limbs',
                'hairStyle' => 'flowing',
                'hairColor' => 'blue',
                'eyeColor' => 'silver',
                'eyeExpression' => 'mysterious gaze',
                'pronoun_subject' => 'she',
                'clothing' => 'bio-mechanical suit',
                'pose' => 'stands majestically',
                'environment' => 'underwater city'
            ],
            'anime' => [
                'personality' => 'cheerful and energetic',
                'species' => 'cat-girl',
                'hairColor' => 'pink',
                'hairStyle' => 'twin-tails',
                'eyeColor' => 'blue',
                'features' => 'cat ears, playful smile',
                'ears' => 'pointed cat ears',
                'tail' => 'fluffy cat tail',
                'wings' => '',
                'pronoun_subject' => 'she',
                'clothing' => 'school uniform',
                'facialFeatures' => 'bright smile, rosy cheeks',
                'pose' => 'poses playfully',
                'background' => 'cherry blossom background'
            ],
            'base' => [
                'hairColor' => 'brown',
                'hairStyle' => 'shoulder-length',
                'eyeColor' => 'hazel',
                'skinColor' => 'olive',
                'pronoun_subject' => 'they',
                'facialFeatures' => 'gentle smile',
                'pose' => 'stands naturally',
                'background' => 'soft gradient background',
                'artisticStyle' => 'anime'
            ],
            default => []
        };

        return $this->processTemplate($this->template, $sampleData);
    }

    /**
     * Process template with provided data
     */
    private function processTemplate(string $template, array $data): string
    {
        $templateVars = [];
        $templateValues = [];
        
        foreach ($data as $key => $value) {
            $templateVars[] = '{' . $key . '}';
            $templateValues[] = is_array($value) ? implode(', ', $value) : (string)$value;
        }
        
        return str_replace($templateVars, $templateValues, $template);
    }
}