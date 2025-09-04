<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\GameAttributeRepository;

final class GetGameAttributeCategoriesAction
{
    public function __construct(
        private readonly GameAttributeRepository $gameAttributeRepository
    ) {}

    /**
     * Get all categories for a given type
     */
    public function execute(string $type): array
    {
        // Validation
        if (empty($type)) {
            throw new \InvalidArgumentException('Type parameter is required');
        }

        $validTypes = ['climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact', 'experience_level'];
        if (!in_array($type, $validTypes)) {
            throw new \InvalidArgumentException('Invalid type parameter');
        }

        // Business logic
        $categories = $this->gameAttributeRepository->getCategoriesByType($type);

        return [
            'type' => $type,
            'categories' => $categories,
            'count' => count($categories)
        ];
    }
}