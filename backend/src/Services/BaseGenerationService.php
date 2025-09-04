<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\DescriptionTemplateRepository;

/**
 * Base service with shared functionality for all generators
 */
abstract class BaseGenerationService
{
    public function __construct(
        protected readonly AttributeRepository $attributeRepository,
        protected readonly RandomGeneratorService $randomGenerator,
        protected readonly DescriptionTemplateRepository $templateRepository
    ) {}

    /**
     * Generate common attributes shared by all generator types
     */
    protected function generateBaseAttributes(?string $gender = null, ?string $hairColor = null, ?string $skinColor = null, ?string $eyeColor = null, ?string $eyeStyle = null): array
    {
        return [
            'gender' => $gender ?? $this->getRandomGender(),
            'hairColor' => $hairColor ?? $this->randomGenerator->getRandomAttribute('hair_colors'),
            'hairStyle' => $this->randomGenerator->getRandomAttribute('hair_styles'),
            'skinColor' => $skinColor ?? $this->randomGenerator->getRandomAttribute('skin_colors'),
            'eyeColor' => $eyeColor ?? $this->randomGenerator->getRandomAttribute('eye_colors'),
            'eyeExpression' => $eyeStyle ?? $this->randomGenerator->getRandomAttribute('eye_expressions'),
            'background' => $this->getRandomBackground(),
            'pose' => $this->randomGenerator->getRandomAttribute('poses'),
            'facialFeatures' => $this->randomGenerator->getRandomAttributes('facial_features', $this->randomGenerator->generateRandomInt(1, 3)),
            'accessory' => $this->randomGenerator->shouldRandomlyOccur(0.5) 
                ? $this->randomGenerator->getRandomAttribute('accessories') 
                : '',
        ];
    }

    /**
     * Generate extended attributes with creative options
     */
    protected function generateExtendedAttributes(?string $gender = null, ?string $style = null, ?string $environment = null, ?string $hairColor = null, ?string $skinColor = null, ?string $eyeColor = null, ?string $eyeStyle = null): array
    {
        $baseAttributes = $this->generateBaseAttributes($gender, $hairColor, $skinColor, $eyeColor, $eyeStyle);
        
        return array_merge($baseAttributes, [
            'artisticStyle' => $style ?? $this->getRandomArtisticStyle(),
            'environment' => $environment ?? $this->getRandomEnvironment(),
            'culturalArtifact' => $this->getRandomCulturalArtifact(),
            'clothing' => $this->randomGenerator->getRandomAttribute('clothing_items'),
        ]);
    }

    /**
     * Get gender for character generation
     */
    protected function getRandomGender(): string
    {
        $genders = $this->attributeRepository->getRandomByCategory('gender', 1);
        return $genders->isNotEmpty() ? $genders->first()->name : 'female'; // default fallback
    }

    /**
     * Get artistic style
     */
    protected function getRandomArtisticStyle(): string
    {
        $styles = $this->attributeRepository->getRandomByCategory('artistic_style', 1);
        return $styles->isNotEmpty() ? $styles->first()->name : 'anime'; // default fallback
    }

    /**
     * Get environment setting
     */
    protected function getRandomEnvironment(): string
    {
        $environments = $this->attributeRepository->getRandomByCategory('environment', 1);
        return $environments->isNotEmpty() ? $environments->first()->name : 'fantasy background'; // default fallback
    }

    /**
     * Get background setting
     */
    protected function getRandomBackground(): string
    {
        // Try environment first, fallback to attribute backgrounds
        $background = $this->randomGenerator->getRandomAttribute('backgrounds');
        return $background ?: 'neutral background';
    }

    /**
     * Get cultural artifact
     */
    protected function getRandomCulturalArtifact(): string
    {
        $artifacts = $this->attributeRepository->getRandomByCategory('cultural_artifact', 1);
        return $artifacts->isNotEmpty() ? $artifacts->first()->name : 'simple item'; // default fallback
    }

    /**
     * Get template for generator type
     */
    protected function getTemplate(string $generatorType, ?string $templateId = null): string
    {
        if ($templateId) {
            $template = $this->templateRepository->findById((int)$templateId);
            if ($template && $template->generator_type === $generatorType && $template->is_active) {
                return $template->template;
            }
        }
        
        // Get default template for generator type
        $template = $this->templateRepository->getDefaultByGeneratorType($generatorType);
        return $template ? $template->template : $this->getFallbackTemplate($generatorType);
    }

