<?php

declare(strict_types=1);

use Slim\App;
use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\SpeciesController;

return function (App $app) {
    // API base path
    $app->group('/api/v1', function () use ($app) {
        
        // Prompt generation routes
        $app->post('/prompts/generate', [PromptController::class, 'generate']);
        
        // Adventurer generation routes
        $app->post('/adventurers/generate', [AdventurerController::class, 'generate']);
        $app->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
        
        // Species routes
        $app->get('/species', [SpeciesController::class, 'getAll']);
        $app->get('/species/types', [SpeciesController::class, 'getTypes']);
        
        // Health check
        $app->get('/health', function ($request, $response) {
            $response->getBody()->write(json_encode([
                'status' => 'healthy',
                'version' => $_ENV['API_VERSION'] ?? 'v1',
                'timestamp' => date('c')
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        });
    });
};
