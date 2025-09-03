<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\Models\Prompt;
use AnimePromptGen\Services\AlienGenerationService;

final class GenerateAlienAction
{
    public function __construct(
        private readonly AlienGenerationService $alienGenerationService
    ) {}

    public function execute(
        int $count,
        ?string $speciesClass = null,
        ?string $climate = null,
        ?string $positiveTrait = null,
        ?string $negativeTrait = null,
        ?string $style = null,
        ?string $environment = null,
        ?string $gender = null
    ): array {
        $safeCount = max(1, min($count, 10)); // Limit to reasonable range
        $image_prompts = [];
        $errors = [];

        for ($i = 0; $i < $safeCount; $i++) {
            try {
                $promptData = $this->alienGenerationService->generateAlienPromptData(
                    $speciesClass,
                    $climate,
                    $positiveTrait,
                    $negativeTrait,
                    $style,
                    $environment,
                    $gender
                );

                // Create and save prompt
                $prompt = Prompt::create([
                    'title' => sprintf(
                        '%s Alien (%s World, %s)',
                        $promptData['species']->class ?? 'Unknown',
                        $promptData['climate'] ?? 'Unknown',
                        $promptData['style'] ?? 'Unknown'
                    ),
                    'description' => $promptData['description'],
                    'negative_prompt' => $promptData['negative_prompt'],
                    'tags' => $promptData['tags'],
                    'prompt_type' => 'alien'
                ]);

                $image_prompts[] = $prompt->toArray();

            } catch (\Exception $e) {
                $errors[] = "Error generating alien prompt " . ($i + 1) . ": " . $e->getMessage();
            }
        }

        return [
            'image_prompts' => $image_prompts,
            'errors' => $errors
        ];
    }
}