    /**
     * Get fallback template if no database template is found
     */
    protected function getFallbackTemplate(string $generatorType): string
    {
        return match ($generatorType) {
            'adventurer' => 'An anime-style portrait of a {experience}-level {race} {class} with {skinColor} skin, {hairColor} {hairStyle} hair, and {eyeColor} eyes with {eyeExpression}. {raceFeatures} {pronoun_subject} wears {equipment} and has {facialFeatures}, {pose} against a {background} in {artisticStyle} style.',
            'alien' => 'Portrait of a {gender} {class} alien from a {climate} world, depicted in a {artisticStyle} style. Physical features: {physicalFeatures}. Hair: {hairStyle} {hairColor} hair. Eyes: {eyeColor} eyes with {eyeExpression}. {pronoun_subject} wears {clothing} and {pose} in {environment}.',
            'anime' => 'An anime-style portrait of a {personality} {species} with {hairColor} {hairStyle} hair and {eyeColor} eyes. {features} {ears} {tail} {wings} {pronoun_subject} wears {clothing} and has {facialFeatures}, {pose} against a {background}.',
            'base' => 'An anime-style character with {hairColor} {hairStyle} hair, {eyeColor} eyes, and {skinColor} skin. {pronoun_subject} has {facialFeatures} and {pose} against a {background} in {artisticStyle} style.',
            default => 'A character with various attributes.'
        };
    }

    /**
     * Replace template variables with attribute values
     */
    protected function processTemplate(string $template, array $replacements): string
    {
        // Handle gender-specific pronouns
        $gender = $replacements['gender'] ?? 'female';
        $pronouns = $this->getPronouns($gender);
        
        // Add pronoun replacements
        $replacements = array_merge($replacements, $pronouns);
        
        // Convert array keys to template variables
        $templateVars = [];
        $templateValues = [];
        
        foreach ($replacements as $key => $value) {
            $templateVars[] = '{' . $key . '}';
            $templateValues[] = is_array($value) ? implode(', ', $value) : (string)$value;
        }
        
        return str_replace($templateVars, $templateValues, $template);
    }

    /**
     * Get pronouns based on gender
     */
    protected function getPronouns(string $gender): array
    {
        return match (strtolower($gender)) {
            'male' => [
                'pronoun_subject' => 'he',
                'pronoun_object' => 'him',
                'pronoun_possessive' => 'his',
                'pronoun_reflexive' => 'himself',
            ],
            'female' => [
                'pronoun_subject' => 'she',
                'pronoun_object' => 'her',
                'pronoun_possessive' => 'her',
                'pronoun_reflexive' => 'herself',
            ],
            default => [
                'pronoun_subject' => 'they',
                'pronoun_object' => 'them',
                'pronoun_possessive' => 'their',
                'pronoun_reflexive' => 'themselves',
            ],
        };
    }

    /**
     * Generate standardized tags
     */
    protected function generateBaseTags(array $attributes, array $additionalTags = []): array
    {
        $baseTags = array_filter([
            $attributes['gender'] ?? null,
            $attributes['hairColor'] ?? null,
            $attributes['skinColor'] ?? null,
            $attributes['eyeColor'] ?? null,
            $attributes['artisticStyle'] ?? null,
            $attributes['environment'] ?? null,
        ]);

        return array_merge($baseTags, $additionalTags);
    }

    /**
     * Get available options for API endpoints
     */
    public function getAvailableGenders(): array
    {
        $genders = $this->attributeRepository->findByCategory('gender');
        return array_map(fn($gender) => $gender->name, $genders);
    }

    public function getAvailableArtisticStyles(): array
    {
        $styles = $this->attributeRepository->findByCategory('artistic_style');
        return array_map(fn($style) => $style->name, $styles);
    }

    public function getAvailableEnvironments(): array
    {
        $environments = $this->attributeRepository->findByCategory('environment');
        return array_map(fn($environment) => $environment->name, $environments);
    }

    /**
     * Get available hair colors
     */
    public function getAvailableHairColors(): array
    {
        return $this->attributeRepository->getAttributeValues('hair_colors') ?? [];
    }

    /**
     * Get available skin colors
     */
    public function getAvailableSkinColors(): array
    {
        return $this->attributeRepository->getAttributeValues('skin_colors') ?? [];
    }

    /**
     * Get available eye colors
     */
    public function getAvailableEyeColors(): array
    {
        return $this->attributeRepository->getAttributeValues('eye_colors') ?? [];
    }

    /**
     * Get available eye styles/expressions
     */
    public function getAvailableEyeStyles(): array
    {
        return $this->attributeRepository->getAttributeValues('eye_expressions') ?? [];
    }

    /**
     * Generate standardized negative prompt
     */
    protected function generateStandardNegativePrompt(): string
    {
        return 'low quality, blurry, malformed anatomy, extra limbs, distorted proportions, unrealistic textures, oversaturated colors, poorly drawn features, asymmetrical when should be symmetrical, floating disconnected parts, inconsistent lighting, pixelated, artifacts';
    }

    /**
     * Create a new species/character instance from available options
     */
    protected function createCharacterInstance(string $name, string $type, array $attributes = []): array
    {
        return [
            'name' => $name,
            'type' => $type,
            'attributes' => $attributes,
            'created_at' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Abstract method for service-specific generation
     */
    abstract public function generatePromptData(...$args): array;
}