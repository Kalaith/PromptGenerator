<?php

declare(strict_types=1);

use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\AlienController;
use AnimePromptGen\Controllers\UserSessionController;
use AnimePromptGen\Controllers\SpeciesController;
use AnimePromptGen\Controllers\TemplateController;
use AnimePromptGen\Controllers\DescriptionTemplateController;
use AnimePromptGen\Controllers\GameAssetsController;
use AnimePromptGen\Actions\GeneratePromptsAction;
use AnimePromptGen\Actions\GenerateAdventurerAction;
use AnimePromptGen\Actions\GenerateAlienAction;
use AnimePromptGen\Actions\GetSpeciesAction;
use AnimePromptGen\External\SpeciesRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\PromptRepository;
use AnimePromptGen\External\AdventurerClassRepository;
use AnimePromptGen\External\AlienSpeciesRepository;
use AnimePromptGen\External\AlienTraitRepository;
use AnimePromptGen\External\UserSessionRepository;
use AnimePromptGen\External\TemplateRepository;
use AnimePromptGen\External\DescriptionTemplateRepository;
use AnimePromptGen\External\GameAssetRepository;
use AnimePromptGen\Services\PromptGenerationService;
use AnimePromptGen\Services\AdventurerGenerationService;
use AnimePromptGen\Services\AlienGenerationService;
use AnimePromptGen\Services\RandomGeneratorService;

return [
    // Database connection
    PDO::class => function () {
        $driver = $_ENV['DB_DRIVER'] ?? 'mysql';
        
        if ($driver === 'mysql') {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                $_ENV['DB_HOST'] ?? 'localhost',
                $_ENV['DB_PORT'] ?? '3306',
                $_ENV['DB_DATABASE'] ?? 'prompt_gen'
            );
            $username = $_ENV['DB_USERNAME'] ?? 'root';
            $password = $_ENV['DB_PASSWORD'] ?? '';
        } else {
            $dsn = 'sqlite:' . ($_ENV['DB_DATABASE'] ?? __DIR__ . '/../database/anime_prompt_gen.sqlite');
            $username = null;
            $password = null;
        }
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        return new PDO($dsn, $username, $password, $options);
    },
    
    // Repositories
    SpeciesRepository::class => \DI\autowire(),
    AttributeRepository::class => \DI\autowire(),
    PromptRepository::class => \DI\autowire(),
    AdventurerClassRepository::class => \DI\autowire(),
    AlienSpeciesRepository::class => \DI\autowire(),
    AlienTraitRepository::class => \DI\autowire(),
    UserSessionRepository::class => \DI\autowire(),
    TemplateRepository::class => \DI\autowire(),
    DescriptionTemplateRepository::class => \DI\autowire(),
    GameAssetRepository::class => \DI\autowire(),

    // Services
    RandomGeneratorService::class => \DI\autowire(),
    PromptGenerationService::class => \DI\autowire(),
    AdventurerGenerationService::class => \DI\autowire(),
    AlienGenerationService::class => \DI\autowire(),

    // Actions
    GeneratePromptsAction::class => \DI\autowire(),
    GenerateAdventurerAction::class => \DI\autowire(),
    GenerateAlienAction::class => \DI\autowire(),
    GetSpeciesAction::class => \DI\autowire(),

    // Controllers
    PromptController::class => \DI\autowire(),
    AdventurerController::class => \DI\autowire(),
    AlienController::class => \DI\autowire(),
    UserSessionController::class => \DI\autowire(),
    SpeciesController::class => \DI\autowire(),
    TemplateController::class => \DI\autowire(),
    DescriptionTemplateController::class => \DI\autowire(),
    GameAssetsController::class => \DI\autowire(),
];
