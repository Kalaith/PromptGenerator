<?php

declare(strict_types=1);

use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\SpeciesController;
use AnimePromptGen\Actions\GeneratePromptsAction;
use AnimePromptGen\Actions\GenerateAdventurerAction;
use AnimePromptGen\Actions\GetSpeciesAction;
use AnimePromptGen\External\SpeciesRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\PromptRepository;
use AnimePromptGen\External\AdventurerClassRepository;
use AnimePromptGen\Services\PromptGenerationService;
use AnimePromptGen\Services\AdventurerGenerationService;
use AnimePromptGen\Services\RandomGeneratorService;

return [
    // Repositories
    SpeciesRepository::class => \DI\autowire(),
    AttributeRepository::class => \DI\autowire(),
    PromptRepository::class => \DI\autowire(),
    AdventurerClassRepository::class => \DI\autowire(),

    // Services
    RandomGeneratorService::class => \DI\autowire(),
    PromptGenerationService::class => \DI\autowire(),
    AdventurerGenerationService::class => \DI\autowire(),

    // Actions
    GeneratePromptsAction::class => \DI\autowire(),
    GenerateAdventurerAction::class => \DI\autowire(),
    GetSpeciesAction::class => \DI\autowire(),

    // Controllers
    PromptController::class => \DI\autowire(),
    AdventurerController::class => \DI\autowire(),
    SpeciesController::class => \DI\autowire(),
];
