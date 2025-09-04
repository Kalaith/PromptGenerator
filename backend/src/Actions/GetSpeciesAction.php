<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\UnifiedSpeciesRepository;

final class GetSpeciesAction
{
    public function __construct(
        private readonly UnifiedSpeciesRepository $speciesRepository
    ) {}

    public function execute(?string $type = null): array
    {
        try {
            if ($type) {
                $species = $this->speciesRepository->findByType($type);
            } else {
                $species = $this->speciesRepository->getAllActive();
            }

            return [
                'species' => $species->map(function ($species) {
                    return [
                        'id' => $species->id,
                        'name' => $species->name,
                        'type' => $species->type,
                        'category' => $species->category,
                        'ears' => $species->ears,
                        'tail' => $species->tail,
                        'wings' => $species->wings,
                        'features' => $species->features,
                        'personality' => $species->personality,
                        'key_traits' => $species->key_traits,
                        'visual_descriptors' => $species->visual_descriptors,
                        'physical_features' => $species->physical_features,
                        'ai_prompt_elements' => $species->ai_prompt_elements,
                        'is_active' => $species->is_active,
                        'weight' => $species->weight
                    ];
                })->toArray()
            ];

        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to get species: ' . $e->getMessage());
        }
    }

    public function getTypes(): array
    {
        try {
            return [
                'types' => $this->speciesRepository->getAllTypes()
            ];
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to get species types: ' . $e->getMessage());
        }
    }
}
