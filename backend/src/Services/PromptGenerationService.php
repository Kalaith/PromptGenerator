<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\UnifiedSpeciesRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\GameAssetRepository;
use AnimePromptGen\Models\UnifiedSpecies;

final class PromptGenerationService extends BaseGenerationService
{
    public function __construct(
        private readonly UnifiedSpeciesRepository $speciesRepository,
        AttributeRepository $attributeRepository,
        GameAssetRepository $gameAssetRepository,
        RandomGeneratorService $randomGenerator
    ) {
        parent::__construct($attributeRepository, $gameAssetRepository, $randomGenerator);
    }

    public function generatePromptData(string $type, ?string $speciesName = null, ?string $gender = null, ?string $style = null, ?string $environment = null): array
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

        // Generate attributes with extended options
        $attributes = $this->generateExtendedAttributes($gender, $style, $environment);

        // Generate description
        $description = $this->generateDescription($species, $attributes);

        return [
            'species' => $species,
            'attributes' => $attributes,
            'description' => $description,
            'negative_prompt' => $species->negative_prompt ?: $this->generateStandardNegativePrompt(),
            'tags' => $this->generateBaseTags($attributes, array_merge(
                [$species->name],
                $species->personality ?? []
            ))
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

        // Prepare template replacements
        $replacements = array_merge($attributes, [
            'personality' => implode(' and ', $personality),
            'species' => $species->species_name ?? $species->name,
            'features' => implode(', ', $features),
            'ears' => $species->ears ?? '',
            'tail' => $species->tail ?? '',
            'wings' => $species->wings ?? '',
            'accessories' => $attributes['accessory'] ? ' while wearing ' . $attributes['accessory'] : '',
        ]);

        return $this->processTemplate($template, $replacements);
    }
}
