<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\GameAttributeRepository;

final class InitializeGameAttributesAction
{
    public function __construct(
        private readonly GameAttributeRepository $gameAttributeRepository
    ) {}

    /**
     * Initialize default game attributes
     */
    public function execute(): array
    {
        // Business logic - Initialize default data
        $initializedCount = 0;

        // Climate data
        $climateData = [
            ['wet', 'continental', 'Continental', 'Moderate temperature with high rainfall', 10],
            ['wet', 'ocean', 'Ocean', 'Water-dominated world with high humidity', 8],
            ['wet', 'tropical', 'Tropical', 'Hot and humid with abundant precipitation', 10],
            ['dry', 'savanna', 'Savanna', 'Grasslands with seasonal rainfall', 8],
            ['dry', 'alpine', 'Alpine', 'High altitude with low precipitation', 6],
            ['dry', 'steppe', 'Steppe', 'Semi-arid grasslands', 7],
            ['cold', 'desert', 'Desert', 'Arid with extreme temperature variations', 9],
            ['cold', 'tundra', 'Tundra', 'Frozen ground with minimal vegetation', 5],
            ['cold', 'arctic', 'Arctic', 'Permanently frozen polar regions', 4]
        ];

        foreach ($climateData as [$category, $name, $value, $description, $weight]) {
            if (!$this->gameAttributeRepository->exists($name, 'environment', $category)) {
                $this->gameAttributeRepository->create(
                    $category, $name, $value, 'environment', $description, null, true, $weight
                );
                $initializedCount++;
            }
        }

        // Gender data
        $genders = [
            ['male', 'Male character', 10],
            ['female', 'Female character', 10]
        ];

        foreach ($genders as [$name, $description, $weight]) {
            if (!$this->gameAttributeRepository->exists($name, 'character', 'standard')) {
                $this->gameAttributeRepository->create(
                    'gender', $name, $name, 'character', $description, null, true, $weight
                );
                $initializedCount++;
            }
        }

        // Artistic styles
        $styles = [
            ['cyberpunk', 'High-tech, low-life aesthetic', 8],
            ['fantasy', 'Magical and mythical themes', 10],
            ['realistic', 'Photorealistic representation', 9],
            ['surreal', 'Dreamlike and abstract', 6],
            ['biomechanical', 'Fusion of organic and mechanical', 7],
            ['retro-futuristic', 'Vintage vision of the future', 6],
            ['minimalist', 'Clean and simple design', 5],
            ['baroque', 'Ornate and dramatic style', 4]
        ];

        foreach ($styles as [$name, $description, $weight]) {
            if (!$this->gameAttributeRepository->exists($name, 'visual', 'visual')) {
                $this->gameAttributeRepository->create(
                    'artistic_style', $name, $name, 'visual', $description, null, true, $weight
                );
                $initializedCount++;
            }
        }

        return [
            'message' => 'Default attributes initialized successfully',
            'initialized_count' => $initializedCount
        ];
    }
}