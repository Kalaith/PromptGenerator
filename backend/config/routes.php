<?php

declare(strict_types=1);

use Slim\App;
use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\AlienController;
use AnimePromptGen\Controllers\UserSessionController;
use AnimePromptGen\Controllers\SpeciesController;
use AnimePromptGen\Controllers\TemplateController;
use AnimePromptGen\Controllers\DescriptionTemplateController;

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
        
        // Template routes (specific routes must come before parameterized routes)
        $group->get('/templates', [TemplateController::class, 'getAll']);
        $group->get('/templates/popular', [TemplateController::class, 'getPopular']);
        $group->get('/templates/recent', [TemplateController::class, 'getRecent']);
        $group->get('/templates/search', [TemplateController::class, 'search']);
        $group->post('/templates', [TemplateController::class, 'create']);
        $group->get('/templates/{id}', [TemplateController::class, 'getById']);
        $group->put('/templates/{id}', [TemplateController::class, 'update']);
        $group->delete('/templates/{id}', [TemplateController::class, 'delete']);
        $group->post('/templates/{id}/use', [TemplateController::class, 'incrementUsage']);
        $group->post('/templates/{id}/clone', [TemplateController::class, 'clone']);
        
        // Description template routes (specific routes must come before parameterized routes)
        $group->get('/description-templates', [DescriptionTemplateController::class, 'getTemplates']);
        $group->get('/description-templates/generator-types', [DescriptionTemplateController::class, 'getGeneratorTypes']);
        $group->post('/description-templates/bulk/{generator_type}', [DescriptionTemplateController::class, 'bulkUpdateTemplates']);
        $group->post('/description-templates', [DescriptionTemplateController::class, 'createTemplate']);
        $group->get('/description-templates/{id}', [DescriptionTemplateController::class, 'getTemplate']);
        $group->put('/description-templates/{id}', [DescriptionTemplateController::class, 'updateTemplate']);
        $group->delete('/description-templates/{id}', [DescriptionTemplateController::class, 'deleteTemplate']);
        
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
    
    // Direct routes (without API prefix) for backward compatibility and direct browser access
    $app->get('/templates', [TemplateController::class, 'getAll']);
    $app->get('/templates/popular', [TemplateController::class, 'getPopular']);
    $app->get('/templates/recent', [TemplateController::class, 'getRecent']);
    $app->get('/templates/search', [TemplateController::class, 'search']);
    $app->post('/templates', [TemplateController::class, 'create']);
    $app->get('/templates/{id}', [TemplateController::class, 'getById']);
    $app->put('/templates/{id}', [TemplateController::class, 'update']);
    $app->delete('/templates/{id}', [TemplateController::class, 'delete']);
    $app->post('/templates/{id}/use', [TemplateController::class, 'incrementUsage']);
    $app->post('/templates/{id}/clone', [TemplateController::class, 'clone']);
    
    // Description template routes (direct access - specific routes must come before parameterized routes)
    $app->get('/description-templates', [DescriptionTemplateController::class, 'getTemplates']);
    $app->get('/description-templates/generator-types', [DescriptionTemplateController::class, 'getGeneratorTypes']);
    $app->post('/description-templates/bulk/{generator_type}', [DescriptionTemplateController::class, 'bulkUpdateTemplates']);
    $app->post('/description-templates', [DescriptionTemplateController::class, 'createTemplate']);
    $app->get('/description-templates/{id}', [DescriptionTemplateController::class, 'getTemplate']);
    $app->put('/description-templates/{id}', [DescriptionTemplateController::class, 'updateTemplate']);
    $app->delete('/description-templates/{id}', [DescriptionTemplateController::class, 'deleteTemplate']);
    
    $app->get('/species', [SpeciesController::class, 'getAll']);
    $app->get('/species/types', [SpeciesController::class, 'getTypes']);
    
    $app->post('/prompts/generate', [PromptController::class, 'generate']);
    $app->post('/adventurers/generate', [AdventurerController::class, 'generate']);
    $app->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
    $app->post('/aliens/generate', [AlienController::class, 'generate']);
    $app->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
    
    // Health check (direct access)
    $app->get('/health', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'status' => 'healthy',
            'version' => $_ENV['API_VERSION'] ?? 'v1',
            'timestamp' => date('c')
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });
};
