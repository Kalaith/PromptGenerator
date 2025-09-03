<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\Services\AdventurerGenerationService;

final class GenerateAdventurerAction
{
    public function __construct(
        private readonly AdventurerGenerationService $adventurerGenerationService
    ) {}

    public function execute(?string $race = null, ?string $className = null, ?string $experience = null): array
    {
        // Validation
        if ($race !== null && !in_array($race, ['random', 'dragonkin', 'dwarf', 'elf', 'goblin', 'halfling', 'human', 'orc', 'tiefling', 'half-elf', 'gnome', 'half-orc', 'aasimar', 'genasi', 'tabaxi', 'kenku', 'lizardfolk'])) {
            throw new \InvalidArgumentException('Invalid race specified');
        }

        if ($experience !== null && !in_array($experience, ['low', 'mid', 'high'])) {
            throw new \InvalidArgumentException('Invalid experience level specified');
        }

        try {
            $adventurerData = $this->adventurerGenerationService->generateAdventurerPrompt($race, $className, $experience);
            
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
