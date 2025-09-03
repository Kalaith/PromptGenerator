<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\SpeciesRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\Models\Species;

final class PromptGenerationService
{
    public function __construct(
        private readonly SpeciesRepository $speciesRepository,
        private readonly AttributeRepository $attributeRepository,
        private readonly RandomGeneratorService $randomGenerator
    ) {}

    public function generatePromptData(string $type, ?string $speciesName = null): array
    {
        // Handle random type selection
        $actualType = $type;
        if ($type === 'random') {
            $availableTypes = $this->speciesRepository->getAllTypes();
            $actualType = $this->randomGenerator->getRandomElement($availableTypes);
        }

        // Get species data
        $species = $this->getSpeciesForGeneration($actualType, $speciesName);
        if (!$species) {
            throw new \InvalidArgumentException("No species found for type: {$actualType}");
        }

        // Generate attributes
        $attributes = $this->generateAttributes();

        // Generate description
        $description = $this->generateDescription($species, $attributes);

        return [
            'species' => $species,
            'attributes' => $attributes,
            'description' => $description,
            'negative_prompt' => $species->negative_prompt,
            'tags' => array_merge(
                [$species->name],
                $species->personality ?? [],
                array_values(array_filter([
                    $attributes['hairColor'] ?? null,
                    $attributes['eyeColor'] ?? null
                ]))
            )
        ];
    }

    private function getSpeciesForGeneration(string $type, ?string $speciesName): ?Species
    {
        if ($speciesName === 'random' || $speciesName === null) {
            return $this->speciesRepository->getRandomByType($type);
        }

        $species = $this->speciesRepository->findByName($speciesName);
        if ($species && $species->type === $type) {
            return $species;
        }

        // Fallback to random if specific species not found
        return $this->speciesRepository->getRandomByType($type);
    }

    private function generateAttributes(): array
    {
        return [
            'hairColor' => $this->randomGenerator->getRandomAttribute('hair_colors'),
            'hairStyle' => $this->randomGenerator->getRandomAttribute('hair_styles'),
            'eyeColor' => $this->randomGenerator->getRandomAttribute('eye_colors'),
            'eyeExpression' => $this->randomGenerator->getRandomAttribute('eye_expressions'),
            'background' => $this->randomGenerator->getRandomAttribute('backgrounds'),
            'pose' => $this->randomGenerator->getRandomAttribute('poses'),
            'clothing' => $this->randomGenerator->getRandomAttribute('clothing_items'),
            'accessory' => $this->randomGenerator->shouldRandomlyOccur(0.5) 
                ? $this->randomGenerator->getRandomAttribute('accessories') 
                : '',
            'facialFeatures' => $this->randomGenerator->getRandomAttributes('facial_features', $this->randomGenerator->generateRandomInt(1, 3))
        ];
    }

    private function generateDescription(Species $species, array $attributes): string
    {
        $template = $species->description_template;
        if (!$template) {
            return "A {species} character with {features}.";
        }

        // Get dynamic features
        $features = $species->features ? 
            $this->randomGenerator->getRandomElements($species->features, $this->randomGenerator->generateRandomInt(1, count($species->features))) : 
            [];
        
        $personality = $species->personality ? 
            $this->randomGenerator->getRandomElements($species->personality, $this->randomGenerator->generateRandomInt(1, 2)) : 
            [];

        // Replace template variables
        $description = str_replace([
            '{personality}',
            '{species}',
            '{features}',
            '{ears}',
            '{tail}',
            '{wings}',
            '{hairColor}',
            '{hairStyle}',
            '{eyeColor}',
            '{eyeExpression}',
            '{background}',
            '{clothing}',
            '{pose}',
            '{accessories}',
            '{facialFeatures}'
        ], [
            implode(' and ', $personality),
            $species->species_name ?? $species->name,
            implode(', ', $features),
            $species->ears ?? '',
            $species->tail ?? '',
            $species->wings ?? '',
            $attributes['hairColor'] ?? '',
            $attributes['hairStyle'] ?? '',
            $attributes['eyeColor'] ?? '',
            $attributes['eyeExpression'] ?? '',
            $attributes['background'] ?? '',
            $attributes['clothing'] ?? '',
            $attributes['pose'] ?? '',
            $attributes['accessory'] ? ' while wearing ' . $attributes['accessory'] : '',
            implode(', ', $attributes['facialFeatures'] ?? [])
        ], $template);

        return $description;
    }
}
