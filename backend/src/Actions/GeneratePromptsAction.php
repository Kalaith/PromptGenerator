<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\PromptRepository;
use AnimePromptGen\Models\Prompt;
use AnimePromptGen\Services\PromptGenerationService;

final class GeneratePromptsAction
{
    public function __construct(
        private readonly PromptRepository $promptRepository,
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
                
                $prompt = new Prompt();
                $prompt->title = "{$promptData['species']->name} Character " . ($i + 1);
                $prompt->description = $promptData['description'];
                $prompt->negative_prompt = $promptData['negative_prompt'];
                $prompt->tags = $promptData['tags'];
                $prompt->species_id = $promptData['species']->id;
                $prompt->prompt_type = $type;
                $prompt->generated_at = date('Y-m-d H:i:s');

                $savedPrompt = $this->promptRepository->create($prompt);
                
                $prompts[] = [
                    'id' => $savedPrompt->id,
                    'title' => $savedPrompt->title,
                    'description' => $savedPrompt->description,
                    'negative_prompt' => $savedPrompt->negative_prompt,
                    'tags' => $savedPrompt->tags
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
