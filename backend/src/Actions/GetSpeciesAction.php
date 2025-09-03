<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\SpeciesRepository;

final class GetSpeciesAction
{
    public function __construct(
        private readonly SpeciesRepository $speciesRepository
    ) {}

    public function execute(?string $type = null): array
    {
        try {
            if ($type) {
                $species = $this->speciesRepository->findActiveByType($type);
            } else {
                $species = $this->speciesRepository->getAllActive();
            }

            return [
                'species' => $species->map(function ($species) {
                    return [
                        'id' => $species->id,
                        'name' => $species->name,
                        'type' => $species->type,
                        'species_name' => $species->species_name,
                        'features' => $species->features,
                        'personality' => $species->personality
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
