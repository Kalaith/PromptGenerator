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
    $app->group('/api/v1', function ($group) {
        
        // Prompt generation routes
        $group->post('/prompts/generate', [PromptController::class, 'generate']);
        
        // Adventurer generation routes
        $group->post('/adventurers/generate', [AdventurerController::class, 'generate']);
        $group->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
        
        // Alien generation routes
        $group->post('/aliens/generate', [AlienController::class, 'generate']);
        $group->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
        
        // User session routes (for favorites, history, preferences)
        $group->get('/session', [UserSessionController::class, 'getSession']);
        $group->post('/session/favorites/add', [UserSessionController::class, 'addToFavorites']);
        $group->post('/session/favorites/remove', [UserSessionController::class, 'removeFromFavorites']);
        $group->post('/session/history/add', [UserSessionController::class, 'addToHistory']);
        $group->post('/session/history/clear', [UserSessionController::class, 'clearHistory']);
        $group->post('/session/preferences', [UserSessionController::class, 'updatePreferences']);
        
        // Species routes
        $group->get('/species', [SpeciesController::class, 'getAll']);
        $group->get('/species/types', [SpeciesController::class, 'getTypes']);
        
        // Health check
        $group->get('/health', function ($request, $response) {
            $response->getBody()->write(json_encode([
                'status' => 'healthy',
                'version' => $_ENV['API_VERSION'] ?? 'v1',
                'timestamp' => date('c')
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        });
    });
};
