<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\Services\PromptGenerationService;

final class GeneratePromptsAction
{
    public function __construct(
        private readonly PromptGenerationService $promptGenerationService
    ) {}

    public function execute(int $count, string $type, ?string $species = null): array
    {
        // Validation
        if ($count <= 0 || $count > 50) {
            throw new \InvalidArgumentException('Count must be between 1 and 50');
        }

        if (empty($type)) {
            throw new \InvalidArgumentException('Type is required');
        }

        $prompts = [];
        $errors = [];

        for ($i = 0; $i < $count; $i++) {
            try {
                $promptData = $this->promptGenerationService->generatePromptData($type, $species);
                
                // Return generated data directly without saving to database
                $prompts[] = [
                    'id' => $i + 1, // Use index as temporary ID
                    'title' => "{$promptData['species']->name} Character " . ($i + 1),
                    'description' => $promptData['description'],
                    'negative_prompt' => $promptData['negative_prompt'],
                    'tags' => $promptData['tags']
                ];

            } catch (\Exception $e) {
                $errors[] = "Error generating prompt " . ($i + 1) . ": " . $e->getMessage();
            }
        }

        return [
            'image_prompts' => $prompts,
            'errors' => $errors
        ];
    }
}
