<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\Services\PromptGenerationService;

final class GeneratePromptsAction
{
    public function __construct(
        private readonly PromptGenerationService $promptGenerationService
    ) {}

    private const MIN_PROMPT_COUNT = 1;
    private const MAX_PROMPT_COUNT = 50;

    public function execute(int $count, string $type, ?string $species = null): array
    {
        // Validation
        if ($count < self::MIN_PROMPT_COUNT || $count > self::MAX_PROMPT_COUNT) {
            throw new \InvalidArgumentException(sprintf(
                'Count must be between %d and %d, got %d', 
                self::MIN_PROMPT_COUNT, 
                self::MAX_PROMPT_COUNT, 
                $count
            ));
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
