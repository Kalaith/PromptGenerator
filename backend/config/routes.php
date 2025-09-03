<?php

declare(strict_types=1);

use Slim\App;
use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\AlienController;
use AnimePromptGen\Controllers\UserSessionController;
use AnimePromptGen\Controllers\SpeciesController;

return function (App $app) {
    // API base path
    $app->group('/api/v1', function () use ($app) {
        
        // Prompt generation routes
        $app->post('/prompts/generate', [PromptController::class, 'generate']);
        
        // Adventurer generation routes
        $app->post('/adventurers/generate', [AdventurerController::class, 'generate']);
        $app->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
        
        // Alien generation routes
        $app->post('/aliens/generate', [AlienController::class, 'generate']);
        $app->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
        
        // User session routes (for favorites, history, preferences)
        $app->get('/session', [UserSessionController::class, 'getSession']);
        $app->post('/session/favorites/add', [UserSessionController::class, 'addToFavorites']);
        $app->post('/session/favorites/remove', [UserSessionController::class, 'removeFromFavorites']);
        $app->post('/session/history/add', [UserSessionController::class, 'addToHistory']);
        $app->post('/session/history/clear', [UserSessionController::class, 'clearHistory']);
        $app->post('/session/preferences', [UserSessionController::class, 'updatePreferences']);
        
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
