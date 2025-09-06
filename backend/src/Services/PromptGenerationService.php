<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\UnifiedSpeciesRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\DescriptionTemplateRepository;
use AnimePromptGen\Models\UnifiedSpecies;

final class PromptGenerationService extends BaseGenerationService
{
    public function __construct(
        private readonly UnifiedSpeciesRepository $speciesRepository,
        AttributeRepository $attributeRepository,
        RandomGeneratorService $randomGenerator,
        DescriptionTemplateRepository $templateRepository
    ) {
        parent::__construct($attributeRepository, $randomGenerator, $templateRepository);
    }

    public function generatePromptData(...$args): array
    {
        // Extract arguments
        $type = $args[0] ?? 'random';
        $speciesName = $args[1] ?? null;
        $gender = $args[2] ?? null;
        $style = $args[3] ?? null;
        $environment = $args[4] ?? null;
        
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

        try {
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
        } catch (\Throwable $e) {
            throw new \RuntimeException(
                sprintf('Failed to generate prompt data for species %s: %s', $species->name, $e->getMessage()),
                0,
                $e
            );
        }
    }

    private function getSpeciesForGeneration(string $type, ?string $speciesName): ?UnifiedSpecies
    {
        if ($speciesName === 'random' || $speciesName === null) {
            return $this->speciesRepository->getRandomByType($type);
        }

        $species = $this->speciesRepository->findByNameAndType($speciesName, $type);
        if ($species) {
            return $species;
        }

        // Fallback to random if specific species not found
        return $this->speciesRepository->getRandomByType($type);
    }


    private function generateDescription(UnifiedSpecies $species, array $attributes): string
    {
        // Get dynamic features - handle nested arrays from CSV import
        $features = [];
        if ($species->features) {
            $flatFeatures = [];
            foreach ($species->features as $featureGroup) {
                if (is_array($featureGroup)) {
                    $flatFeatures = array_merge($flatFeatures, $featureGroup);
                } else {
                    $flatFeatures[] = $featureGroup;
                }
            }
            $features = $flatFeatures ? $this->randomGenerator->getRandomElements($flatFeatures, $this->randomGenerator->generateRandomInt(1, min(3, count($flatFeatures)))) : [];
        }
        
        $personality = [];
        if ($species->personality) {
            $flatPersonality = [];
            foreach ($species->personality as $personalityGroup) {
                if (is_array($personalityGroup)) {
                    $flatPersonality = array_merge($flatPersonality, $personalityGroup);
                } else {
                    $flatPersonality[] = $personalityGroup;
                }
            }
            $personality = $flatPersonality ? $this->randomGenerator->getRandomElements($flatPersonality, $this->randomGenerator->generateRandomInt(1, min(2, count($flatPersonality)))) : [];
        }

        // Build a simple description
        $description = "A {$species->name} character";
        
        if ($features) {
            $description .= " with " . implode(', ', $features);
        }
        
        if ($personality) {
            $description .= " who is " . implode(' and ', $personality);
        }
        
        if ($species->ears) {
            $description .= " with " . $species->ears;
        }
        
        if ($species->tail) {
            $description .= " and " . $species->tail;
        }
        
        if ($species->wings) {
            $description .= " and " . $species->wings;
        }

        return $description . ".";
    }
}
