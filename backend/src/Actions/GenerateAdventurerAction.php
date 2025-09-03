<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\Services\AdventurerGenerationService;

final class GenerateAdventurerAction
{
    public function __construct(
        private readonly AdventurerGenerationService $adventurerGenerationService
    ) {}

    public function execute(
        ?string $race = null, 
        ?string $className = null, 
        ?string $experience = null, 
        ?string $gender = null, 
        ?string $style = null, 
        ?string $environment = null,
        ?string $hairColor = null,
        ?string $skinColor = null, 
        ?string $eyeColor = null,
        ?string $eyeStyle = null,
        ?string $templateId = null
    ): array {
        // Basic validation - let service handle detailed validation
        if ($experience !== null && !in_array($experience, ['low', 'mid', 'high', 'random'])) {
            throw new \InvalidArgumentException('Invalid experience level specified');
        }

        try {
            $adventurerData = $this->adventurerGenerationService->generatePromptData(
                $race, $className, $experience, $gender, $style, $environment,
                $hairColor, $skinColor, $eyeColor, $eyeStyle, $templateId
            );
            
            return [
                'id' => uniqid(),
                'title' => ucfirst($adventurerData['experience']) . ' ' . ucfirst($adventurerData['race']) . ' ' . ucfirst($adventurerData['class']),
                'description' => $adventurerData['description'],
                'negative_prompt' => $adventurerData['negative_prompt'],
                'tags' => $adventurerData['tags']
            ];

        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to generate adventurer: ' . $e->getMessage());
        }
    }

    public function executeMultiple(int $count): array
    {
        if ($count <= 0 || $count > 50) {
            throw new \InvalidArgumentException('Count must be between 1 and 50');
        }

        $adventurers = [];
        $errors = [];

        for ($i = 0; $i < $count; $i++) {
            try {
                $adventurers[] = $this->execute();
            } catch (\Exception $e) {
                $errors[] = "Error generating adventurer " . ($i + 1) . ": " . $e->getMessage();
            }
        }

        return [
            'adventurers' => $adventurers,
            'errors' => $errors
        ];
    }
}
