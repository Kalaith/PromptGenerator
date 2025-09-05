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
use AnimePromptGen\Controllers\GameAssetsController;
use AnimePromptGen\Controllers\AnimeAttributesController;
use AnimePromptGen\Controllers\GeneratorAttributesController;
use AnimePromptGen\Controllers\AttributeConfigController;

return function (App $app) {
    // API base path
    $app->group('/api/v1', function ($group) {
        
        // Prompt generation routes
        $group->post('/prompts/generate', [PromptController::class, 'generate']);
        
        // Adventurer generation routes
        $group->post('/adventurers/generate', [AdventurerController::class, 'generate']);
        $group->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
        $group->get('/adventurers/options', [AdventurerController::class, 'getAvailableOptions']);
        
        // Alien generation routes
        $group->post('/aliens/generate', [AlienController::class, 'generate']);
        $group->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
        $group->get('/aliens/genders', [AlienController::class, 'getGenders']);
        $group->get('/aliens/artistic-styles', [AlienController::class, 'getArtisticStyles']);
        $group->get('/aliens/environments', [AlienController::class, 'getEnvironments']);
        $group->get('/aliens/climates', [AlienController::class, 'getClimates']);
        
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
        
        // Generic attributes route (replaces specific routes)
        $group->get('/attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
        $group->get('/generator-attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
        
        // Legacy anime attributes route (for backward compatibility)
        $group->get('/anime/attributes', [AnimeAttributesController::class, 'getAttributes']);
        
        // Attribute configuration management
        $group->get('/attribute-config', [AttributeConfigController::class, 'getConfigs']);
        $group->post('/attribute-config', [AttributeConfigController::class, 'createConfig']);
        $group->put('/attribute-config/{id}', [AttributeConfigController::class, 'updateConfig']);
        $group->delete('/attribute-config/{id}', [AttributeConfigController::class, 'deleteConfig']);
        
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
        
        // Game assets routes (specific routes must come before parameterized routes)
        $group->get('/game-assets/types', [GameAssetsController::class, 'getAssetTypes']);
        $group->post('/game-assets/initialize', [GameAssetsController::class, 'initializeAssets']);
        $group->get('/game-assets/{type}', [GameAssetsController::class, 'getAssetsByType']);
        $group->get('/game-assets/{type}/categories', [GameAssetsController::class, 'getCategoriesByType']);
        
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
    
    // Game assets routes (direct access - specific routes must come before parameterized routes)
    $app->get('/game-assets/types', [GameAssetsController::class, 'getAssetTypes']);
    $app->post('/game-assets/initialize', [GameAssetsController::class, 'initializeAssets']);
    $app->get('/game-assets/{type}', [GameAssetsController::class, 'getAssetsByType']);
    $app->get('/game-assets/{type}/categories', [GameAssetsController::class, 'getCategoriesByType']);
    
    $app->get('/species', [SpeciesController::class, 'getAll']);
    $app->get('/species/types', [SpeciesController::class, 'getTypes']);
    
    $app->get('/generator-attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
    $app->get('/attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
    
    $app->post('/prompts/generate', [PromptController::class, 'generate']);
    $app->post('/adventurers/generate', [AdventurerController::class, 'generate']);
    $app->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
    $app->get('/adventurers/options', [AdventurerController::class, 'getAvailableOptions']);
    $app->post('/aliens/generate', [AlienController::class, 'generate']);
    $app->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
    $app->get('/aliens/genders', [AlienController::class, 'getGenders']);
    $app->get('/aliens/artistic-styles', [AlienController::class, 'getArtisticStyles']);
    $app->get('/aliens/environments', [AlienController::class, 'getEnvironments']);
    $app->get('/aliens/climates', [AlienController::class, 'getClimates']);
    
    // Attribute configuration management (direct access)
    $app->get('/attribute-config', [AttributeConfigController::class, 'getConfigs']);
    $app->post('/attribute-config', [AttributeConfigController::class, 'createConfig']);
    $app->put('/attribute-config/{id}', [AttributeConfigController::class, 'updateConfig']);
    $app->delete('/attribute-config/{id}', [AttributeConfigController::class, 'deleteConfig']);
    
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
